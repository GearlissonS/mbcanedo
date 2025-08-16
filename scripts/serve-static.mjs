#!/usr/bin/env node
import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const port = Number(process.env.PORT || 4173);
const base = '/mbcanedo';
const dist = resolve(process.cwd(), 'dist');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  let url = req.url || '/';
  // ensure base prefix
  if (!url.startsWith(base)) url = base + url;
  // strip base
  const p = url.slice(base.length) || '/';
  let filePath = join(dist, p);

  const send = (path) => {
    const ext = extname(path);
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    createReadStream(path).pipe(res);
  };

  if (existsSync(filePath) && !filePath.endsWith('/')) return send(filePath);

  // SPA fallback
  filePath = join(dist, 'index.html');
  if (existsSync(filePath)) return send(filePath);

  res.statusCode = 404;
  res.end('Not found');
});

server.listen(port, () => {
  console.log(`[serve] http://localhost:${port}${base}/`);
});
