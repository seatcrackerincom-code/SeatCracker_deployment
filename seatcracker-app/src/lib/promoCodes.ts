// ─── Global Promo Code Config ───────────────────────────────────────────────
// Add or remove codes from GLOBAL_PROMO_CODES to manage the promo system.

export type PromoType = "discount" | "unlock" | "resource" | "boost" | "lifetime";

export interface PromoConfig {
  type: PromoType;
  value?: number;       // For discounts (e.g., 10 = 10%) or boosts (XP amount)
  feature?: string;     // For unlock/resource codes
  description: string;  // Human-readable message shown on success
}

export const GLOBAL_PROMO_CODES: Record<string, PromoConfig> = {
  CRACKER_CODE_STYLE_WITH_SHABIHA: {
    type: "discount",
    value: 12,
    description: "12% Exclusive Discount Applied!",
  },
  SC_ULTIMATE_LIFETIME_ACCESS_CRACKER_MODE_SECURE_2026: {
    type: "lifetime",
    description: "LIFETIME ACCESS ACTIVATED. Welcome, Creator.",
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
