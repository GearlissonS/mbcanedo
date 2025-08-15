import { useState, useEffect } from "react";
import { supabase } from "../context/supabaseClient";

export default function ConfigCorretor() {
  const [equipes, setEquipes] = useState([]);
  const [novaEquipe, setNovaEquipe] = useState("");
  const [form, setForm] = useState({
    nome: "",
    apelido: "",
    creci: "",
    equipe: "",
    vgv: 0,
    tempoMedio: 0,
  });

  useEffect(() => {
    carregarEquipes();
  }, []);

  // Buscar equipes cadastradas
  async function carregarEquipes() {
    try {
      const { data, error } = await supabase.from("equipes").select("*").order("nome");
      if (error) {
        console.error("Erro ao carregar equipes:", error);
        return;
      }
      setEquipes(data || []);
    } catch (err) {
      console.error("Erro na requisição para carregar equipes:", err);
    }
  }

  // Adicionar nova equipe
  async function adicionarEquipe() {
    if (!novaEquipe.trim()) return;
    
    try {
      const { error } = await supabase.from("equipes").insert([{ nome: novaEquipe }]);
      if (error) {
        console.error("Erro ao adicionar equipe:", error);
        return;
      }
      setNovaEquipe("");
      await carregarEquipes();
    } catch (err) {
      console.error("Erro na requisição para adicionar equipe:", err);
    }
  }

  // Atualizar campos do formulário
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Corretores</h2>
      <input
        type="text"
        name="nome"
        placeholder="Nome completo"
        value={form.nome}
        onChange={handleChange}
      />
      <input
        type="text"
        name="apelido"
        placeholder="Apelido"
        value={form.apelido}
        onChange={handleChange}
      />
      <input
        type="text"
        name="creci"
        placeholder="CRECI"
        value={form.creci}
        onChange={handleChange}
      />

      {/* Cadastro rápido de equipe */}
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Nova equipe"
          value={novaEquipe}
          onChange={(e) => setNovaEquipe(e.target.value)}
        />
        <button onClick={adicionarEquipe}>Adicionar</button>
      </div>

      {/* Select dinâmico */}
      <select
        name="equipe"
        value={form.equipe}
        onChange={handleChange}
        style={{ marginTop: 10 }}
      >
        <option value="">Selecione</option>
        {equipes.map((eq) => (
          <option key={eq.id} value={eq.nome}>
            {eq.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
