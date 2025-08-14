// Serviço CRUD de corretores, pronto para integração com Supabase
import { supabase } from '@/context/ThemeContext';
import { Broker } from '@/context/SettingsContext';

export async function getBrokers(): Promise<Broker[]> {
  const { data, error } = await supabase.from('brokers').select('*');
  if (error) throw error;
  return data || [];
}

export async function getBroker(id: string): Promise<Broker | null> {
  const { data, error } = await supabase.from('brokers').select('*').eq('id', id).single();
  if (error) throw error;
  return data || null;
}

export async function createBroker(broker: Broker): Promise<void> {
  const { error } = await supabase.from('brokers').insert([broker]);
  if (error) throw error;
}

export async function updateBroker(id: string, broker: Partial<Broker>): Promise<void> {
  const { error } = await supabase.from('brokers').update(broker).eq('id', id);
  if (error) throw error;
}

export async function deleteBroker(id: string): Promise<void> {
  const { error } = await supabase.from('brokers').delete().eq('id', id);
  if (error) throw error;
}
