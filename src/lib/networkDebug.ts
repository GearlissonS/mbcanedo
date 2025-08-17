// Instala um interceptor global de fetch para logar erros de rede
// e exibir um toast amigável quando houver falhas.
// Seguro para ser importado uma única vez no bootstrap da aplicação.

// Evita instalar duas vezes em hot-reload
declare global {
  interface Window { __FETCH_LOGGER_INSTALLED__?: boolean }
}

if (typeof window !== 'undefined' && !window.__FETCH_LOGGER_INSTALLED__) {
  window.__FETCH_LOGGER_INSTALLED__ = true;

  const originalFetch = window.fetch.bind(window);

  async function toastError(msg: string) {
    try {
      const mod: unknown = await import('sonner');
      const maybe = mod as { toast?: { error?: (m: string) => void } };
      if (maybe && typeof maybe.toast?.error === 'function') {
        maybe.toast!.error!(msg);
        return;
      }
    } catch {
      // ignore
    }
    // fallback
    console.warn('[toast]', msg);
  }

  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const res = await originalFetch(input, init);
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
      if (res.status >= 400) {
        const shortUrl = url.length > 160 ? url.slice(0, 157) + '…' : url;
        const msg = `Erro de rede ${res.status} em ${shortUrl}`;
        console.error('[fetch]', msg);
        toastError(msg);
      }
      return res;
    } catch (err) {
      const e = err as unknown as { message?: string } | string;
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
      const shortUrl = url.length > 160 ? url.slice(0, 157) + '…' : url;
      const msg = `Falha ao acessar ${shortUrl}: ${typeof e === 'string' ? e : (e?.message || 'erro')}`;
      console.error('[fetch]', msg);
      toastError(msg);
      throw err;
    }
  }) as typeof window.fetch;
}

export {};
