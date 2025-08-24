import { supabase } from '../lib/supabaseClient';

export interface Team {
  id: string;
  nome: string;
}

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase.from('equipes').select('*');
  if (error) throw error;
  return data || [];
}

export async function addTeam(team: Omit<Team, 'id'>): Promise<Team> {
  const { data, error } = await supabase.from('equipes').insert([team]).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateTeam(id: string, team: Partial<Team>): Promise<Team> {
  const { data, error } = await supabase.from('equipes').update(team).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteTeam(id: string): Promise<void> {
  const { error } = await supabase.from('equipes').delete().eq('id', id);
  if (error) throw error;
}
