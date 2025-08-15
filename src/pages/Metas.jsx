

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function Metas() {
  const [corretores, setCorretores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    buscarCorretores();
  }, []);

  async function buscarCorretores() {
    setLoading(true);
    const { data, error } = await supabase.from("agents").select("*");
    if (!error) {
      // Simulando campo 'meta' e 'realizado' caso não existam
      const lista = data.map(c => ({
        ...c,
        meta: c.meta || 0,
        realizado: c.realizado || 0
      }));
      setCorretores(lista);
    }
    setLoading(false);
  }

  function atualizarMeta(id, valor) {
    setCorretores(prev =>
      prev.map(c =>
        c.id === id ? { ...c, meta: parseFloat(valor) || 0 } : c
      )
    );
  }

  async function salvarMetas() {
    setLoading(true);
    const updates = corretores.map(c =>
      supabase.from("agents").update({ meta: c.meta }).eq("id", c.id)
    );
    await Promise.all(updates);
    setLoading(false);
    alert("Metas salvas com sucesso!");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Metas da Equipe e Corretores</h1>

      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Corretor</th>
                  <th className="p-3">Meta (R$)</th>
                  <th className="p-3">Alcançado (R$)</th>
                  <th className="p-3 w-40">Progresso</th>
                </tr>
              </thead>
              <tbody>
                {corretores.map((c) => {
                  const progresso =
                    c.meta > 0 ? (c.realizado / c.meta) * 100 : 0;

                  return (
                    <tr key={c.id} className="border-b">
                      <td className="p-3">{c.nome}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={c.meta}
                          onChange={(e) => atualizarMeta(c.id, e.target.value)}
                          className="border rounded px-2 py-1 w-28"
                        />
                      </td>
                      <td className="p-3">{c.realizado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                      <td className="p-3">
                        <Progress value={progresso} className="h-2" />
                        <span className="text-xs text-gray-600">{progresso.toFixed(1)}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={salvarMetas} disabled={loading}>
              {loading ? "Salvando..." : "Salvar Metas"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
