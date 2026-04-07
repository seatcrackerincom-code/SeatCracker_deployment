// Supabase Realtime Presence — tracks concurrent users (CCU)
// Uses websockets to detect tab-close/disconnect instantly.

import { supabase } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

let _channel: RealtimeChannel | null = null;

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
      // Internal sync completed
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

/**
 * Returns the current total count of unique active tabs/sessions.
 * Note: Admin should subscribe to 'on(presence)' to get live updates.
 */
export function getLiveCCU(channel: RealtimeChannel): number {
  const state = channel.presenceState();
  return Object.keys(state).length;
}
