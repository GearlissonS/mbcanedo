# RELATÓRIO de Auditoria (Inicial)

Este relatório será preenchido automaticamente pelos artefatos gerados pelo script `scripts/audit-site.mjs`.

Como rodar localmente:

```bash
npm ci
npm run build
npm run serve:dist &
# aguarde o log do servidor
npm run audit
```

Os resultados serão salvos na pasta `artifacts/` como JSON e Markdown (timestamp no nome).

Próximos passos sugeridos após a primeira execução:
- Verificar erros de console e requests 4xx/5xx.
- Checar assets 404 (ajustar base `/mbcanedo/` quando necessário).
- Validar RLS no Supabase (policies para `equipes`, `agents`, etc.).
- Confirmar `404.html` presente (já gerado por `copy404.cjs`).
