// Script para copiar index.html para 404.html após o build
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const indexFile = path.join(distDir, 'index.html');
const notFoundFile = path.join(distDir, '404.html');

fs.copyFileSync(indexFile, notFoundFile);
console.log('404.html criado com sucesso!');
