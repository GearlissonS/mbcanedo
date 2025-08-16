// Instala um interceptor global de fetch para logar erros de rede
// e exibir um toast amigável quando houver falhas.
// Seguro para ser importado uma única vez no bootstrap da aplicação.

// Evita instalar duas vezes em hot-reload
if (typeof window !== 'undefined' && !(window as any).__FETCH_LOGGER_INSTALLED__) {
  (window as any).__FETCH_LOGGER_INSTALLED__ = true;

  const originalFetch = window.fetch.bind(window);

  async function toastError(msg: string) {
    try {
      const mod: any = await import('sonner');
      if (mod && typeof mod.toast?.error === 'function') {
        mod.toast.error(msg);
        return;
      }
    } catch {
      // ignore
    }
    // fallback
    // eslint-disable-next-line no-console
    console.warn('[toast]', msg);
  }

  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const res = await originalFetch(input, init);
      const url = typeof input === 'string' ? input : (input as any)?.url || String(input);
      if (res.status >= 400) {
        const shortUrl = url.length > 160 ? url.slice(0, 157) + '…' : url;
        const msg = `Erro de rede ${res.status} em ${shortUrl}`;
        console.error('[fetch]', msg);
        toastError(msg);
      }
      return res;
    } catch (err: any) {
      const url = typeof input === 'string' ? input : (input as any)?.url || String(input);
      const shortUrl = url.length > 160 ? url.slice(0, 157) + '…' : url;
      const msg = `Falha ao acessar ${shortUrl}: ${err?.message || err}`;
      console.error('[fetch]', msg);
      toastError(msg);
      throw err;
    }
  }) as typeof window.fetch;
}

export {};
