import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function loadEnvIfMissing() {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_KEY', 'VITE_SUPABASE_ANON_KEY'];
  const missing = required.every((k) => !process.env[k]);
  if (!missing) return;
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const rootEnvPath = path.resolve(__dirname, '..', '.env');
    if (existsSync(rootEnvPath)) {
      const txt = readFileSync(rootEnvPath, 'utf8');
      txt.split(/\r?\n/).forEach((line) => {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (m && !process.env[m[1]]) {
          process.env[m[1]] = m[2];
        }
      });
    }
  } catch {
    // ignore
  }
}

loadEnvIfMissing();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('[FAIL] Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_KEY/ANON_KEY');
  process.exit(1);
}

// Create a lightweight client suitable for short-lived Node scripts
// Disable timers to avoid Windows libuv assertion errors when exiting
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  try {
    // Try query on equipes first (table required by app)
    const { data, error } = await supabase.from('equipes').select('id').limit(1);
  if (error) {
      // If table missing but we can reach the server, report as connected
      const code = error.code || '';
      if (code === '42P01' || /relation .* does not exist/i.test(error.message || '')) {
        console.log('[OK] Connected to Supabase. Table "equipes" not found — run migrations.');
        process.exitCode = 0;
        return;
      }
      console.error('[FAIL] Supabase error:', error.message || error);
      process.exitCode = 2;
      return;
    }
    console.log(`[OK] Connected. Query succeeded. Found ${Array.isArray(data) ? data.length : 0} row(s).`);
    process.exitCode = 0;
  } catch (err) {
    console.error('[FAIL] Unexpected error:', err?.message || err);
    process.exitCode = 3;
  }
}

main();
