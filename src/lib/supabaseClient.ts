import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vzikbsmenardukegqgvj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aWtic21lbmFyZHVrZWdxZ3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTcwOTgsImV4cCI6MjA2OTk5MzA5OH0.rT6BKMsXEXyB149UGYuOjZy5wehmV0G-ZDNoo5TAMtE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
