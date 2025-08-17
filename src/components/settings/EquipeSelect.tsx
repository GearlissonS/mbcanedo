import { useState, useEffect } from "react";
import { supabase } from "@/context/supabaseClient";

export default function EquipeSelect(props) {
  const [equipes, setEquipes] = useState([]);
  useEffect(() => {
    async function carregarEquipes() {
      try {
        const { data, error } = await supabase.from("equipes").select("*").order("nome");
        if (error) {
          console.error('[EquipeSelect] listar equipes failed', error);
        } else {
          setEquipes(data || []);
        }
      } catch (err) {
        console.error('[EquipeSelect] listar equipes threw', err);
      }
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
