import { supabase } from '../lib/supabaseClient';

export interface Goal {
  id: string;
  agent_id: string;
  meta: number;
  periodo: string;
}

export async function getGoals(): Promise<Goal[]> {
  const { data, error } = await supabase.from('goals').select('*');
  if (error) throw error;
  return data || [];
}

export async function addGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
  const { data, error } = await supabase.from('goals').insert([goal]).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateGoal(id: string, goal: Partial<Goal>): Promise<Goal> {
  const { data, error } = await supabase.from('goals').update(goal).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from('goals').delete().eq('id', id);
  if (error) throw error;
}
