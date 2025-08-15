import { useState, useEffect } from "react";
import { supabase } from "../../context/supabaseClient";

export default function EquipeSelect(props) {
  const [equipes, setEquipes] = useState([]);
  useEffect(() => {
    async function carregarEquipes() {
      const { data, error } = await supabase.from("equipes").select("*").order("nome");
      if (!error) setEquipes(data);
    }
    carregarEquipes();
  }, []);
  return (
    <select {...props} className="w-full border rounded px-2 py-1">
      <option value="">Selecione</option>
      {equipes.map(eq => (
        <option key={eq.id} value={eq.nome}>{eq.nome}</option>
      ))}
    </select>
  );
}
