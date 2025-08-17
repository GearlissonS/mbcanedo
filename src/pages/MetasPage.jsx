import { useState, useEffect } from "react";
import { supabase } from "../context/supabaseClient";

export default function MetasPage() {
  const [equipes, setEquipes] = useState([]);
  const [corretores, setCorretores] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const { data: eq, error: eqErr } = await supabase.from("equipes").select("*");
      if (eqErr) console.error('[MetasPage] carregarDados equipes failed', eqErr);
      setEquipes(eq || []);
      const { data: cor, error: corErr } = await supabase.from("corretores").select("*");
      if (corErr) console.error('[MetasPage] carregarDados corretores failed', corErr);
      setCorretores(cor || []);
    } catch (err) {
      console.error('[MetasPage] carregarDados threw', err);
    }
  }

  async function atualizarMetaEquipe(id, valor) {
    try {
      const { error } = await supabase.from("equipes").update({ meta_equipe: valor }).eq("id", id);
      if (error) {
        console.error('[MetasPage] atualizarMetaEquipe failed', error);
      }
    } catch (err) {
      console.error('[MetasPage] atualizarMetaEquipe threw', err);
    } finally {
      carregarDados();
    }
  }

  async function atualizarMetaCorretor(id, valor) {
    try {
      const { error } = await supabase.from("corretores").update({ meta_individual: valor }).eq("id", id);
      if (error) {
        console.error('[MetasPage] atualizarMetaCorretor failed', error);
      }
    } catch (err) {
      console.error('[MetasPage] atualizarMetaCorretor threw', err);
    } finally {
      carregarDados();
    }
  }

  function calcularPorcentagem(valor, meta) {
    if (!meta || meta === 0) return 0;
    return Math.min(100, ((valor || 0) / meta) * 100);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Metas</h2>
      {equipes.map((equipe) => {
        const totalRealizado = corretores
          .filter((c) => c.equipe === equipe.nome)
          .reduce((acc, cur) => acc + (cur.realizado || 0), 0);
        const percEquipe = calcularPorcentagem(totalRealizado, equipe.meta_equipe);
        return (
          <div key={equipe.id} style={{ marginBottom: 30 }}>
            <h3>{equipe.nome} - Meta da Equipe</h3>
            <input
              type="number"
              value={equipe.meta_equipe || 0}
              onChange={(e) => atualizarMetaEquipe(equipe.id, Number(e.target.value))}
            />
            <div style={{ background: "#eee", borderRadius: 4, height: 20, marginTop: 5 }}>
              <div
                style={{
                  width: `${percEquipe}%`,
                  background: percEquipe >= 100 ? "green" : "blue",
                  height: "100%",
                  borderRadius: 4,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <p>{percEquipe.toFixed(1)}% ({totalRealizado}/{equipe.meta_equipe})</p>
            <h4>Corretores</h4>
            {corretores.filter((c) => c.equipe === equipe.nome).map((corretor) => {
              const percCorretor = calcularPorcentagem(corretor.realizado, corretor.meta_individual);
              return (
                <div key={corretor.id} style={{ marginBottom: 10 }}>
                  <strong>{corretor.nome}</strong>
                  <input
                    type="number"
                    value={corretor.meta_individual || 0}
                    onChange={(e) => atualizarMetaCorretor(corretor.id, Number(e.target.value))}
                    style={{ marginLeft: 10 }}
                  />
                  <div style={{ background: "#eee", borderRadius: 4, height: 10, marginTop: 5 }}>
                    <div
                      style={{
                        width: `${percCorretor}%`,
                        background: percCorretor >= 100 ? "green" : "orange",
                        height: "100%",
                        borderRadius: 4,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <span>{percCorretor.toFixed(1)}% ({corretor.realizado}/{corretor.meta_individual})</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
