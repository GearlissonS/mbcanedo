import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useData } from "@/context/data-core";
import { useSettings } from "@/context/SettingsContext";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@/context/ThemeContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPICard } from "@/components/KPICard";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TrendingUp, DollarSign, Users, Target, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";
import { CustomTooltip } from "@/components/charts/CustomTooltip";
import { formatCurrencyBR } from "@/lib/utils";

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}`;
}

type SaleItem = {
  id: string;
  dataCompetencia: string;
  dataVencimento?: string;
  cliente?: string;
  origem?: string;
  estilo?: string;
  produto?: string;
  vgv: number;
  vgc: number;
  tipo?: string;
  vendedor?: string;
  captador?: string;
  gerente?: string;
  status?: string;
  pago?: boolean;
  createdAt?: string;
}

// Dados fictícios para demonstração - REMOVER EM PRODUÇÃO
const mockSales = [
  { id: "1", dataCompetencia: "2024-12-01", dataVencimento: "2024-12-15", cliente: "João Silva", origem: "Indicação", estilo: "Clássico", produto: "Apartamento 2Q", vgv: 450000, vgc: 22500, tipo: "Revenda", vendedor: "Ana Souza", captador: "Bruno Lima", gerente: "Carla Mendes", status: "Aprovada", pago: true, createdAt: "2024-12-01T08:00:00Z" },
  { id: "2", dataCompetencia: "2024-12-03", dataVencimento: "2024-12-18", cliente: "Maria Santos", origem: "Digital", estilo: "Moderno", produto: "Casa 3Q", vgv: 680000, vgc: 34000, tipo: "Lançamento", vendedor: "Bruno Lima", captador: "Ana Souza", gerente: "Diego Rocha", status: "Em análise", pago: false, createdAt: "2024-12-03T10:30:00Z" },
  { id: "3", dataCompetencia: "2024-12-05", dataVencimento: "2024-12-20", cliente: "Pedro Costa", origem: "Portaria", estilo: "Luxo", produto: "Cobertura", vgv: 1200000, vgc: 60000, tipo: "Lançamento", vendedor: "Carla Mendes", captador: "Felipe Nunes", gerente: "Eduarda Pires", status: "Aprovada", pago: true, createdAt: "2024-12-05T14:15:00Z" },
  { id: "4", dataCompetencia: "2024-11-28", dataVencimento: "2024-12-12", cliente: "Ana Oliveira", origem: "Indicação", estilo: "Clássico", produto: "Apartamento 1Q", vgv: 320000, vgc: 16000, tipo: "Revenda", vendedor: "Diego Rocha", captador: "Carla Mendes", gerente: "Ana Souza", status: "Aprovada", pago: true, createdAt: "2024-11-28T16:45:00Z" },
  { id: "5", dataCompetencia: "2024-11-25", dataVencimento: "2024-12-10", cliente: "Carlos Ferreira", origem: "Digital", estilo: "Moderno", produto: "Casa 4Q", vgv: 850000, vgc: 42500, tipo: "Lançamento", vendedor: "Eduarda Pires", captador: "Diego Rocha", gerente: "Bruno Lima", status: "Cancelada", pago: false, createdAt: "2024-11-25T09:20:00Z" },
];

const formatCurrency = (value: number) => {
  return formatCurrencyBR(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatTooltip = (value: unknown, name: string) => {
  if (name === 'VGV' || name === 'VGC') {
    return [formatCurrency(Number(value as number)), name];
  }
  return [String(value ?? ''), name];
};

export default function Dashboard() {
  // Theme/paleta
  const { theme, palette, setTheme, setPalette, savePreferences } = useTheme();
  const [primary, setPrimary] = useState(palette.primary);
  const [secondary, setSecondary] = useState(palette.secondary);
  const handleSave = async () => {
    setPalette({ primary, secondary });
    await savePreferences();
  };
  const { sales } = useData();
  const { settings } = useSettings();
  const [mode, setMode] = useState<"mensal" | "anual" | "custom">("mensal");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [seller, setSeller] = useState<string>("all");
  // Usar dados fictícios se não houver vendas
  const activeSales = sales && sales.length > 0 ? sales : mockSales;

  const vendedores = useMemo(() => {
    return Array.from(new Set(activeSales.map((s: SaleItem) => s.vendedor).filter(Boolean)));
  }, [activeSales]);

  const filtered = useMemo(() => {
    const now = new Date();
    let s: Date | null = null, e: Date | null = null;
    if (mode === "mensal") { s = new Date(now.getFullYear(), now.getMonth(), 1); e = new Date(now.getFullYear(), now.getMonth()+1, 0); }
    if (mode === "anual") { s = new Date(now.getFullYear(), 0, 1); e = new Date(now.getFullYear(), 11, 31); }
    if (mode === "custom" && start && end) { s = new Date(start); e = new Date(end); }
    return activeSales.filter((x: SaleItem) => {
      const d = new Date(x.dataCompetencia);
      const inRange = s && e ? d >= s && d <= e : true;
      const vendedorOk = seller === "all" ? true : x.vendedor === seller;
      return inRange && vendedorOk;
    });
  }, [activeSales, mode, start, end, seller]);

  const prevFiltered = useMemo(() => {
    const now = new Date();
    let s: Date | null = null, e: Date | null = null;
    if (mode === "mensal") { const m = new Date(now.getFullYear(), now.getMonth()-1, 1); s = new Date(m.getFullYear(), m.getMonth(), 1); e = new Date(m.getFullYear(), m.getMonth()+1, 0); }
    if (mode === "anual") { const y = now.getFullYear()-1; s = new Date(y, 0, 1); e = new Date(y, 11, 31); }
    if (mode === "custom") { return []; }
    return activeSales.filter((x: SaleItem) => {
      const d = new Date(x.dataCompetencia);
      return s && e ? d >= s && d <= e : false;
    });
  }, [activeSales, mode]);

// KPIs calculados
const kpis = useMemo(() => {
  const totalVgv = filtered.reduce((acc, s) => acc + s.vgv, 0);
  const totalVgc = filtered.reduce((acc, s) => acc + s.vgc, 0);
  const totalSales = filtered.length;
  const approvedSales = filtered.filter(s => s.status === "Aprovada").length;
  const conversionRate = totalSales > 0 ? (approvedSales / totalSales) * 100 : 0;
  return { totalVgv, totalVgc, totalSales, conversionRate };
}, [filtered]);

const prevKpis = useMemo(() => {
  const totalVgv = prevFiltered.reduce((acc: number, s: SaleItem) => acc + s.vgv, 0);
  const totalVgc = prevFiltered.reduce((acc: number, s: SaleItem) => acc + s.vgc, 0);
  const totalSales = prevFiltered.length;
  const approvedSales = prevFiltered.filter((s: SaleItem) => s.status === "Aprovada").length;
  const conversionRate = totalSales > 0 ? (approvedSales / totalSales) * 100 : 0;
  return { totalVgv, totalVgc, totalSales, conversionRate };
}, [prevFiltered]);

const pct = (curr: number, prev: number) => (prev > 0 ? Number((((curr - prev) / prev) * 100).toFixed(1)) : 0);

  const monthly = useMemo(() => {
    const map: Record<string, { vgv: number; vgc: number }> = {};
    filtered.forEach((s) => {
      const k = monthKey(s.dataCompetencia);
      map[k] = map[k] || { vgv: 0, vgc: 0 };
      map[k].vgv += s.vgv;
      map[k].vgc += s.vgc;
    });
            return Object.entries(map).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => ({ mes: k, VGV: Number(v.vgv.toFixed(2)), VGC: Number(v.vgc.toFixed(2)) }));
  }, [filtered]);

  const ranking = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((s) => map.set(s.vendedor, (map.get(s.vendedor) || 0) + s.vgv));
    return Array.from(map.entries()).map(([vendedor, VGV]) => ({ vendedor, VGV })).sort((a,b)=>b.VGV-a.VGV).slice(0,10);
  }, [filtered]);

  const tipoData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((s) => map.set(s.tipo, (map.get(s.tipo) || 0) + s.vgv));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const origemData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((s) => map.set(s.origem, (map.get(s.origem) || 0) + s.vgv));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const totalVgv = filtered.reduce((acc, s) => acc + s.vgv, 0);
  const totalVgc = filtered.reduce((acc, s) => acc + s.vgc, 0);
  const gaugeData = [
    { name: "VGC", value: totalVgc },
    { name: "Restante", value: Math.max(0, totalVgv - totalVgc) },
  ];

  const colors = settings.chartColors;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{settings.title} — Dashboard</title>
        <meta name="description" content="Gráficos (VGV, VGC, Ranking, Tipos, Origem) com filtros por período e corretor." />
      </Helmet>

      {/* Painel de configurações visual */}
      <div className="mb-6 p-4 rounded-xl shadow bg-white dark:bg-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <button
            className={`px-4 py-2 rounded font-semibold transition ${theme === 'light' ? 'bg-primary text-white' : 'bg-slate-700 text-white'}`}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? '🌞 Modo Claro' : '🌙 Modo Escuro'}
          </button>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Cor Primária</label>
            <input type="color" value={primary} onChange={e => setPrimary(e.target.value)} className="w-10 h-10 rounded border" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Cor Secundária</label>
            <input type="color" value={secondary} onChange={e => setSecondary(e.target.value)} className="w-10 h-10 rounded border" />
          </div>
          <button
            className="px-4 py-2 rounded bg-green-600 text-white font-semibold"
            onClick={handleSave}
          >Salvar Preferências</button>
        </div>
        <span className="text-xs text-muted-foreground">Personalize seu dashboard: cores e modo</span>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label>Período</Label>
          <Select value={mode} onValueChange={(v: "mensal" | "anual" | "custom") => setMode(v)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Corretor</Label>
          <Select value={seller} onValueChange={(v) => setSeller(v)}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {vendedores.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        {mode === "custom" && (
          <>
            <div>
              <Label>Início</Label>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <Label>Fim</Label>
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </>
        )}
      </div>

      {/* Cards de KPI */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : activeSales.length === 0 ? (
        <EmptyState 
          icon={BarChart3}
          title="Nenhum dado encontrado"
          description="Adicione vendas para ver os gráficos e estatísticas no dashboard."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{
            title: "VGV Total",
            value: formatCurrency(kpis.totalVgv),
            subtitle: "Volume Geral de Vendas",
            icon: DollarSign,
            trend: { value: pct(kpis.totalVgv, prevKpis.totalVgv), label: "vs período anterior" }
          }, {
            title: "VGC Total",
            value: formatCurrency(kpis.totalVgc),
            subtitle: "Volume Geral de Comissão",
            icon: TrendingUp,
            trend: { value: pct(kpis.totalVgc, prevKpis.totalVgc), label: "vs período anterior" }
          }, {
            title: "Vendas",
            value: kpis.totalSales,
            subtitle: "Total de transações",
            icon: BarChart3,
            trend: { value: pct(kpis.totalSales, prevKpis.totalSales), label: "vs período anterior" }
          }, {
            title: "Taxa de Conversão",
            value: `${kpis.conversionRate.toFixed(1)}%`,
            subtitle: "Aprovadas vs Total",
            icon: Target,
            trend: { value: pct(kpis.conversionRate, prevKpis.conversionRate), label: "vs período anterior" }
          }].map((props, idx) => (
            <motion.div
              key={props.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + idx * 0.15 }}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #0A1B4D55" }}
            >
              <KPICard {...props} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Aviso sobre dados fictícios */}
      {sales.length === 0 && (
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Exibindo dados fictícios para demonstração. Adicione vendas reais para ver seus dados.</span>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold mb-2">VGV Mensal</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => formatCurrency(value).replace('R$', 'R$ ')} />
                <Tooltip content={<CustomTooltip currency />} />
                <Legend />
                <Bar dataKey="VGV" fill={`url(#vgvGradient)`} radius={[10,10,0,0]} isAnimationActive={true} animationDuration={1200} />
                <defs>
                  <linearGradient id="vgvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={primary} />
                    <stop offset="100%" stopColor={secondary} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold mb-2">VGC Mensal</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => formatCurrency(value).replace('R$', 'R$ ')} />
                <Tooltip content={<CustomTooltip currency />} />
                <Legend />
                <Bar dataKey="VGC" fill={`url(#vgcGradient)`} radius={[10,10,0,0]} isAnimationActive={true} animationDuration={1200} />
                <defs>
                  <linearGradient id="vgcGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={secondary} />
                    <stop offset="100%" stopColor={primary} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold mb-2">Ranking de Corretores</h2>
          <div className="h-72 overflow-auto">
            <ul className="space-y-2">
              {ranking.map((r, idx) => {
                let medalColor = '';
                if (idx === 0) medalColor = 'bg-yellow-400';
                if (idx === 1) medalColor = 'bg-gray-400';
                if (idx === 2) medalColor = 'bg-orange-400';
                return (
                  <li key={r.vendedor} className="flex items-center gap-3 p-2 rounded-lg shadow-sm bg-white dark:bg-slate-800">
                    <div className="relative">
                      <img src={`https://i.pravatar.cc/40?u=${encodeURIComponent(r.vendedor)}`} alt={r.vendedor} className="h-10 w-10 rounded-full object-cover border-2 border-primary" />
                      {idx < 3 && <span className={`absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${medalColor}`}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>}
                    </div>
                    <span className="font-semibold text-base">{r.vendedor}</span>
                    <span className="ml-auto font-bold text-green-700">{formatCurrency(r.VGV)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold mb-2">Revenda x Lançamento</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip currency />} />
                  <Pie data={tipoData} dataKey="value" nameKey="name" outerRadius={80} label isAnimationActive={true} animationDuration={1200} cornerRadius={10}>
                    {tipoData.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? primary : secondary} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Origem de Vendas</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip currency />} />
                  <Pie data={origemData} dataKey="value" nameKey="name" outerRadius={80} label isAnimationActive={true} animationDuration={1200} cornerRadius={10}>
                    {origemData.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? secondary : primary} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-semibold mb-2">% do VGC com base no VGV</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gaugeData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} isAnimationActive={true} animationDuration={1200} cornerRadius={10}>
                  <Cell fill={secondary} />
                  <Cell fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
