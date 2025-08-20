// Serviço CRUD de corretores, pronto para integração com Supabase
import { safeSelect, safeInsert, safeUpdate, safeDelete } from "@/lib/safeSupabaseClient";
import { Broker } from '@/context/SettingsContext';

  try {
    return await safeSelect('brokers');
  } catch (e) {
    console.warn('[brokersService] Falha ao buscar brokers, retornando lista vazia.', e);
    return [];
  }
}

  try {
    const list = await safeSelect('brokers');
    return Array.isArray(list) ? list.find((b: any) => b.id === id) || null : null;
  } catch (e) {
    console.warn('[brokersService] Falha ao buscar broker, retornando null.', e);
    return null;
  }
}

  try {
    await safeInsert('brokers', broker);
  } catch (e) {
    console.warn('[brokersService] Falha ao criar broker.', e);
  }
}

  try {
    await safeUpdate('brokers', id, broker);
  } catch (e) {
    console.warn('[brokersService] Falha ao atualizar broker.', e);
  }
}

  try {
    await safeDelete('brokers', id);
  } catch (e) {
    console.warn('[brokersService] Falha ao deletar broker.', e);
  }
}
