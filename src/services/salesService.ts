import { supabase } from '../lib/supabaseClient';
import { vendaSchema } from '../lib/validators';
import type { Venda } from '../types/core';

export async function getSales(): Promise<Venda[]> {
  const { data, error } = await supabase.from('sales').select('*');
  if (error) throw error;
  return data || [];
}

export async function addSale(sale: Omit<Venda, 'id' | 'created_at'>): Promise<Venda> {
  const parse = vendaSchema.safeParse(sale);
  if (!parse.success) throw new Error('Dados inválidos para venda');
  const { data, error } = await supabase.from('sales').insert([parse.data]).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateSale(id: string, sale: Partial<Venda>): Promise<Venda> {
  const { data, error } = await supabase.from('sales').update(sale).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteSale(id: string): Promise<void> {
  const { error } = await supabase.from('sales').delete().eq('id', id);
  if (error) throw error;
}
