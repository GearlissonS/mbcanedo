import { createClient } from '@supabase/supabase-js';

// Client centralizado e fixo para GH Pages (sem depender de env no build)
const supabaseUrl = 'https://vzikbsmenardukeggqvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aWtic21lbmFyZHVrZWdncXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTcwOTgsImV4cCI6MjA2OTk5MzA5OH0.rT6BKMsXEXyB149UGYuOjZy5wehmV0G-ZDNoo5TAMtE';

export const supabase = createClient(supabaseUrl, supabaseKey);
