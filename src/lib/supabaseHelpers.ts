import { SupabaseClient } from '@supabase/supabase-js';

type SupabaseCall<T> = Promise<{ data: T | null; error: any }>;

/**
 * Wrapper para chamadas Supabase com logs padronizados de erro
 * @param label - Nome do contexto (ex: "CadastroEquipe/insert")
 * @param fn - Função Supabase a ser executada
 */
export async function supabaseGuard<T>(
  label: string,
  fn: () => SupabaseCall<T>
): Promise<T | null> {
  try {
    const { data, error } = await fn();
    if (error) {
      console.error(`[Supabase Error] ${label}:`, error.message || error);
      return null;
    }
    return data;
  } catch (err: any) {
    console.error(`[Supabase Exception] ${label}:`, err);
    return null;
  }
}
