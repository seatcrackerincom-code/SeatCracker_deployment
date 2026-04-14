"use client";

import { useState, useEffect, useCallback } from "react";
import { validatePromoCode } from "../lib/promoCodes";
import { getAccessStateSync } from "./access";
import { onAuthChange } from "./firebase";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface UserState {
  uid?: string; // Firebase Auth ID
  name: string;
  targetRank: number;
  progressPercent: number;
  xp: number;
  applied_codes: string[];
  unlocked_features: string[];
  discount_percentage: number;
  avgAccuracy: number;
  avgPace: number;
  policies_accepted: boolean;
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
  policies_accepted: false,
};

const getLSKey = (uid?: string) => uid ? `sc_user_state_${uid}` : "sc_user_state";

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useUserState() {
  const [user, setUser] = useState<UserState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUid, setCurrentUid] = useState<string | undefined>();

  // 1. Sync with Firebase Auth
  useEffect(() => {
    const unsub = onAuthChange((firebaseUser) => {
      const uid = firebaseUser?.uid || undefined;
      setCurrentUid(uid);
      setUser((prev) => ({
        ...prev,
        uid: uid,
      }));
    });
    return () => unsub();
  }, []);

  // 2. Load from localStorage whenever UID changes
  useEffect(() => {
    const key = getLSKey(currentUid);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<UserState>;
        setUser((prev) => ({ ...prev, ...parsed, uid: currentUid }));
      } else {
        // No saved state for this user — reset to default
        setUser({ ...DEFAULT_STATE, uid: currentUid });
      }
    } catch {
      setUser({ ...DEFAULT_STATE, uid: currentUid });
    }
    setIsLoaded(true);
  }, [currentUid]);

  // Persist any state change
  const saveState = useCallback((updated: UserState) => {
    setUser(updated);
    if (typeof window === "undefined") return;
    try {
      const key = getLSKey(currentUid);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // Storage full — ignore
    }
  }, [currentUid]);

  // Set policy acceptance
  const setPoliciesAccepted = useCallback((accepted: boolean) => {
    const next = { ...user, policies_accepted: accepted };
    saveState(next);
  }, [user, saveState]);

  // Apply a promo code and return a result message
  // allowPremium = true enables code entry even after purchase (for bonus/XP codes)
  const applyCode = (input: string, allowPremium = false): { success: boolean; message: string } => {
    const access = getAccessStateSync();
    if (access.isPremium && !allowPremium) {
      return { success: false, message: "Already Purchase Done! No need of offer codes." };
    }

    const clean = input.trim().toUpperCase();

    // Duplicate check
    if (user.applied_codes.includes(clean)) {
      return { success: false, message: "Already used!" };
    }

    const { valid, data, error } = validatePromoCode(clean);
    if (!valid || !data) {
      return { success: false, message: error ?? "Invalid code." };
    }

    let nextCodes = [...user.applied_codes];
    let nextDiscount = user.discount_percentage;
    let message = `🎉 ${data.description}`;

    // Offer enforcement: Only 1 discount/lifetime code allowed at a time.
    if (data.type === "discount" || data.type === "lifetime") {
      const hasExistingOffer = nextCodes.some(c => {
         const p = validatePromoCode(c).data;
         return p?.type === "discount" || p?.type === "lifetime";
      });

      if (hasExistingOffer) {
         // Auto-replace existing offer
         nextCodes = nextCodes.filter(c => {
             const p = validatePromoCode(c).data;
             return !(p?.type === "discount" || p?.type === "lifetime");
         });
         nextDiscount = 0; // Reset so the new one applies cleanly
         message = `Swapped! ${data.description}`;
      }
    }

    nextCodes.push(clean);

    const next: UserState = {
      ...user,
      applied_codes: nextCodes,
      discount_percentage: nextDiscount,
    };

    if (data.type === "lifetime") {
      next.discount_percentage = 100;
    }

    if (data.type === "discount" && data.value !== undefined) {
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
    return { success: true, message };
  };

  // Utility for components to gate content
  const hasFeature = (feature: string) =>
    user.unlocked_features.includes(feature);

  return { user, isLoaded, saveState, applyCode, hasFeature, setPoliciesAccepted };
}
