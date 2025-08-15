import { useState, useEffect } from "react";
import { supabase } from "@/context/supabaseClient";

export default function EquipeManager() {
  const [equipes, setEquipes] = useState([]);
  const [novaEquipe, setNovaEquipe] = useState("");
  const [selectedEquipe, setSelectedEquipe] = useState("");

  useEffect(() => {
    carregarEquipes();
  }, []);

  async function carregarEquipes() {
    const { data, error } = await supabase.from("equipes").select("*").order("nome");
    if (!error) setEquipes(data);
  }

  async function adicionarEquipe() {
    if (!novaEquipe.trim()) return;
    const { error } = await supabase.from("equipes").insert([{ nome: novaEquipe }]);
    if (!error) {
      setNovaEquipe("");
      carregarEquipes();
    } else {
      alert("Erro ao cadastrar equipe");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Nova equipe"
          value={novaEquipe}
          onChange={e => setNovaEquipe(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button className="bg-primary text-white px-4 py-1 rounded" onClick={adicionarEquipe}>Adicionar</button>
      </div>
      <div>
        <label className="block mb-1 font-medium">Selecione uma equipe:</label>
        <select
          value={selectedEquipe}
          onChange={e => setSelectedEquipe(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Selecione</option>
          {equipes.map(eq => (
            <option key={eq.id} value={eq.nome}>{eq.nome}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
