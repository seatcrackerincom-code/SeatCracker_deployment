// ─── Global Promo Code Config ───────────────────────────────────────────────
// Add or remove codes from GLOBAL_PROMO_CODES to manage the promo system.

export type PromoType = "discount" | "unlock" | "resource" | "boost";

export interface PromoConfig {
  type: PromoType;
  value?: number;       // For discounts (e.g., 10 = 10%) or boosts (XP amount)
  feature?: string;     // For unlock/resource codes
  description: string;  // Human-readable message shown on success
}

export const GLOBAL_PROMO_CODES: Record<string, PromoConfig> = {
  SAVE10: {
    type: "discount",
    value: 10,
    description: "10% discount on Premium upgrade",
  },
  MOCKBOOST: {
    type: "unlock",
    feature: "mock_test_pack",
    description: "Special Mock Test Pack unlocked",
  },
  WEEKEND: {
    type: "resource",
    feature: "weekend_tests",
    description: "Weekend Practice Sets unlocked",
  },
  XP500: {
    type: "boost",
    value: 500,
    description: "500 XP Boost added to your profile",
  },
  CRACKERJACK: {
    type: "unlock",
    feature: "ai_hints",
    description: "AI Hint mode unlocked for all topics",
  },
};

export function validatePromoCode(
  inputCode: string
): { valid: boolean; data?: PromoConfig; error?: string } {
  const clean = inputCode.trim().toUpperCase();
  if (!clean) return { valid: false, error: "Please enter a code." };
  const promo = GLOBAL_PROMO_CODES[clean];
  if (!promo) return { valid: false, error: "Invalid or expired code." };
  return { valid: true, data: promo };
}
