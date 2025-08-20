#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const targetUrl = process.argv[2] || 'https://gearlissons.github.io/mbcanedo/';
const outDir = resolve(process.cwd(), 'artifacts');
mkdirSync(outDir, { recursive: true });

const now = new Date().toISOString().replace(/[:.]/g, '-');
const jsonPath = resolve(outDir, `audit-${now}.json`);
const mdPath = resolve(outDir, `audit-${now}.md`);

const consoleMessages = [];
const requests = [];
let domContentLoadedAt = null;
let loadAt = null;

function hr(ms) {
  return `${ms.toFixed(0)} ms`;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

page.on('console', (msg) => {
  const type = msg.type();
  const text = msg.text();
  consoleMessages.push({ type, text });
});

page.on('requestfinished', async (req) => {
  try {
    const res = await req.response();
    const status = res?.status();
    const url = req.url();
    if (status >= 400) {
      requests.push({ url, status, method: req.method(), failure: null });
    }
  } catch { /* ignore */ }
});

page.on('requestfailed', (req) => {
  requests.push({ url: req.url(), status: null, method: req.method(), failure: req.failure()?.errorText || 'failed' });
});

page.once('domcontentloaded', async () => {
  try {
    const timing = await page.evaluate(() => performance.timing);
    domContentLoadedAt = timing.domContentLoadedEventEnd - timing.navigationStart;
  } catch { /* ignore */ }
});

page.once('load', async () => {
  try {
    const timing = await page.evaluate(() => performance.timing);
    loadAt = timing.loadEventEnd - timing.navigationStart;
  } catch { /* ignore */ }
});

let ok = true;
let errorMsg = '';
try {
  const resp = await page.goto(targetUrl, { waitUntil: 'load', timeout: 60000 });
  if (!resp) throw new Error('No response');
} catch (err) {
  ok = false;
  errorMsg = err?.message || String(err);
}

// Detect missing assets explicitly by scanning network log (404) and console errors
const missingAssets = requests.filter(r => (r.status === 404) || (/\.js$|\.css$/i.test(r.url) && r.failure));

const report = {
  url: targetUrl,
  ok,
  error: errorMsg || null,
  timings: {
    domContentLoaded: domContentLoadedAt,
    load: loadAt,
  },
  console: consoleMessages,
  requests_4xx_5xx: requests,
  missingAssets,
  generatedAt: new Date().toISOString(),
};

writeFileSync(jsonPath, JSON.stringify(report, null, 2));

const md = [];
md.push(`# Auditoria do Site`);
md.push('');
md.push(`- URL: ${targetUrl}`);
md.push(`- Status: ${ok ? 'OK' : 'FALHA'}${errorMsg ? ` — ${errorMsg}` : ''}`);
md.push(`- DOMContentLoaded: ${domContentLoadedAt != null ? hr(domContentLoadedAt) : 'n/d'}`);
md.push(`- Load: ${loadAt != null ? hr(loadAt) : 'n/d'}`);
md.push('');
const errs = consoleMessages.filter(m => m.type === 'error');
const warns = consoleMessages.filter(m => m.type === 'warning' || m.type === 'warn');
md.push(`## Console`);
md.push(`- Errors: ${errs.length}`);
md.push(`- Warnings: ${warns.length}`);
if (errs.length) {
  md.push('### Errors');
  errs.slice(0, 20).forEach((e) => md.push(`- ${e.text}`));
}
if (warns.length) {
  md.push('### Warnings');
  warns.slice(0, 20).forEach((w) => md.push(`- ${w.text}`));
}
md.push('');
md.push(`## Requests com status >= 400 (${requests.length})`);
requests.slice(0, 50).forEach((r) => md.push(`- [${r.status ?? 'failed'}] ${r.method} ${r.url} ${r.failure ? `(${r.failure})` : ''}`));
md.push('');
if (missingAssets.length) {
  md.push(`## Assets faltando (${missingAssets.length})`);
  missingAssets.forEach((r) => md.push(`- ${r.url}`));
}

writeFileSync(mdPath, md.join('\n'));

await browser.close();

console.log(`[audit] Report saved: ${jsonPath}`);
console.log(`[audit] Summary saved: ${mdPath}`);
