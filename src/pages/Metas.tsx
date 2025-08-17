import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Target, Users } from "lucide-react";

// Types
interface Meta {
  mes: string;
  metaPiso: number;
  metaAlvo: number;
  realizado: number;
}

interface CorretorMeta {
  id?: string | number;
  nome: string;
  avatarUrl?: string;
  meta: number;
  realizado: number;
}

// Helpers
const currency = (v: number) =>
  `R$ ${Math.round(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;

const progressPct = (meta: number, done: number) => {
  if (!meta || meta <= 0) return 0;
  return Math.min(100, (done / meta) * 100);
};

const easeIn = { duration: 0.6, ease: "easeOut" as const };

export default function Metas() {
  // Mock data as requested (kept isolated within this page)
  const [metas, setMetas] = useState<Meta[]>([
    { mes: "Janeiro", metaPiso: 500_000, metaAlvo: 1_000_000, realizado: 500_000 },
    { mes: "Fevereiro", metaPiso: 450_000, metaAlvo: 825_000, realizado: 20_000 },
    { mes: "Março", metaPiso: 1_000_000, metaAlvo: 1_500_000, realizado: 500_000 },
    { mes: "Abril", metaPiso: 100_000, metaAlvo: 750_000, realizado: 20_000 },
    { mes: "Maio", metaPiso: 500_000, metaAlvo: 750_000, realizado: 250_000 },
    { mes: "Junho", metaPiso: 3_000_000, metaAlvo: 3_500_000, realizado: 500_000 },
    { mes: "Julho", metaPiso: 300_000, metaAlvo: 1_500_000, realizado: 1_034_000 },
  ]);

  const [corretores, setCorretores] = useState<CorretorMeta[]>([
    { nome: "João Silva", meta: 500_000, realizado: 520_000, avatarUrl: "/placeholder.svg" },
    { nome: "Maria Souza", meta: 400_000, realizado: 350_000, avatarUrl: "/placeholder.svg" },
    { nome: "Carlos Lima", meta: 300_000, realizado: 310_000, avatarUrl: "/placeholder.svg" },
  ]);

  const totalMeta = useMemo(
    () => metas.reduce((acc, m) => acc + (m.metaAlvo || 0), 0),
    [metas]
  );
  const totalRealizado = useMemo(
    () => metas.reduce((acc, m) => acc + (m.realizado || 0), 0),
    [metas]
  );
  const progresso = useMemo(
    () => (totalMeta ? ((totalRealizado / totalMeta) * 100) : 0),
    [totalMeta, totalRealizado]
  );

  // Confetti control to avoid spamming
  const didConfettiFor = useRef(new Set<string>());
  useEffect(() => {
    corretores.forEach((c) => {
      const key = `${c.nome}-${c.meta}-${c.realizado}`;
      const hit = c.realizado >= c.meta;
      if (hit && !didConfettiFor.current.has(key)) {
        didConfettiFor.current.add(key);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    });
  }, [corretores]);

  // Variants
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Meta da Equipe */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={easeIn}
      >
        <Card className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-2xl rounded-2xl">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center text-2xl gap-2">
              <Target size={28} /> Meta da Equipe
            </CardTitle>
            <span className="text-lg font-semibold">Progresso: {progresso.toFixed(1)}%</span>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center">
              <p className="text-sm">Meta Total</p>
              <motion.h2
                className="text-2xl font-bold"
                initial={{ textShadow: "0px 0px 0px #fff" }}
                animate={{ textShadow: "0px 0px 12px #fff" }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {currency(totalMeta)}
              </motion.h2>
            </div>
            <div className="text-center">
              <p className="text-sm">Realizado</p>
              <h2 className="text-2xl font-bold text-green-300">{currency(totalRealizado)}</h2>
            </div>
          </CardContent>
          <div className="w-full bg-blue-400/40 rounded-b-2xl h-3">
            <motion.div
              className="h-3 bg-green-400 rounded-b-2xl"
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </Card>
      </motion.div>

      {/* Tabela + Gráfico */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Tabela */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={22} /> Metas por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Mês</th>
                    <th className="p-2">Meta Piso</th>
                    <th className="p-2">Meta Alvo</th>
                    <th className="p-2">Realizado</th>
                  </tr>
                </thead>
                <tbody>
                  {metas.map((m) => (
                    <tr key={m.mes} className="border-b hover:bg-blue-50 transition">
                      <td className="p-2 whitespace-nowrap">{m.mes}</td>
                      <td className="p-2 whitespace-nowrap">{currency(m.metaPiso)}</td>
                      <td className="p-2 whitespace-nowrap">{currency(m.metaAlvo)}</td>
                      <td className="p-2 whitespace-nowrap text-green-700 font-semibold">
                        {currency(m.realizado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Comparativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={metas}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => currency(v)} />
                  <Legend />
                  <Bar dataKey="metaPiso" fill="#3b82f6" name="Meta Piso" />
                  <Bar dataKey="realizado" fill="#22c55e" name="Realizado" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metas por corretor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {corretores.map((c, idx) => {
          const pct = progressPct(c.meta, c.realizado);
          const hit = c.realizado >= c.meta;
          return (
            <motion.div
              key={`${c.nome}-${idx}`}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: idx * 0.12, duration: 0.5 }}
            >
              <Card className={`rounded-2xl shadow-lg transition ${hit ? "border-2 border-green-500" : ""}`}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      {c.nome?.[0] || "?"}
                    </span>
                    <span>{c.nome}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Meta: {currency(c.meta)}</p>
                  <p className="text-sm">
                    Realizado:{" "}
                    <span className={hit ? "font-semibold text-green-600" : "font-semibold text-blue-600"}>
                      {currency(c.realizado)}
                    </span>
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={hit ? "h-3 bg-green-500" : "h-3 bg-blue-500"}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  {hit && (
                    <motion.div
                      className="mt-2 text-green-600 font-bold"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      🎉 Meta Batida!
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
