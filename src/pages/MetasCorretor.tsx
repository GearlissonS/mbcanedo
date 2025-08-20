import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { safeSelect, safeInsert } from "@/lib/safeSupabaseClient";
import confetti from "canvas-confetti";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { exportXLSX, exportPDF } from "../utils/exporters";

// Data types
export type Broker = { id: string; nome: string };

export type BrokerMonthMeta = {
  corretorId: string;
  nome: string;
  ano: number;
  mes: MonthIndex; // 0-11
  metaPiso: number;
  realizado: number; // calculado de vendas
  observacoes?: string;
};

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

const MONTHS: { key: MonthIndex; label: string }[] = [
  { key: 0, label: "Jan" },
  { key: 1, label: "Fev" },
  { key: 2, label: "Mar" },
  { key: 3, label: "Abr" },
  { key: 4, label: "Mai" },
  { key: 5, label: "Jun" },
  { key: 6, label: "Jul" },
  { key: 7, label: "Ago" },
  { key: 8, label: "Set" },
  { key: 9, label: "Out" },
  { key: 10, label: "Nov" },
  { key: 11, label: "Dez" },
];

function currency(v: number) {
  return `R$ ${Math.round(v || 0).toLocaleString("pt-BR")}`;
}

function pct(done: number, target: number) {
  if (!target || target <= 0) return 0;
  return Math.max(0, Math.min(100, (done / target) * 100));
}

function classByProgress(progress: number) {
  if (progress >= 90) return "bg-green-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

// Minimal colored progress bar using Tailwind ("similar" to shadcn Progress)
function ColoredProgress({ value, colorClass }: { value: number; colorClass: string }) {
  return (
    <div className="h-2 w-full rounded bg-muted">
      <div className={`h-2 rounded ${colorClass}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

type MetaMap = Record<MonthIndex, Record<string /*corretorId*/, BrokerMonthMeta>>;

export default function MetasCorretor() {
  const now = new Date();
  const thisYear = now.getFullYear();
  const [year, setYear] = useState<number>(thisYear);
  const [month, setMonth] = useState<MonthIndex>(now.getMonth() as MonthIndex);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [metaMap, setMetaMap] = useState<MetaMap>({} as MetaMap);
  const [chartBrokerId, setChartBrokerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const didConfetti = useRef(new Set<string>());

  // Load brokers
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await safeSelect("corretores", { select: "id, nome", order: "nome" });
        if (!active) return;
        setBrokers(data as Broker[]);
        setChartBrokerId((prev) => prev ?? (data?.[0]?.id ?? null));
      } catch (e) {
        console.warn("[MetasCorretor] Falha ao carregar corretores, usando lista vazia.", e);
        setBrokers([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Load metas and vendas for the year -> build metaMap
  useEffect(() => {
    let active = true;
    (async () => {
      if (!brokers.length) return;
      setLoading(true);
      try {
        // 1) metas_corretor: meta_piso & observacoes por corretor/mes/ano
        const metas = await safeSelect("metas_corretor", { select: "corretor_id, mes, ano, meta_piso, observacoes" });

        // 2) vendas do ano: somar vgv por vendedor & mes
        const start = new Date(year, 0, 1).toISOString();
        const end = new Date(year + 1, 0, 1).toISOString();
        const vendas = await safeSelect("vendas", { select: "vendedor, vgv, dataCompetencia" });

        const nameById = new Map(brokers.map((b) => [b.id, b.nome] as const));
        const idByName = new Map(brokers.map((b) => [b.nome, b.id] as const));

        // Aggregate realizado by corretorId + mes
        const realizadoMap = new Map<string /*corretorId-mes*/, number>();
        type VendaRow = { vendedor: string | null; vgv: number; dataCompetencia: string };
        for (const v of (vendas as unknown as VendaRow[]) ?? []) {
          const vendedor = v.vendedor;
          const id = vendedor ? idByName.get(vendedor) : undefined;
          if (!id) continue;
          const d = new Date(v.dataCompetencia);
          const m = d.getMonth() as MonthIndex;
          const key = `${id}-${m}`;
          realizadoMap.set(key, (realizadoMap.get(key) || 0) + (Number(v.vgv) || 0));
        }

        // Build MetaMap
        const map: MetaMap = {} as MetaMap;
        for (const m of MONTHS) map[m.key] = {} as Record<string, BrokerMonthMeta>;

        // Initialize with zeros
        for (const b of brokers) {
          for (const m of MONTHS) {
            map[m.key][b.id] = {
              corretorId: b.id,
              nome: nameById.get(b.id) || b.id,
              ano: year,
              mes: m.key,
              metaPiso: 0,
              realizado: realizadoMap.get(`${b.id}-${m.key}`) || 0,
              observacoes: undefined,
            };
          }
        }

        // Apply metas from DB
        type MetaRow = { corretor_id: string; mes: number; ano: number; meta_piso: number | null; observacoes?: string | null };
        for (const r of (metas as unknown as MetaRow[]) ?? []) {
          const cid = r.corretor_id;
          const mes0 = (Number(r.mes) - 1) as MonthIndex; // DB mes 1-12 -> 0-11
          if (!map[mes0] || !map[mes0][cid]) continue;
          map[mes0][cid].metaPiso = Number(r.meta_piso) || 0;
          map[mes0][cid].observacoes = r.observacoes || undefined;
        }

        if (!active) return;
        setMetaMap(map);
      } catch (e) {
        console.warn("[MetasCorretor] Falha ao carregar metas/vendas, usando dados vazios.", e);
        // fallback: empty metaMap
        const map: MetaMap = {} as MetaMap;
        for (const m of MONTHS) map[m.key] = {} as Record<string, BrokerMonthMeta>;
        setMetaMap(map);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [year, brokers]);

  const currentRows: BrokerMonthMeta[] = useMemo(() => {
    const rows = Object.values(metaMap[month] || {});
    // no ranking required
    return rows;
  }, [metaMap, month]);

  // Chart data for selected broker across months
  const chartData = useMemo(() => {
    if (!chartBrokerId) return [] as { mes: string; metaPiso: number; realizado: number }[];
    return MONTHS.map(({ key, label }) => {
      const row = metaMap[key]?.[chartBrokerId];
      return {
        mes: label,
        metaPiso: row?.metaPiso || 0,
        realizado: row?.realizado || 0,
      };
    });
  }, [chartBrokerId, metaMap]);

  // Update single field (metaPiso or observacoes) and persist
  async function saveMetaPiso(corretorId: string, mes: MonthIndex, value: number) {
    const payload = { corretor_id: corretorId, ano: year, mes: mes + 1, meta_piso: value };
    try {
      await safeInsert("metas_corretor", payload);
    } catch (e) {
      console.warn("[MetasCorretor] Falha ao salvar meta_piso.", e);
    }
  }

  async function saveObservacoes(corretorId: string, mes: MonthIndex, value: string) {
    const payload = { corretor_id: corretorId, ano: year, mes: mes + 1, observacoes: value };
    try {
      await safeInsert("metas_corretor", payload);
    } catch (e) {
      console.warn("[MetasCorretor] Falha ao salvar observações.", e);
    }
  }

  const setLocalMetaPiso = (corretorId: string, mes: MonthIndex, value: number) => {
    setMetaMap((prev) => ({
      ...prev,
      [mes]: {
        ...prev[mes],
        [corretorId]: {
          ...(prev[mes]?.[corretorId] || { corretorId, nome: brokers.find(b=>b.id===corretorId)?.nome || corretorId, ano: year, mes, realizado: 0 }),
          metaPiso: value,
        },
      },
    }));
  };

  const setLocalObservacoes = (corretorId: string, mes: MonthIndex, value: string) => {
    setMetaMap((prev) => ({
      ...prev,
      [mes]: {
        ...prev[mes],
        [corretorId]: {
          ...(prev[mes]?.[corretorId] || { corretorId, nome: brokers.find(b=>b.id===corretorId)?.nome || corretorId, ano: year, mes, realizado: 0 }),
          observacoes: value,
        },
      },
    }));
  };

  // Confetti when broker hits or passes meta
  useEffect(() => {
    const rows = Object.values(metaMap[month] || {});
    for (const r of rows) {
      const progressVal = pct(r.realizado, r.metaPiso);
      const key = `${year}-${month}-${r.corretorId}`;
      if (progressVal >= 100 && !didConfetti.current.has(key)) {
        didConfetti.current.add(key);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.65 } });
      }
    }
  }, [metaMap, month, year]);

  const exportMonth = () => {
    const rows = currentRows.map((r) => ({
      Corretor: r.nome,
      "Meta Piso": r.metaPiso,
      Realizado: r.realizado,
      Progresso: Math.round(pct(r.realizado, r.metaPiso)),
      Observacoes: r.observacoes || "",
      Mes: MONTHS.find((m) => m.key === r.mes)?.label,
      Ano: r.ano,
    }));
    exportXLSX(`metas_${year}_${month + 1}.xlsx`, rows);
  };

  const exportMonthPDF = () => {
    const rows = currentRows.map((r) => ({
      corretor: r.nome,
      metaPiso: currency(r.metaPiso),
      realizado: currency(r.realizado),
      progresso: `${Math.round(pct(r.realizado, r.metaPiso))}%`,
      obs: r.observacoes || "",
    }));
    exportPDF(`metas_${year}_${month + 1}.pdf`, rows, [
      { header: "Corretor", key: "corretor" },
      { header: "Meta Piso", key: "metaPiso" },
      { header: "Realizado", key: "realizado" },
      { header: "Progresso", key: "progresso" },
      { header: "Observações", key: "obs" },
    ]);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Metas Individuais dos Corretores</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={exportMonth}>Exportar Excel</Button>
          <Button variant="secondary" onClick={exportMonthPDF}>Exportar PDF</Button>
        </div>
      </div>

      {/* Filtros: Mês + busca */}
      <Card className="p-3 md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Tabs (desktop) */}
          <div className="hidden md:block">
            <Tabs value={String(month)} onValueChange={(v) => setMonth(Number(v) as MonthIndex)}>
              <TabsList className="grid grid-cols-6 lg:grid-cols-12">
                {MONTHS.map((m) => (
                  <TabsTrigger key={m.key} value={String(m.key)}>{m.label}</TabsTrigger>
                ))}
              </TabsList>
              {/* Keep a content to satisfy types; not rendering specific per tab here */}
              <TabsContent value={String(month)} />
            </Tabs>
          </div>
          {/* Dropdown (mobile) */}
          <div className="md:hidden w-full max-w-xs">
            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v) as MonthIndex)}>
              <SelectTrigger>
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.key} value={String(m.key)}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ano */}
          <div className="w-full md:w-auto max-w-[140px]">
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {[year - 1, year, year + 1].map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Gráfico comparativo mensal (Meta Piso azul, Realizado verde) para o corretor selecionado */}
      <Card className="p-3 md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-2">
          <div className="font-medium">Comparativo Mensal</div>
          <div className="w-full md:w-64">
            <Select value={chartBrokerId ?? ""} onValueChange={(v) => setChartBrokerId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o corretor" />
              </SelectTrigger>
              <SelectContent>
                {brokers.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <ReBarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <XAxis dataKey="mes" />
              <YAxis tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => currency(Number(v))} />
              <Legend />
              <Bar dataKey="metaPiso" fill="#3b82f6" name="Meta Piso" />
              <Bar dataKey="realizado" fill="#22c55e" name="Realizado" />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Corretor</TableHead>
              <TableHead>Meta Piso</TableHead>
              <TableHead>Realizado</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className="min-w-[260px]">Progresso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((r) => {
              const progressVal = pct(r.realizado, r.metaPiso);
              const color = classByProgress(progressVal);
              const falta = Math.max(0, r.metaPiso - r.realizado);
              const hit = progressVal >= 100;
              return (
                <TableRow key={`${r.corretorId}-${month}`} className="align-middle">
                  <TableCell className="font-medium whitespace-nowrap">
                    {hit ? <span className="mr-1">🔥</span> : null}
                    {r.nome}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <InlineNumber
                      value={r.metaPiso}
                      display={currency(r.metaPiso)}
                      onChange={async (val) => {
                        setLocalMetaPiso(r.corretorId, month, val);
                        await saveMetaPiso(r.corretorId, month, val);
                      }}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{currency(r.realizado)}</TableCell>
                  <TableCell className="whitespace-nowrap max-w-[260px]">
                    <InlineText
                      value={r.observacoes || ""}
                      placeholder="Adicionar observações..."
                      onChange={async (val) => {
                        setLocalObservacoes(r.corretorId, month, val);
                        await saveObservacoes(r.corretorId, month, val);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-48">
                        <ColoredProgress value={progressVal} colorClass={color} />
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {Math.round(progressVal)}% {falta > 0 ? `• falta ${currency(falta)}` : "• meta batida"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Inline editable number input (click to edit)
function InlineNumber({ value, display, onChange }: { value: number; display: string; onChange: (v: number) => void | Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState<number>(value || 0);
  useEffect(() => setLocal(value || 0), [value]);
  return editing ? (
    <Input
      autoFocus
      type="number"
      className="h-8 w-32"
      value={local}
      onChange={(e) => setLocal(Number(e.target.value))}
      onBlur={async () => {
        setEditing(false);
        await onChange(local || 0);
      }}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  ) : (
    <button className="hover:underline" onClick={() => setEditing(true)}>
      {display}
    </button>
  );
}

function InlineText({ value, placeholder, onChange }: { value: string; placeholder?: string; onChange: (v: string) => void | Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState<string>(value || "");
  useEffect(() => setLocal(value || ""), [value]);
  return editing ? (
    <Input
      autoFocus
      type="text"
      className="h-8 w-64"
      value={local}
      placeholder={placeholder}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={async () => {
        setEditing(false);
        await onChange(local || "");
      }}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  ) : (
    <button className="hover:underline text-left break-words max-w-[240px]" onClick={() => setEditing(true)}>
      {value ? value : <span className="text-muted-foreground">{placeholder || "Adicionar"}</span>}
    </button>
  );
}
