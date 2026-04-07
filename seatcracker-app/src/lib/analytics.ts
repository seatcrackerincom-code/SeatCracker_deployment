// Firebase Analytics — client-side event tracker
// All events fire only in the browser; SSR-safe.

import { getAnalytics, logEvent, type Analytics } from "firebase/analytics";
import { initAnalytics } from "./firebase";

let _analytics: Analytics | null = null;

async function getAna(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (_analytics) return _analytics;
  _analytics = await initAnalytics();
  return _analytics;
}

// ─── Core logger ──────────────────────────────────────────
async function track(event: string, params?: Record<string, unknown>) {
  try {
    const ana = await getAna();
    if (!ana) return;
    logEvent(ana, event, params as Record<string, string | number | boolean>);
  } catch (err) {
    // Analytics must never crash the app
    console.warn("[analytics] logEvent failed:", err);
  }
}

// ─── Events ───────────────────────────────────────────────

/** Fired once when the app is loaded / mounted. */
export const trackAppOpen = () => track("app_open");

/** Fired after a successful Firebase auth sign-in. */
export const trackLogin = (method: "google" | "email" = "google") =>
  track("login", { method });

/** Fired when a topic card / subject is opened. */
export const trackTopicOpened = (subject: string, topic: string) =>
  track("topic_opened", { subject, topic });

/** Fired when a practice exam session starts. */
export const trackExamStarted = (mode: string, course: string) =>
  track("exam_started", { mode, course });

/** Fired when an exam session ends / is submitted. */
export const trackExamCompleted = (
  mode: string,
  score: number,
  total: number
) => track("exam_completed", { mode, score, total });

/** Fired when the user clicks any "Upgrade / Get Full Access" CTA. */
export const trackUpgradeClicked = (source: string) =>
  track("upgrade_clicked", { source });

/** Fired after a verified payment — authoritative purchase event. */
export const trackPremiumPurchase = (amountINR: number = 199) =>
  track("premium_purchase", {
    value: amountINR,
    currency: "INR",
  });

/** Fired when a promo code is applied. */
export const trackPromoApplied = (code: string, discount: number) =>
  track("promo_applied", { code, discount });
