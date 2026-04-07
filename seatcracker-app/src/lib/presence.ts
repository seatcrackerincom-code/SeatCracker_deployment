// Supabase Realtime Presence — tracks concurrent users (CCU)
// Uses websockets to detect tab-close/disconnect instantly.

import { supabase } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

let _channel: RealtimeChannel | null = null;
let _presenceState: any = {};
const _listeners: Array<(state: any) => void> = [];

/**
 * Starts tracking this user in the 'online-users' channel.
 * Should be called once at app startup.
 */
export async function initPresence(userId: string = "anonymous") {
  if (typeof window === "undefined" || _channel || !supabase) return;

  _channel = supabase.channel("online-users", {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  _channel
    .on("presence", { event: "sync" }, () => {
      _presenceState = _channel!.presenceState();
      _listeners.forEach((cb) => cb(_presenceState));
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await _channel?.track({
          online_at: new Date().toISOString(),
          user_agent: window.navigator.userAgent,
        });
      }
    });

  return _channel;
}

export function subscribeToPresence(cb: (state: any) => void) {
  _listeners.push(cb);
  cb(_presenceState); // immediate initial sync
  return () => {
    const idx = _listeners.indexOf(cb);
    if (idx > -1) _listeners.splice(idx, 1);
  };
}

/**
 * Hook to subscribe to live user count from any component.
 */
export function useLivePresence() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsub = subscribeToPresence((state) => {
      setCount(Object.keys(state).length);
    });
    return unsub;
  }, []);

  return count;
}
