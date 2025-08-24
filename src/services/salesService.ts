import { supabase } from '../lib/supabaseClient';

export interface Sale {
  id: string;
  agent_id: string;
  value: number;
  status: string;
  origin: string;
  created_at: string;
}

export async function getSales(): Promise<Sale[]> {
  const { data, error } = await supabase.from('sales').select('*');
  if (error) throw error;
  return data || [];
}

export async function addSale(sale: Omit<Sale, 'id' | 'created_at'>): Promise<Sale> {
  const { data, error } = await supabase.from('sales').insert([sale]).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateSale(id: string, sale: Partial<Sale>): Promise<Sale> {
  const { data, error } = await supabase.from('sales').update(sale).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteSale(id: string): Promise<void> {
  const { error } = await supabase.from('sales').delete().eq('id', id);
  if (error) throw error;
}
