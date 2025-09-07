import { useState, useEffect } from "react";
import { supabase } from "../context/supabaseClient";

export default function CadastroMetas() {
  const [equipes, setEquipes] = useState([]);
  const [corretores, setCorretores] = useState([]);
  const [metaEquipe, setMetaEquipe] = useState({});
  const [metaCorretor, setMetaCorretor] = useState({});

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const { data: eq } = await supabase.from("equipes").select("*");
    setEquipes(eq || []);
    const { data: cor } = await supabase.from("corretores").select("*");
    setCorretores(cor || []);
  }

  async function salvarMetas() {
    // Atualiza metas das equipes
    for (const equipe of equipes) {
      const valor = metaEquipe[equipe.id];
      if (valor !== undefined) {
        await supabase.from("equipes").update({ meta_equipe: valor }).eq("id", equipe.id);
      }
    }
    // Atualiza metas dos corretores
    for (const corretor of corretores) {
      const valor = metaCorretor[corretor.id];
      if (valor !== undefined) {
        await supabase.from("corretores").update({ meta_individual: valor }).eq("id", corretor.id);
      }
    }
    carregarDados();
    alert("Metas salvas com sucesso!");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Cadastro de Metas</h2>
      <h3>Metas das Equipes</h3>
      {equipes.map((equipe) => (
        <div key={equipe.id} style={{ marginBottom: 15 }}>
          <strong>{equipe.nome}</strong>
          <input
            type="number"
            value={metaEquipe[equipe.id] ?? equipe.meta_equipe ?? ""}
            onChange={e => setMetaEquipe({ ...metaEquipe, [equipe.id]: Number(e.target.value) })}
            style={{ marginLeft: 10 }}
            placeholder="Meta da equipe"
          />
        </div>
      ))}
      <h3>Metas dos Corretores</h3>
      {corretores.map((corretor) => (
        <div key={corretor.id} style={{ marginBottom: 10 }}>
          <strong>{corretor.nome}</strong>
          <input
            type="number"
            value={metaCorretor[corretor.id] ?? corretor.meta_individual ?? ""}
            onChange={e => setMetaCorretor({ ...metaCorretor, [corretor.id]: Number(e.target.value) })}
            style={{ marginLeft: 10 }}
            placeholder="Meta individual"
          />
        </div>
      ))}
      <button onClick={salvarMetas} style={{ marginTop: 20, padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4 }}>Salvar Metas</button>
    </div>
  );
}
