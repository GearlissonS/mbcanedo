#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

function run(cmd, args, opts={}) {
  return new Promise((resolvePromise, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts });
    p.on('close', (code) => code === 0 ? resolvePromise(0) : reject(new Error(`${cmd} exited with ${code}`)));
  });
}

const target = 'http://localhost:4173/mbcanedo/';

await run('npm', ['run', 'build']);

// serve in background
const server = spawn('node', [resolve('scripts/serve-static.mjs')], { stdio: 'inherit', shell: process.platform === 'win32' });
// wait a bit
await sleep(1500);

try {
  await run('node', [resolve('scripts/audit-site.mjs'), target]);
  await run('node', [resolve('scripts/diagnose-project.mjs')]);
} finally {
  server.kill('SIGTERM');
}

console.log('[audit-all] Done');
