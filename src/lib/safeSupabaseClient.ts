import { supabase } from "@/context/supabaseClient";

/**
 * Seleciona registros de uma tabela do Supabase com tratamento de erro.
 */
export async function safeSelect(table: string, options: any = {}) {
  try {
    let query = supabase.from(table).select("*");
    if (options.order) query = query.order(options.order);
    if (options.eq) query = query.eq(options.eq[0], options.eq[1]);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn(`[safeSupabaseClient] safeSelect falhou para ${table}.`, e);
    return null;
  }
}

/**
 * Insere um registro em uma tabela do Supabase com tratamento de erro.
 */
export async function safeInsert(table: string, values: any) {
  try {
    const { error } = await supabase.from(table).insert(values);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn(`[safeSupabaseClient] safeInsert falhou para ${table}.`, e);
    return false;
  }
}

/**
 * Atualiza um registro em uma tabela do Supabase com tratamento de erro.
 */
export async function safeUpdate(table: string, id: string, values: any) {
  try {
    const { error } = await supabase.from(table).update(values).eq("id", id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn(`[safeSupabaseClient] safeUpdate falhou para ${table}.`, e);
    return false;
  }
}

/**
 * Exclui um registro de uma tabela do Supabase com tratamento de erro.
 */
export async function safeDelete(table: string, id: string) {
  try {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn(`[safeSupabaseClient] safeDelete falhou para ${table}.`, e);
    return false;
  }
}
export async function safeSubscribe(channel: string, callback: Function) {
  try {
    const ch = supabase.channel(channel); // cria o canal
    ch.on("broadcast", { event: "*" }, callback); // adiciona o evento

    const status = await ch.subscribe();
    if (status !== "SUBSCRIBED") throw new Error("Não conseguiu assinar");

    return ch;
  } catch (e) {
    console.warn(`[safeSupabaseClient] Falha ao conectar ao canal ${channel}.`, e);
    return null;
  }
}


