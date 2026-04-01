// Access Control Logic
// Handles trial activation, premium status, and expiry checks.
// Stores in localStorage (fast, offline) + Supabase (persistent across devices).

import { supabase } from "./supabase";

export type AccessStatus = "premium" | "trial" | "expired" | "none";

export interface AccessState {
  status: AccessStatus;
  trialStartDate: string | null;
  trialEndDate: string | null;
  daysLeft: number;
  isPremium: boolean;
  purchaseDate: string | null;
  discountPercentage: number;
}

const TRIAL_DAYS = 3;
const BASE_PRICE = 199;
const LS_KEY = "sc_access";

// ─── Local helpers ────────────────────────────────────────
function loadLocal(): Partial<AccessState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocal(data: Partial<AccessState>) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadLocal();
    localStorage.setItem(LS_KEY, JSON.stringify({ ...existing, ...data }));
  } catch {}
}

// ─── Supabase helpers (no-op if not configured) ───────────
async function saveToSupabase(userId: string, data: Record<string, unknown>) {
  if (!supabase) return;
  try {
    await supabase
      .from("user_access")
      .upsert({ user_id: userId, ...data }, { onConflict: "user_id" });
  } catch (err) {
    console.error("Supabase access save error:", err);
  }
}

async function loadFromSupabase(userId: string): Promise<Record<string, unknown> | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from("user_access")
      .select("*")
      .eq("user_id", userId)
      .single();
    return data;
  } catch {
    return null;
  }
}

// ─── Core: compute access state ──────────────────────────
export function computeAccessState(raw: Partial<AccessState>): AccessState {
  const now = Date.now();

  if (raw.isPremium) {
    return {
      status: "premium",
      trialStartDate: raw.trialStartDate ?? null,
      trialEndDate: raw.trialEndDate ?? null,
      daysLeft: 0,
      isPremium: true,
      purchaseDate: raw.purchaseDate ?? null,
      discountPercentage: raw.discountPercentage ?? 0,
    };
  }

  if (raw.trialEndDate) {
    const end = new Date(raw.trialEndDate).getTime();
    const msLeft = end - now;
    const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));

    return {
      status: msLeft > 0 ? "trial" : "expired",
      trialStartDate: raw.trialStartDate ?? null,
      trialEndDate: raw.trialEndDate,
      daysLeft,
      isPremium: false,
      purchaseDate: null,
      discountPercentage: raw.discountPercentage ?? 0,
    };
  }

  return {
    status: "none",
    trialStartDate: null,
    trialEndDate: null,
    daysLeft: 0,
    isPremium: false,
    purchaseDate: null,
    discountPercentage: raw.discountPercentage ?? 0,
  };
}

// ─── Public API ───────────────────────────────────────────

/** Get current access state. Pass userId for Supabase sync. */
export async function getAccessState(userId?: string): Promise<AccessState> {
  let raw = loadLocal();

  // Merge Supabase data if available
  if (userId && supabase) {
    const remote = await loadFromSupabase(userId);
    if (remote) {
      raw = {
        ...raw,
        isPremium: (remote.is_premium as boolean) ?? raw.isPremium,
        trialEndDate: (remote.trial_end_date as string) ?? raw.trialEndDate,
        trialStartDate: (remote.trial_start_date as string) ?? raw.trialStartDate,
        purchaseDate: (remote.purchase_date as string) ?? raw.purchaseDate,
        discountPercentage: (remote.discount_percentage as number) ?? raw.discountPercentage ?? 0,
      };
      // Sync back to localStorage
      saveLocal(raw);
    }
  }

  return computeAccessState(raw);
}

/** Synchronous local-only check — use for instant UI decisions. */
export function getAccessStateSync(): AccessState {
  const raw = loadLocal();
  return computeAccessState(raw);
}

/** Activate a 3-day free trial for this user. */
export async function activateTrial(userId?: string): Promise<AccessState> {
  const now = new Date();
  const end = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  const data: Partial<AccessState> = {
    trialStartDate: now.toISOString(),
    trialEndDate: end.toISOString(),
    isPremium: false,
  };
  saveLocal(data);

  if (userId) {
    await saveToSupabase(userId, {
      trial_start_date: data.trialStartDate,
      trial_end_date: data.trialEndDate,
      is_premium: false,
    });
  }

  return computeAccessState({ ...loadLocal(), ...data });
}

/** Activate premium (post payment). */
export async function activatePremium(userId?: string): Promise<AccessState> {
  const data: Partial<AccessState> = {
    isPremium: true,
    purchaseDate: new Date().toISOString(),
  };
  saveLocal(data);

  if (userId) {
    await saveToSupabase(userId, {
      is_premium: true,
      purchase_date: data.purchaseDate,
    });
  }

  return computeAccessState({ ...loadLocal(), ...data });
}

/** Apply discount from promo code. */
export function applyDiscountLocally(discountPct: number) {
  saveLocal({ discountPercentage: discountPct });
}

/** Calculate final price after discount. */
export function calcFinalPrice(discountPct: number): number {
  return Math.round(BASE_PRICE - (BASE_PRICE * discountPct) / 100);
}

export const BASE_COURSE_PRICE = BASE_PRICE;
