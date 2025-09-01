import React, { useEffect, useState } from 'react';
import { getTeams, addTeam, deleteTeam } from '../services/teamsService';
import type { Equipe } from '../types/core';

export default function TeamsList() {
  const [teams, setTeams] = useState<Equipe[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getTeams()
      .then(setTeams)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!newTeam.trim()) return;
    setLoading(true);
    try {
      const team = await addTeam({ nome: newTeam, created_at: new Date().toISOString() });
      setTeams([...teams, team]);
      setNewTeam('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteTeam(id);
      setTeams(teams.filter(t => t.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Equipes</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="border px-2 py-1 rounded w-full"
          value={newTeam}
          onChange={e => setNewTeam(e.target.value)}
          placeholder="Nome da equipe"
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleAdd} disabled={loading}>
          Adicionar
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <ul className="space-y-2">
          {teams.map(team => (
            <li key={team.id} className="flex justify-between items-center border-b pb-1">
              <span>{team.nome}</span>
              <button className="text-red-500" onClick={() => handleDelete(team.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
