# RELATÓRIO DE DIAGNÓSTICO

## Resumo
- Router basename correto: OK
- SPA fallback 404.html (após build): OK
- Supabase init: OK

## 1. Imports/Exports (ESM vs CommonJS)
- OK: nenhum uso de CommonJS detectado em src/

## 2. Rotas e basename
- OK em C:\Users\silva\Documents\GitHub\mbcanedo\src\App.tsx

## 3. Variáveis de ambiente
- C:\Users\silva\Documents\GitHub\mbcanedo\src\App.tsx: import.meta.env.BASE_URL
- C:\Users\silva\Documents\GitHub\mbcanedo\src\layouts\AppLayout.tsx: import.meta.env.BASE_URL
- C:\Users\silva\Documents\GitHub\mbcanedo\src\layouts\MainLayout.tsx: import.meta.env.BASE_URL
- C:\Users\silva\Documents\GitHub\mbcanedo\src\pages\NotFound.tsx: import.meta.env.BASE_URL

## 4. Recursos estáticos grandes (dist)
- C:\Users\silva\Documents\GitHub\mbcanedo\dist\assets\index-DQ1Jmz3i.js — 566.6 KB
- C:\Users\silva\Documents\GitHub\mbcanedo\dist\assets\Sales-BIhIUskA.js — 704.3 KB

## 5. Supabase e Empty token
- Detecção de client em C:\Users\silva\Documents\GitHub\mbcanedo\src\supabaseClient.js. Garanta que policies RLS permitem acesso anônimo se não há login.
- Para evitar "Empty token" em ambientes estáticos, preferir chave ANON pública no client ou checar env no build.

## 6. Scripts de auditoria
- Use `npm run audit` para auditoria Playwright (console errors e requests 4xx/5xx).
- Use `npm run diagnose` para gerar este relatório.

## 7. Vite base e Router basename
- Vite base em vite.config.ts: "/mbcanedo/" — OK

## Soluções diretas (copiar e colar)

### Supabase client com fallback de env ou chave pública (evita "Empty token")
```ts
// src/context/supabaseClient.ts
export { supabase } from '../supabaseClient';
```

### BrowserRouter com basename e SPA fallback no GitHub Pages
```tsx
// src/App.tsx
<BrowserRouter basename={import.meta.env.BASE_URL}>
  {/* ...rotas... */}
</BrowserRouter>
```
```js
// copy404.cjs (já incluso)
const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, 'dist');
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));
console.log('404.html criado!');
```

### Logger de fetch com toast de erro (rede e status >= 400)
```ts
// src/lib/networkDebug.ts (já incluso)
// e importe em src/main.ts: import './lib/networkDebug'
// Intercepta fetch e exibe toast

```

### CORS e APIs
- Se houver erros de CORS no audit (requests 4xx/5xx com motivo CORS), habilite `Access-Control-Allow-Origin` no backend.
- Para Supabase, prefira usar PostgREST via supabase-js e configurar RLS/policies ao invés de endpoints custom.