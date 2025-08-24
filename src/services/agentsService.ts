import { supabase } from '../lib/supabaseClient';

export interface Agent {
  id: string;
  nome: string;
  apelido: string;
  avatar: string;
}

export async function getAgents(): Promise<Agent[]> {
  const { data, error } = await supabase.from('agents').select('*');
  if (error) throw error;
  return data || [];
}

export async function addAgent(agent: Omit<Agent, 'id'>): Promise<Agent> {
  const { data, error } = await supabase.from('agents').insert([agent]).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateAgent(id: string, agent: Partial<Agent>): Promise<Agent> {
  const { data, error } = await supabase.from('agents').update(agent).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteAgent(id: string): Promise<void> {
  const { error } = await supabase.from('agents').delete().eq('id', id);
  if (error) throw error;
}
