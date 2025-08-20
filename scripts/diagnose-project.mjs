#!/usr/bin/env node
// Diagnóstico estático do projeto React/Vite + verificações simples de runtime via build/dist.
import { readFileSync, existsSync, statSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const srcDir = resolve(root, 'src');
const distDir = resolve(root, 'dist');
const outMd = resolve(root, 'RELATORIO.md');

function read(path) {
  try { return readFileSync(path, 'utf8'); } catch { return ''; }
}

function has404Fallback() {
  const p = join(distDir, '404.html');
  return existsSync(p) && statSync(p).isFile();
}

function scanFiles(dir, exts=['.ts', '.tsx', '.js', '.jsx']) {
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d, { withFileTypes: true })) {
      if (name.name.startsWith('.')) continue;
      const full = join(d, name.name);
      if (name.isDirectory()) walk(full);
      else if (exts.some(e => full.endsWith(e))) out.push(full);
    }
  };
  walk(dir);
  return out;
}

const files = scanFiles(srcDir);

// 1) Imports/exports: detectar mistura CJS/ESM em código de app (esperado ESM)
const importIssues = [];
for (const f of files) {
  const txt = read(f);
  if (/module\.exports\s*=|exports\./.test(txt)) {
    importIssues.push({ file: f, issue: 'Uso de CommonJS (module.exports/exports) em projeto ESM' });
  }
}

// 2) Router basename e BrowserRouter
let routerOk = false;
let routerPath = '';
for (const f of files) {
  if (/(BrowserRouter|HashRouter)/.test(read(f))) {
    const txt = read(f);
    if (/BrowserRouter[^{]*\bbasename=\{import\.meta\.env\.BASE_URL\}/.test(txt)) {
      routerOk = true;
      routerPath = f;
      break;
    }
  }
}

// 3) Variáveis de ambiente Supabase
const supaFiles = files.filter(f => /supabaseClient\.(t|j)sx?/.test(f) || /from\(".*\)/.test(read(f)) && /supabase/.test(read(f)));
const envMentions = files.flatMap((f) => {
  const t = read(f);
  const m = t.match(/import\.meta\.env\.[A-Z0-9_]+/g) || [];
  return m.length ? [{ file: f, keys: [...new Set(m)] }] : [];
});

// 4) Recursos estáticos grandes e URLs base (checa também vite.config.ts base)
const baseMentions = files.flatMap((f) => {
  const t = read(f);
  const m = t.match(/import\.meta\.env\.BASE_URL/g) || [];
  return m.length ? [f] : [];
});

let viteBaseOk = false;
let viteBaseValue = '';
const viteCfgPath = resolve(root, 'vite.config.ts');
if (existsSync(viteCfgPath)) {
  const t = read(viteCfgPath);
  const m = t.match(/base:\s*['\"]([^'\"]+)['\"]/);
  if (m) {
    viteBaseValue = m[1];
    viteBaseOk = /^\/mbcanedo\/?$/.test(viteBaseValue);
  }
}

// 5) Checagens simples de dist (se existir)
const distFindings = [];
if (existsSync(distDir)) {
  // arquivos JS > 500 KB
  const walkDist = (d) => {
    for (const name of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, name.name);
      if (name.isDirectory()) walkDist(full);
      else if (/\.(js|css)$/.test(name.name)) {
        const size = statSync(full).size;
        if (size > 500 * 1024) {
          distFindings.push({ file: full, size });
        }
      }
    }
  };
  walkDist(distDir);
}

// 6) Supabase init guidance (Empty token)
let supaInitOk = false;
let supaInitFile = '';
for (const f of files) {
  if (/supabaseClient\.(t|j)sx?$/.test(f)) {
    const txt = read(f);
    if (/createClient\(/.test(txt) && /(VITE_SUPABASE_URL|https:\/\/)/.test(txt)) {
      supaInitOk = true;
      supaInitFile = f;
      break;
    }
  }
}

// Compose Markdown report
const md = [];
md.push('# RELATÓRIO DE DIAGNÓSTICO');
md.push('');
md.push('## Resumo');
md.push(`- Router basename correto: ${routerOk ? 'OK' : 'FALTA ajustar (use <BrowserRouter basename={import.meta.env.BASE_URL}>)'}`);
md.push(`- SPA fallback 404.html (após build): ${has404Fallback() ? 'OK' : 'NÃO ENCONTRADO (rode npm run build)'}`);
md.push(`- Supabase init: ${supaInitOk ? 'OK' : 'Verificar supabaseClient.* (createClient ausente?)'}`);
md.push('');

md.push('## 1. Imports/Exports (ESM vs CommonJS)');
if (importIssues.length === 0) md.push('- OK: nenhum uso de CommonJS detectado em src/');
else importIssues.forEach(i => md.push(`- ${i.file}: ${i.issue}`));
md.push('');

md.push('## 2. Rotas e basename');
md.push(routerOk ? `- OK em ${routerPath}` : '- Ajuste o BrowserRouter para usar basename={import.meta.env.BASE_URL}');
md.push('');

md.push('## 3. Variáveis de ambiente');
if (envMentions.length === 0) md.push('- Sem referências a import.meta.env encontradas.');
else envMentions.forEach(e => md.push(`- ${e.file}: ${e.keys.join(', ')}`));
md.push('');

md.push('## 4. Recursos estáticos grandes (dist)');
if (distFindings.length === 0) md.push('- OK: nenhum JS/CSS > 500KB encontrado (ou dist ausente).');
else distFindings.forEach(f => md.push(`- ${f.file} — ${(f.size/1024).toFixed(1)} KB`));
md.push('');

md.push('## 5. Supabase e Empty token');
if (supaInitOk) {
  md.push(`- Detecção de client em ${supaInitFile}. Garanta que policies RLS permitem acesso anônimo se não há login.`);
  md.push('- Para evitar "Empty token" em ambientes estáticos, preferir chave ANON pública no client ou checar env no build.');
} else {
  md.push('- Não foi possível localizar supabaseClient.* com createClient — verifique se o client central está presente.');
}
md.push('');

md.push('## 6. Scripts de auditoria');
md.push('- Use `npm run audit` para auditoria Playwright (console errors e requests 4xx/5xx).');
md.push('- Use `npm run diagnose` para gerar este relatório.');

md.push('');
md.push('## 7. Vite base e Router basename');
if (viteBaseValue) {
  md.push(`- Vite base em vite.config.ts: "${viteBaseValue}" — ${viteBaseOk ? 'OK' : 'Ajuste para "/mbcanedo/"'}`);
} else {
  md.push('- Não foi possível ler `vite.config.ts` ou não há `base` definido. Defina `base: "/mbcanedo/"`.');
}
md.push('');

md.push('## Soluções diretas (copiar e colar)');
md.push('');
md.push('### Supabase client com fallback de env ou chave pública (evita "Empty token")');
md.push('```ts');
md.push("// src/context/supabaseClient.ts\nexport { supabase } from '../supabaseClient';");
md.push('```');
md.push('');
md.push('### BrowserRouter com basename e SPA fallback no GitHub Pages');
md.push('```tsx');
md.push("// src/App.tsx\n<BrowserRouter basename={import.meta.env.BASE_URL}>\n  {/* ...rotas... */}\n</BrowserRouter>");
md.push('```');
md.push('```js');
md.push("// copy404.cjs (já incluso)\nconst fs = require('fs');\nconst path = require('path');\nconst dist = path.join(__dirname, 'dist');\nfs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));\nconsole.log('404.html criado!');");
md.push('```');
md.push('');
md.push('### Logger de fetch com toast de erro (rede e status >= 400)');
md.push('```ts');
md.push("// src/lib/networkDebug.ts (já incluso)\n// e importe em src/main.ts: import './lib/networkDebug'\n// Intercepta fetch e exibe toast\n");
md.push('```');
md.push('');
md.push('### CORS e APIs');
md.push('- Se houver erros de CORS no audit (requests 4xx/5xx com motivo CORS), habilite `Access-Control-Allow-Origin` no backend.');
md.push('- Para Supabase, prefira usar PostgREST via supabase-js e configurar RLS/policies ao invés de endpoints custom.');

writeFileSync(outMd, md.join('\n'));

console.log(`[diagnose] Relatório gerado em ${outMd}`);
