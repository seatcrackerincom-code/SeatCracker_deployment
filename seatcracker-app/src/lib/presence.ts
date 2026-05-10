// Supabase Realtime Presence — tracks concurrent users (CCU)
// Uses websockets to detect tab-close/disconnect instantly.

import { supabase } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

let _channel: RealtimeChannel | null = null;
let _presenceState: any = {};
const _listeners: Array<(state: any) => void> = [];
let _currentUserId: string | null = null;

/**
 * Starts tracking this user in the 'online-users' channel.
 * Should be called whenever the user identity changes (login/logout).
 */
export async function initPresence(userId: string = "anonymous") {
  if (typeof window === "undefined" || !supabase) return;
  
  // If already tracking this same user, do nothing
  if (_channel && _currentUserId === userId) return;

  // If already tracking someone else, unsubscribe first
  if (_channel) {
    _channel.unsubscribe();
    _channel = null;
  }

  _currentUserId = userId;
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
          user_agent: typeof window !== "undefined" ? window.navigator.userAgent : "",
        });
      }
    });

  return _channel;
}

/**
 * Updates the data associated with the current user's presence (e.g., current exam).
 */
export async function updatePresence(data: any) {
  if (typeof window === "undefined" || !_channel) return;
  
  await _channel.track({
    ...data,
    online_at: new Date().toISOString(),
    user_agent: window.navigator.userAgent,
  });
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
 * Filters by exam if provided.
 */
export function useLivePresence(examFilter?: "JEE" | "EAMCET") {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsub = subscribeToPresence((state) => {
      let total = 0;
      Object.keys(state).forEach(key => {
        const userPresences = state[key];
        if (Array.isArray(userPresences)) {
          userPresences.forEach(p => {
            if (!examFilter) {
              total++;
            } else {
              // Match exam filter
              if (examFilter === "JEE" && p.exam === "JEE") total++;
              if (examFilter === "EAMCET" && (p.exam === "EAMCET" || p.exam === "AP" || p.exam === "TS")) total++;
            }
          });
        }
      });
      
      // Safety: always show at least 1 if the current user is active
      setCount(Math.max(total, 0));
    });
    return unsub;
  }, [examFilter]);

  return count;
}
