import { useEffect } from "react";
import { supabase } from "@/context/supabaseClient";

type SupabaseRealtimePayload<T = Record<string, unknown>> = {
  eventType: string;
  schema: string;
  table: string;
  commit_timestamp?: string;
  new?: T;
  old?: T;
};

export function useRealtimeSales(onNewSale: (sale: Record<string, unknown>) => void) {
  useEffect(() => {
    // Substitua 'sales' pelo nome real da tabela de vendas
    const channel = supabase.channel('realtime-sales')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sales',
      }, (payload: SupabaseRealtimePayload) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          onNewSale(payload.new as Record<string, unknown>);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewSale]);
}
