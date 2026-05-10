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
    // 1. Initial anonymous sync (if no user detected yet)
    initPresence("sc_guest_" + Math.random().toString(36).substring(7));

    // 2. Sync with real UID on auth change
    const unsub = onAuthChange((user) => {
      if (user && user.uid !== "sc_user") {
        initPresence(user.uid);
      } else {
        // If logout, revert to guest
        initPresence("sc_guest_" + Math.random().toString(36).substring(7));
      }
    });

    return () => unsub();
  }, []);

  return null; // Invisible component
}
