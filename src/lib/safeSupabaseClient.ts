export async function safeSubscribe(channel: string, callback: Function) {
  try {
    const ch = supabase.channel(channel); // cria o canal
    ch.on("broadcast", { event: "*" }, callback); // adiciona o evento

    const status = await ch.subscribe();
    if (status !== "SUBSCRIBED") throw new Error("Não conseguiu assinar");

    return ch;
  } catch (e) {
    console.warn(`[safeSupabaseClient] Falha ao conectar ao canal ${channel}.`, e);
    return null;
  }
}


