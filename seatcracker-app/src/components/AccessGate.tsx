"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./AccessGate.module.css";
import {
  activateTrial,
  type AccessState,
} from "../lib/access";

interface Props {
  userId?: string;
  onAccessGranted: () => void;
  onBack: () => void;
}

const PERKS = [
  "All EAMCET topics — Maths, Physics, Chemistry",
  "Smart Roadmap Generator (AI-powered)",
  "Unlimited Practice Tests with Analysis",
  "Topic-wise Performance Tracking",
  "All AP & TS State Syllabi",
];

export default function AccessGate({ userId, onAccessGranted, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Activate Free Access ───────────────────────────────
  const handleActivate = async () => {
    setLoading(true);
    await activateTrial(userId); // Still uses the same helper to seed the DB record
    setLoading(false);
    setSuccess(true);
    setTimeout(() => onAccessGranted(), 1600);
  };

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
          <div className={styles.emoji}>🚀</div>
          <div className={styles.title}>
            SeatCracker is now 100% FREE
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginTop: "8px" }}>
            Get started instantly with full access to all features.
          </p>
        </div>

        {/* Price Section — Changed to Free */}
        <div className={styles.priceSection}>
          <div className={styles.priceRow}>
            <div className={styles.finalPrice} style={{ color: "#38bdf8" }}>
              FREE
            </div>
          </div>
          <div className={styles.perLabel}>
            {"Educational Access Unlocked · Forever"}
          </div>
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

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.trialBtn}
            onClick={handleActivate}
            disabled={loading}
            style={{ 
              background: "linear-gradient(135deg, #38bdf8, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {loading ? "Activating…" : "🚀 Start Practice Now"}
          </button>

          <button className={styles.backBtn} onClick={onBack}>
            ← Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
