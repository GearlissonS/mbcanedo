// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Lê de variáveis de build (Vite/CRA) ou fallback via window (GH Pages)
let viteEnv;
try { viteEnv = import.meta.env; } catch { viteEnv = undefined; }
const supabaseUrl = (viteEnv && viteEnv.VITE_SUPABASE_URL) || (typeof window !== 'undefined' && window.__SUPABASE_URL__);
const supabaseAnonKey = (viteEnv && viteEnv.VITE_SUPABASE_ANON_KEY) || (typeof window !== 'undefined' && window.__SUPABASE_ANON_KEY__);

if (!supabaseUrl) throw new Error('supabaseUrl is required');
if (!supabaseAnonKey) throw new Error('supabase anon key is required');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
