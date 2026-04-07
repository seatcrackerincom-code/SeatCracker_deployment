"use client";

import { useEffect } from "react";
import { initPresence } from "../lib/presence";
import { onAuthChange } from "../lib/firebase";

/**
 * Global Presence Tracker
 * Injects into root layout to sync concurrent users (CCU) in real-time.
 */
export default function PresenceTracker() {
  useEffect(() => {
    // 1. Initial anonymous sync
    initPresence("sc_guest_" + Math.random().toString(36).substring(7));

    // 2. If user logs in, upgrade to their real UID (Supabase Presence handles the key update)
    const unsub = onAuthChange((user) => {
      if (user) {
        initPresence(user.uid);
      }
    });

    return () => unsub();
  }, []);

  return null; // Invisible component
}
