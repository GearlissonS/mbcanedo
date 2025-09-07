import { supabase } from '../lib/supabaseClient';
import type { Meta } from '../types/core';

export async function getGoals(): Promise<Meta[]> {
  const { data, error } = await supabase.from('goals').select('*');
  if (error) throw error;
  return data || [];
}

export async function addGoal(goal: Omit<Meta, 'id'>): Promise<Meta> {
  const { data, error } = await supabase.from('goals').insert([goal]).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateGoal(id: string, goal: Partial<Meta>): Promise<Meta> {
  const { data, error } = await supabase.from('goals').update(goal).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from('goals').delete().eq('id', id);
  if (error) throw error;
}
