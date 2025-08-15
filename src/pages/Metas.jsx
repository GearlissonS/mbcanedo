


import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function Metas() {
  const [corretores, setCorretores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metaEquipe, setMetaEquipe] = useState(100000);
  const [realizadoEquipe, setRealizadoEquipe] = useState(0);

  useEffect(() => {
    buscarCorretores();
  }, []);

  async function buscarCorretores() {
    setLoading(true);
    const { data, error } = await supabase.from("agents").select("*");
    if (!error) {
      const lista = data.map(c => ({
        ...c,
        meta: c.meta || 0,
        realizado: c.realizado || 0
      }));
      setCorretores(lista);
      // Soma dos realizados para meta da equipe
      setRealizadoEquipe(lista.reduce((acc, cur) => acc + (cur.realizado || 0), 0));
    }
    setLoading(false);
  }

  function atualizarMetaCorretor(id, valor) {
    setCorretores(prev =>
      prev.map(c =>
        c.id === id ? { ...c, meta: parseFloat(valor) || 0 } : c
      )
    );
  }

  function atualizarMetaEquipe(valor) {
    setMetaEquipe(parseFloat(valor) || 0);
  }

  async function salvarMetas() {
    setLoading(true);
    const updates = corretores.map(c =>
      supabase.from("agents").update({ meta: c.meta }).eq("id", c.id)
    );
    await Promise.all(updates);
    // Aqui você pode salvar metaEquipe em outra tabela se desejar
    setLoading(false);
    alert("Metas salvas com sucesso!");
  }

  function getBarColor(percent) {
    if (percent < 50) return "bg-gradient-to-r from-red-400 to-red-600";
    if (percent < 80) return "bg-gradient-to-r from-yellow-300 to-yellow-500";
    return "bg-gradient-to-r from-green-400 to-green-600";
  }

  function percent(meta, realizado) {
    if (!meta || meta === 0) return 0;
    return Math.min(100, (realizado / meta) * 100);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">Metas da Equipe e Corretores</h1>

      {/* Card da Equipe */}
      <Card className="mb-8 shadow-lg bg-gradient-to-br from-blue-800 to-blue-900 text-white">
        <CardHeader className="flex flex-row items-center gap-4">
          <Users size={40} className="text-blue-300" />
          <CardTitle className="text-2xl font-bold">Meta da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">Meta:</span>
              <input
                type="number"
                value={metaEquipe}
                onChange={e => atualizarMetaEquipe(e.target.value)}
                className="border rounded px-2 py-1 w-40 text-black font-bold"
                min={0}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">Alcançado:</span>
              <span className="text-2xl font-bold text-green-300">R$ {realizadoEquipe.toLocaleString("pt-BR")}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">Progresso:</span>
              <span className="text-2xl font-bold">{percent(metaEquipe, realizadoEquipe).toFixed(1)}%</span>
            </div>
          </div>
          <div className="w-full h-6 rounded bg-gray-700">
            <div
              className={`h-6 rounded transition-all duration-500 ${getBarColor(percent(metaEquipe, realizadoEquipe))}`}
              style={{ width: `${percent(metaEquipe, realizadoEquipe)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards dos Corretores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {corretores.map((c) => {
          const progresso = percent(c.meta, c.realizado);
          return (
            <Card key={c.id} className="shadow-md bg-gradient-to-br from-slate-100 to-blue-100">
              <CardHeader className="flex flex-row items-center gap-3">
                <UserCheck size={28} className="text-blue-500" />
                <CardTitle className="text-lg font-bold text-blue-900">{c.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold">Meta:</span>
                    <input
                      type="number"
                      value={c.meta}
                      onChange={e => atualizarMetaCorretor(c.id, e.target.value)}
                      className="border rounded px-2 py-1 w-24 text-black font-bold"
                      min={0}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold">Alcançado:</span>
                    <span className="font-bold text-green-700">R$ {c.realizado.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold">Progresso:</span>
                    <span className="font-bold text-blue-700">{progresso.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-full h-4 rounded bg-gray-300">
                  <div
                    className={`h-4 rounded transition-all duration-500 ${getBarColor(progresso)}`}
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end mt-8">
        <Button onClick={salvarMetas} disabled={loading} className="px-8 py-3 text-lg bg-blue-700 hover:bg-blue-800">
          {loading ? "Salvando..." : "Salvar Metas"}
        </Button>
      </div>
    </div>
  );
}
