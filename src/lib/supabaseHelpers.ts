import { SupabaseClient } from '@supabase/supabase-js';

type SupabaseError = { message?: string } | string | null | undefined;
type SupabaseCall<T> = Promise<{ data: T | null; error: SupabaseError }>;

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
      const msg = typeof error === 'string' ? error : (error?.message || 'Unknown error');
      console.error(`[Supabase Error] ${label}:`, msg);
      return null;
    }
    return data;
  } catch (err) {
    const e = err as { message?: string } | string;
    const msg = typeof e === 'string' ? e : (e?.message || 'Unknown exception');
    console.error(`[Supabase Exception] ${label}:`, msg);
    return null;
  }
}
