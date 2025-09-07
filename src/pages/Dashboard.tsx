import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Sun, Moon, CalendarDays, User } from "lucide-react";
import { useData } from "@/context/data-core";
import { useSettings } from "@/context/SettingsContext";
import { Helmet } from "react-helmet-async";

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
import BackButton from "@/components/BackButton";

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
  // ...existing code...
  // Removed theme-related code as ThemeContext was deleted
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
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => ({ mes: k, VGV: Number(v.vgv.toFixed(2)), VGC: Number(v.vgc.toFixed(2)) }));
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
    <div className="space-y-6 relative">
      <BackButton />
      <Helmet>
        <title>{settings.title} — Dashboard</title>
        <meta name="description" content="Gráficos (VGV, VGC, Ranking, Tipos, Origem) com filtros por período e corretor." />
      </Helmet>


      {/* Barra de filtros com ícones */}
  <motion.div layout className="flex flex-wrap items-center gap-4 mb-6 px-3 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur border border-white/10 shadow max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-primary" />
          <Label className="mr-1">Período</Label>
          <Select value={mode} onValueChange={(v: "mensal" | "anual" | "custom") => setMode(v)}>
            <SelectTrigger className="w-32 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <User size={18} className="text-primary" />
          <Label className="mr-1">Corretor</Label>
          <Select value={seller} onValueChange={(v: string) => setSeller(v)}>
            <SelectTrigger className="w-36 rounded-full"><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {vendedores.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        {mode === "custom" && (
          <>
            <div className="flex items-center gap-2">
              <Label>Início</Label>
              <Input className="rounded-full" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Label>Fim</Label>
              <Input className="rounded-full" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </>
        )}
      </motion.div>

      {/* Cards de KPI redesenhados */}
      <AnimatePresence>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : activeSales.length === 0 ? (
          <EmptyState 
            icon={BarChart3}
            title="Nenhum dado encontrado"
            description="Adicione vendas para ver os gráficos e estatísticas no dashboard."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{
              title: "VGV Total",
              value: formatCurrency(kpis.totalVgv),
              subtitle: "Volume Geral de Vendas",
              icon: DollarSign,
              trend: { value: pct(kpis.totalVgv, prevKpis.totalVgv), label: "vs período anterior" },
              color: kpis.totalVgv >= prevKpis.totalVgv ? "from-blue-700 to-purple-600" : "from-blue-600 to-purple-500"
            }, {
              title: "VGC Total",
              value: formatCurrency(kpis.totalVgc),
              subtitle: "Volume Geral de Comissão",
              icon: TrendingUp,
              trend: { value: pct(kpis.totalVgc, prevKpis.totalVgc), label: "vs período anterior" },
              color: kpis.totalVgc >= prevKpis.totalVgc ? "from-emerald-500 to-cyan-500" : "from-emerald-400 to-cyan-400"
            }, {
              title: "Vendas",
              value: kpis.totalSales,
              subtitle: "Total de transações",
              icon: BarChart3,
              trend: { value: pct(kpis.totalSales, prevKpis.totalSales), label: "vs período anterior" },
              color: kpis.totalSales >= prevKpis.totalSales ? "from-orange-500 to-pink-500" : "from-orange-400 to-pink-400"
            }, {
              title: "Taxa de Conversão",
              value: `${kpis.conversionRate.toFixed(1)}%`,
              subtitle: "Aprovadas vs Total",
              icon: Target,
              trend: { value: pct(kpis.conversionRate, prevKpis.conversionRate), label: "vs período anterior" },
              color: kpis.conversionRate >= prevKpis.conversionRate ? "from-purple-600 to-violet-600" : "from-purple-500 to-violet-500"
            }].map((props, idx) => (
              <motion.div
                key={props.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.7, delay: 0.2 + idx * 0.15 }}
                whileHover={{ scale: 1.05 }}
                className={`rounded-2xl p-6 shadow-xl bg-gradient-to-br ${props.color} text-white flex flex-col items-center justify-center gap-3 relative`}
              >
                <div className="absolute top-3 right-3 text-xs opacity-80 font-semibold">
                  {props.trend.value >= 0 ? <span className="text-emerald-200">▲</span> : <span className="text-red-200">▼</span>} {props.trend.value}%
                </div>
                <props.icon size={40} className="mb-1 opacity-90" />
                <div className="font-bold text-lg">{props.title}</div>
                <div className="text-4xl font-extrabold transition-all duration-500 drop-shadow-sm">{props.value}</div>
                <div className="text-xs/5 opacity-90">{props.subtitle}</div>
                {/* Mini indicador de progresso */}
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                  <motion.div className="h-2 rounded-full bg-white/80" style={{ width: `${Math.min(100, Math.abs(props.trend.value))}%` }} layout transition={{ duration: 0.5 }} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Badge de demonstração discreto */}
      {sales.length === 0 && (
        <div className="absolute top-4 right-4 z-50">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold shadow">DEMO <Users size={14}/> Dados fictícios</span>
        </div>
      )}

  <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
  <div className="rounded-2xl border border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4 shadow">
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
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
  <div className="rounded-2xl border border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4 shadow">
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
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
  <div className="rounded-2xl border border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4 shadow">
          <h2 className="font-semibold mb-2">Ranking de Corretores</h2>
          <div className="h-72 overflow-auto">
            <ul className="space-y-2">
              {ranking.map((r, idx) => {
                let medalColor = '';
                if (idx === 0) medalColor = 'bg-yellow-400';
                if (idx === 1) medalColor = 'bg-gray-400';
                if (idx === 2) medalColor = 'bg-orange-400';
                return (
          <li key={r.vendedor} className="flex items-center gap-3 p-2 rounded-xl shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                    <div className="relative">
                      <img src={`https://i.pravatar.cc/40?u=${encodeURIComponent(r.vendedor)}`} alt={r.vendedor} className="h-10 w-10 rounded-full object-cover border-2 border-primary" />
            {idx < 3 && <span className={`absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${medalColor}`}></span>}
                    </div>
                    <span className="font-semibold text-base">{r.vendedor}</span>
                    <span className="ml-auto font-bold text-green-700">{formatCurrency(r.VGV)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
    <div className="rounded-2xl border border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4 grid grid-cols-1 md:grid-cols-2 gap-4 shadow">
          <div>
            <h2 className="font-semibold mb-2">Revenda x Lançamento</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip currency />} />
                  <Pie data={tipoData} dataKey="value" nameKey="name" outerRadius={80} label isAnimationActive={true} animationDuration={1200} cornerRadius={10}>
                    {tipoData.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? "#3b82f6" : "#10b981"} />
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
                      <Cell key={i} fill={i % 2 === 0 ? "#10b981" : "#3b82f6"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
  <div className="rounded-2xl border border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4 shadow">
          <h2 className="font-semibold mb-2">% do VGC com base no VGV</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gaugeData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} isAnimationActive={true} animationDuration={1200} cornerRadius={10}>
                  <Cell fill="#10b981" />
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
