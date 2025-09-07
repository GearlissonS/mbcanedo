// Serviço CRUD de corretores, pronto para integração com Supabase
import { supabase } from "@/integrations/supabase/client";
import { Broker } from '@/context/SettingsContext';

export async function getBrokers(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from('brokers').select('*');
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('[brokersService] Falha ao buscar brokers, retornando lista vazia.', e);
    return [];
  }
}

export async function getBrokerById(id: string): Promise<any | null> {
  try {
    const { data, error } = await supabase.from('brokers').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('[brokersService] Falha ao buscar broker, retornando null.', e);
    return null;
  }
}

export async function createBroker(broker: Omit<Broker, 'id'>): Promise<void> {
  try {
    const { error } = await supabase.from('brokers').insert([broker]);
    if (error) throw error;
  } catch (e) {
    console.warn('[brokersService] Falha ao criar broker.', e);
  }
}

export async function updateBroker(id: string, broker: Partial<Broker>): Promise<void> {
  try {
    const { error } = await supabase.from('brokers').update(broker).eq('id', id);
    if (error) throw error;
  } catch (e) {
    console.warn('[brokersService] Falha ao atualizar broker.', e);
  }
}

export async function deleteBroker(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('brokers').delete().eq('id', id);
    if (error) throw error;
  } catch (e) {
    console.warn('[brokersService] Falha ao deletar broker.', e);
  }
}
