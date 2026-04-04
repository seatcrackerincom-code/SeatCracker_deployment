"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./AccessGate.module.css";
import {
  activateTrial,
  activatePremium,
  calcFinalPrice,
  BASE_COURSE_PRICE,
  type AccessState,
} from "../lib/access";
import { validatePromoCode } from "../lib/promoCodes";
import { applyDiscountLocally } from "../lib/access";

interface Props {
  userId?: string;
  isExpired: boolean;           // true = trial over, show upgrade; false = first time
  onAccessGranted: () => void;  // called when trial or payment succeeds
  onBack: () => void;
}

const PERKS = [
  "All EAMCET topics — Maths, Physics, Chemistry",
  "Smart Roadmap Generator (AI-powered)",
  "Unlimited Practice Tests with Analysis",
  "Topic-wise Performance Tracking",
  "All AP & TS State Syllabi",
];

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

export default function AccessGate({ userId, isExpired, onAccessGranted, onBack }: Props) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoFeedback, setPromoFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const finalPrice = calcFinalPrice(discount);

  // ── Promo Code ─────────────────────────────────────────
  const handlePromo = async () => {
    const { valid, data, error } = validatePromoCode(promoCode);
    if (!valid || !data) {
      setPromoFeedback({ msg: error ?? "Invalid code.", ok: false });
      return;
    }
    if (data.type === "discount" && data.value) {
      setDiscount(data.value);
      applyDiscountLocally(data.value);
      setPromoFeedback({ msg: `${data.value}% discount applied! 🎉`, ok: true });
    } else if (data.type === "lifetime") {
      setPromoFeedback({ msg: "LIFETIME ACTIVATION IN PROGRESS...", ok: true });
      await activatePremium(userId);
      setSuccess(true);
      setTimeout(() => onAccessGranted(), 2000);
    } else {
      setPromoFeedback({ msg: "This code doesn't give a price discount.", ok: false });
    }
    setTimeout(() => setPromoFeedback(null), 5000);
  };

  // ── Trial ───────────────────────────────────────────────
  const handleTrial = async () => {
    setTrialLoading(true);
    await activateTrial(userId);
    setTrialLoading(false);
    setSuccess(true);
    setTimeout(() => onAccessGranted(), 1600);
  };

  // ── Razorpay Payment ────────────────────────────────────
  const handlePayment = async () => {
    setPayLoading(true);
    try {
      // 1. Create order on server
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalPrice, userId }),
      });
      const { orderId, key } = await res.json();

      // 2. Open Razorpay modal
      const rzp = new window.Razorpay({
        key,
        amount: finalPrice * 100,
        currency: "INR",
        name: "SeatCracker",
        description: "EAMCET Full Access",
        order_id: orderId,
        handler: async (response: Record<string, string>) => {
          // 3. Verify on server
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, userId }),
          });
          const verify = await verifyRes.json();
          if (verify.success) {
            await activatePremium(userId);
            setSuccess(true);
            setTimeout(() => onAccessGranted(), 1600);
          }
        },
        prefill: { name: "SeatCracker User" },
        theme: { color: "#6366f1" },
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment setup failed. Please try again.");
    }
    setPayLoading(false);
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <div className={styles.screen}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        {/* Success Overlay */}
        {success && (
          <div className={styles.successOverlay}>
            <div className={styles.successEmoji}>🎉</div>
            <div className={styles.successTitle}>Access Granted!</div>
            <div className={styles.successSub}>Redirecting you to your course…</div>
          </div>
        )}

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.emoji}>{isExpired ? "⏰" : "🚀"}</div>
          <div className={styles.title}>
            {isExpired ? "Trial Ended" : "Unlock EAMCET Access"}
          </div>
          <div className={styles.subtitle}>
            {isExpired
              ? "Your 3-day free trial has expired. Upgrade to continue."
              : "Start free — upgrade anytime"}
          </div>
        </div>

        {/* Expired banner */}
        {isExpired && (
          <div className={styles.expiredBanner}>
            <span>🔒</span>
            <div className={styles.expiredText}>
              Your trial has ended. Purchase full access to continue preparing.
            </div>
          </div>
        )}

        {/* Price */}
        <div className={styles.priceSection}>
          <div className={styles.priceRow}>
            {discount > 0 && (
              <div className={styles.originalPrice}>₹{BASE_COURSE_PRICE}</div>
            )}
            <div className={styles.finalPrice}>
              <span className={styles.rupee}>₹</span>
              {finalPrice}
            </div>
          </div>
          <div className={styles.perLabel}>One-time payment · Lifetime access</div>
          {discount > 0 && (
            <div className={styles.discountBadge}>
              ✅ {discount}% promo discount applied — Save ₹{BASE_COURSE_PRICE - finalPrice}
            </div>
          )}
        </div>

        {/* Perks */}
        <div className={styles.perks}>
          {PERKS.map((p) => (
            <div key={p} className={styles.perkItem}>
              <span className={styles.perkCheck}>✓</span>
              <span>{p}</span>
            </div>
          ))}
        </div>

        {/* Promo code */}
        <div className={styles.promoSection}>
          <div className={styles.promoLabel}>🎁 Have a promo code?</div>
          <div className={styles.promoRow}>
            <input
              className={styles.promoInput}
              type="text"
              placeholder="e.g. SAVE10"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handlePromo()}
            />
            <button className={styles.promoApply} onClick={handlePromo}>
              Apply
            </button>
          </div>
          {promoFeedback && (
            <div className={`${styles.promoFeedback} ${promoFeedback.ok ? styles.ok : styles.err}`}>
              {promoFeedback.msg}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {!isExpired && (
            <button
              className={styles.trialBtn}
              onClick={handleTrial}
              disabled={trialLoading}
            >
              {trialLoading ? "Activating…" : "🔥 Start 3-Day Free Trial"}
            </button>
          )}

          <button
            className={styles.payBtn}
            onClick={handlePayment}
            disabled={payLoading}
          >
            {payLoading
              ? "Setting up payment…"
              : `🔓 Unlock Full Access — ₹${finalPrice}`}
          </button>

          <button className={styles.backBtn} onClick={onBack}>
            ← Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
