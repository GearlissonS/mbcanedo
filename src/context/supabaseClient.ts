// Reexporta o client central para evitar múltiplas instâncias
// e garantir funcionamento no GitHub Pages sem depender de env.
export { supabase } from '../supabaseClient';
