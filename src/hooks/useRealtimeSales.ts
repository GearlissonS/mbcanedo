import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useRealtimeSales(onNewSale: (sale: any) => void) {
  useEffect(() => {
    // Substitua 'sales' pelo nome real da tabela de vendas
    const channel = supabase.channel('realtime-sales')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sales',
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          onNewSale(payload.new);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewSale]);
}
