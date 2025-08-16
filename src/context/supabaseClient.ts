import { createClient } from '@supabase/supabase-js';

// Centraliza a configuração do Supabase.
// Usa variáveis de ambiente quando presentes (Vite),
// e faz fallback para valores publicados quando o build não injeta env (ex.: GitHub Pages).
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://vzikbsmenardukeggqvj.supabase.co';
const supabaseKey = (
	(import.meta.env.VITE_SUPABASE_KEY as string) ||
	(import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aWtic21lbmFyZHVrZWdncXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTcwOTgsImV4cCI6MjA2OTk5MzA5OH0.rT6BKMsXEXyB149UGYuOjZy5wehmV0G-ZDNoo5TAMtE'
);

export const supabase = createClient(supabaseUrl, supabaseKey);
