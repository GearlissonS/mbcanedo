import React, { useMemo, useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

// Data types
export type BrokerGoal = {
  id: string;
  nome: string;
  metaPiso: number;
  metaAlvo: number;
  realizado: number;
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

// Mock list of brokers (IDs + names only)
const BROKERS: Array<Pick<BrokerGoal, "id" | "nome">> = [
  { id: "1", nome: "João Silva" },
  { id: "2", nome: "Maria Souza" },
  { id: "3", nome: "Carlos Lima" },
  { id: "4", nome: "Ana Paula" },
  { id: "5", nome: "Bruno Castro" },
  { id: "6", nome: "Fernanda Alves" },
  { id: "7", nome: "Rafael Gomes" },
  { id: "8", nome: "Juliana Rocha" },
];

function currency(v: number) {
  return `R$ ${Math.round(v || 0).toLocaleString("pt-BR")}`;
}

function pct(done: number, target: number) {
  if (!target || target <= 0) return 0;
  return Math.max(0, Math.min(100, (done / target) * 100));
}

function classByStatus(realizado: number, piso: number, alvo: number) {
  if (realizado >= alvo) return "bg-green-500";
  if (realizado >= piso) return "bg-yellow-500";
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

const buildInitialState = (): Record<MonthIndex, BrokerGoal[]> => {
  return MONTHS.reduce((acc, m) => {
    acc[m.key] = BROKERS.map((b, i) => ({
      id: b.id,
      nome: b.nome,
      metaPiso: 200_000 + i * 25_000,
      metaAlvo: 350_000 + i * 30_000,
      realizado: (i % 3 === 0 ? 380_000 : 150_000) + (m.key % 2 === 0 ? i * 8_000 : i * 5_000),
    }));
    return acc;
  }, {} as Record<MonthIndex, BrokerGoal[]>);
};

export default function MetasCorretor() {
  const now = new Date();
  const [month, setMonth] = useState<MonthIndex>(now.getMonth() as MonthIndex);
  const [byMonth, setByMonth] = useState<Record<MonthIndex, BrokerGoal[]>>(buildInitialState());
  const [search, setSearch] = useState("");
  const [rankingMode, setRankingMode] = useState(true);
  const [editing, setEditing] = useState<{ id: string; field: keyof BrokerGoal } | null>(null);

  const current = byMonth[month] || [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = current.filter((b) => (q ? b.nome.toLowerCase().includes(q) : true));
    if (rankingMode) list = [...list].sort((a, b) => b.realizado - a.realizado);
    return list;
  }, [current, search, rankingMode]);

  const teamHitPct = useMemo(() => {
    if (!current.length) return 0;
    const hit = current.filter((b) => b.realizado >= b.metaAlvo).length;
    return Math.round((hit / current.length) * 100);
  }, [current]);

  const setValue = (id: string, field: keyof BrokerGoal, value: number) => {
    setByMonth((prev) => ({
      ...prev,
      [month]: prev[month].map((b) => (b.id === id ? { ...b, [field]: Number.isFinite(value) ? Math.max(0, value) : 0 } : b)),
    }));
  };

  const startEdit = (id: string, field: keyof BrokerGoal) => setEditing({ id, field });
  const stopEdit = () => setEditing(null);

  const EditableCell: React.FC<{
    broker: BrokerGoal;
    field: keyof BrokerGoal;
    format?: (n: number) => string;
    className?: string;
  }> = ({ broker, field, format, className }) => {
    const isEditing = editing && editing.id === broker.id && editing.field === field;
    const raw = broker[field] as number | string;
    const display = typeof raw === "number" && format ? format(raw) : String(raw);
    if (field === "nome") return <span className={className}>{String(raw)}</span>;
    const numberValue = typeof raw === "number" ? raw : Number(raw) || 0;
    return (
      <div className={className}>
        {isEditing ? (
          <Input
            autoFocus
            type="number"
            value={numberValue}
            onChange={(e) => setValue(broker.id, field, Number(e.target.value))}
            onBlur={stopEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") stopEdit();
            }}
            className="h-8 w-28"
          />
        ) : (
          <button onClick={() => startEdit(broker.id, field)} className="hover:underline focus:underline">
            {display}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Metas por Corretor</h1>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-600 text-white">% equipe bateu meta: {teamHitPct}%</Badge>
          <Button variant={rankingMode ? "default" : "secondary"} onClick={() => setRankingMode((v) => !v)}>
            {rankingMode ? "Ranking ativo" : "Ranking inativo"}
          </Button>
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

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar corretor..."
              className="max-w-xs"
            />
          </div>
        </div>
      </Card>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Corretor</TableHead>
              <TableHead>Meta Piso</TableHead>
              <TableHead>Meta Alvo</TableHead>
              <TableHead>Realizado</TableHead>
              <TableHead className="min-w-[280px]">Progresso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => {
              const p = pct(b.realizado, b.metaAlvo);
              const color = classByStatus(b.realizado, b.metaPiso, b.metaAlvo);
              const falta = Math.max(0, b.metaAlvo - b.realizado);
              const passed = b.realizado > b.metaAlvo;
              return (
                <TableRow key={`${b.id}-${month}`} className="align-middle">
                  <TableCell className="font-medium whitespace-nowrap">
                    {passed ? <span className="mr-1">🔥</span> : null}
                    <EditableCell broker={b} field="nome" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <EditableCell broker={b} field="metaPiso" format={currency} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <EditableCell broker={b} field="metaAlvo" format={currency} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <EditableCell broker={b} field="realizado" format={currency} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-56">
                        <ColoredProgress value={p} colorClass={color} />
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {p.toFixed(0)}% {falta > 0 ? `• falta ${currency(falta)}` : "• meta batida"}
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
