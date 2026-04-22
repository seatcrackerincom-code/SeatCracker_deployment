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
  productId?: string | null;
}

const TRIAL_DAYS = 3;
const BASE_PRICE = 149;
const getLSKey = (uid?: string) => uid ? `sc_access_${uid}` : "sc_access";

// ─── Local helpers ────────────────────────────────────────
function loadLocal(userId?: string): Partial<AccessState> {
  if (typeof window === "undefined") return {};
  try {
    const key = getLSKey(userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocal(data: Partial<AccessState>, userId?: string) {
  if (typeof window === "undefined") return;
  try {
    const key = getLSKey(userId);
    const existing = loadLocal(userId);
    localStorage.setItem(key, JSON.stringify({ ...existing, ...data }));
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
// --- SEATCRACKER IS NOW 100% FREE FOR ALL USERS ---
export function computeAccessState(raw: Partial<AccessState>): AccessState {
  return {
    status: "premium",
    trialStartDate: raw.trialStartDate ?? null,
    trialEndDate: raw.trialEndDate ?? null,
    daysLeft: 1000, // Effectively infinite
    isPremium: true,
    purchaseDate: raw.purchaseDate ?? new Date().toISOString(),
    discountPercentage: 0,
  };
}

// ─── Public API ───────────────────────────────────────────

/** Get current access state. Pass userId for Supabase sync. */
export async function getAccessState(userId?: string): Promise<AccessState> {
  let raw = loadLocal(userId);

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
        productId: (remote.product_id as string) ?? raw.productId ?? null,
      };
      // Sync back to localStorage
      saveLocal(raw, userId);
    }
  }

  return computeAccessState(raw);
}

/** Synchronous local-only check — use for instant UI decisions. */
export function getAccessStateSync(userId?: string): AccessState {
  const raw = loadLocal(userId);
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
  saveLocal(data, userId);

  if (userId) {
    await saveToSupabase(userId, {
      trial_start_date: data.trialStartDate,
      trial_end_date: data.trialEndDate,
      is_premium: false,
    });
  }

  return computeAccessState({ ...loadLocal(userId), ...data });
}

/** Activate premium (post payment). */
export async function activatePremium(userId?: string): Promise<AccessState> {
  const data: Partial<AccessState> = {
    isPremium: true,
    purchaseDate: new Date().toISOString(),
  };
  saveLocal(data, userId);

  if (userId) {
    await saveToSupabase(userId, {
      is_premium: true,
      purchase_date: data.purchaseDate,
    });
  }

  return computeAccessState({ ...loadLocal(userId), ...data });
}

/** Apply discount from promo code. */
export function applyDiscountLocally(discountPct: number, userId?: string) {
  saveLocal({ discountPercentage: discountPct }, userId);
}

/** Calculate final price after discount. */
export function calcFinalPrice(discountPct: number): number {
  return Math.round(BASE_PRICE - (BASE_PRICE * discountPct) / 100);
}

export const BASE_COURSE_PRICE = BASE_PRICE;
