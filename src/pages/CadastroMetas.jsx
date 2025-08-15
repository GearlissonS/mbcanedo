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
    try {
      const { data: eq, error: equipeError } = await supabase.from("equipes").select("*");
      if (equipeError) {
        console.error("Erro ao carregar equipes:", equipeError);
      } else {
        setEquipes(eq || []);
      }
      
      const { data: cor, error: corretorError } = await supabase.from("corretores").select("*");
      if (corretorError) {
        console.error("Erro ao carregar corretores:", corretorError);
      } else {
        setCorretores(cor || []);
      }
    } catch (err) {
      console.error("Erro na requisição para carregar dados:", err);
    }
  }

  async function salvarMetas() {
    try {
      let hasError = false;
      
      // Atualiza metas das equipes
      for (const equipe of equipes) {
        const valor = metaEquipe[equipe.id];
        if (valor !== undefined) {
          const { error } = await supabase.from("equipes").update({ meta_equipe: valor }).eq("id", equipe.id);
          if (error) {
            console.error(`Erro ao salvar meta da equipe ${equipe.nome}:`, error);
            hasError = true;
          }
        }
      }
      
      // Atualiza metas dos corretores
      for (const corretor of corretores) {
        const valor = metaCorretor[corretor.id];
        if (valor !== undefined) {
          const { error } = await supabase.from("corretores").update({ meta_individual: valor }).eq("id", corretor.id);
          if (error) {
            console.error(`Erro ao salvar meta do corretor ${corretor.nome}:`, error);
            hasError = true;
          }
        }
      }
      
      if (!hasError) {
        await carregarDados();
        alert("Metas salvas com sucesso!");
      } else {
        alert("Houve alguns erros ao salvar as metas. Verifique o console para mais detalhes.");
      }
    } catch (err) {
      console.error("Erro na requisição para salvar metas:", err);
      alert("Erro inesperado ao salvar metas. Verifique o console para mais detalhes.");
    }
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
