"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useRealtimePayments() {
  const [latestPayment, setLatestPayment] = useState<any>(null);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_exam_access',
          filter: 'is_premium=eq.true'
        },
        (payload) => {
          setLatestPayment(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_exam_access',
          filter: 'is_premium=eq.true'
        },
        (payload) => {
          if (payload.old && payload.old.is_premium === false) {
             setLatestPayment(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  return { latestPayment };
}
