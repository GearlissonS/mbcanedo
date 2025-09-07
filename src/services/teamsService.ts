import { supabase } from '../lib/supabaseClient';
import type { Equipe } from '../types/core';

export async function getTeams(): Promise<Equipe[]> {
  const { data, error } = await supabase.from('equipes').select('*');
  if (error) throw error;
  return data || [];
}

export async function addTeam(team: Omit<Equipe, 'id'>): Promise<Equipe> {
  const { data, error } = await supabase.from('equipes').insert([team]).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateTeam(id: string, team: Partial<Equipe>): Promise<Equipe> {
  const { data, error } = await supabase.from('equipes').update(team).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteTeam(id: string): Promise<void> {
  const { error } = await supabase.from('equipes').delete().eq('id', id);
  if (error) throw error;
}
