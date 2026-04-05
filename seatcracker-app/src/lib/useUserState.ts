"use client";

import { useState, useEffect } from "react";
import { validatePromoCode } from "../lib/promoCodes";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface UserState {
  name: string;
  targetRank: number;
  progressPercent: number;
  xp: number;
  applied_codes: string[];
  unlocked_features: string[];
  discount_percentage: number;
  avgAccuracy: number;
  avgPace: number;
}

const DEFAULT_STATE: UserState = {
  name: "Learner",
  targetRank: 10000,
  progressPercent: 0,
  xp: 0,
  applied_codes: [],
  unlocked_features: [],
  discount_percentage: 0,
  avgAccuracy: 0,
  avgPace: 2.5, // Default pace
};

const LS_KEY = "sc_user_state";

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useUserState() {
  const [user, setUser] = useState<UserState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<UserState>;
        setUser({ ...DEFAULT_STATE, ...parsed });
      }
    } catch {
      // Corrupted data — start fresh
    }
    setIsLoaded(true);
  }, []);

  // Persist any state change
  const saveState = (updated: UserState) => {
    setUser(updated);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
    } catch {
      // Storage full — ignore
    }
  };

  // Apply a promo code and return a result message
  const applyCode = (input: string): { success: boolean; message: string } => {
    const clean = input.trim().toUpperCase();

    // Duplicate check
    if (user.applied_codes.includes(clean)) {
      return { success: false, message: "You have already used this code." };
    }

    const { valid, data, error } = validatePromoCode(clean);
    if (!valid || !data) {
      return { success: false, message: error ?? "Invalid code." };
    }

    const next: UserState = {
      ...user,
      applied_codes: [...user.applied_codes, clean],
    };

    if (data.type === "lifetime") {
      next.discount_percentage = 100;
    }

    if (data.type === "discount" && data.value !== undefined) {
      // Allow stacking only up to 100%
      next.discount_percentage = Math.min(100, next.discount_percentage + data.value);
    }
    if ((data.type === "unlock" || data.type === "resource") && data.feature) {
      if (!next.unlocked_features.includes(data.feature)) {
        next.unlocked_features = [...next.unlocked_features, data.feature];
      }
    }
    if (data.type === "boost" && data.value !== undefined) {
      next.xp = next.xp + data.value;
    }

    saveState(next);
    return { success: true, message: `🎉 ${data.description}` };
  };

  // Utility for components to gate content
  const hasFeature = (feature: string) =>
    user.unlocked_features.includes(feature);

  return { user, isLoaded, saveState, applyCode, hasFeature };
}
