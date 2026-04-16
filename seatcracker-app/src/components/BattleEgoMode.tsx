"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./BattleCinema.module.css";

interface Props {
  onComplete: () => void; // auto-closes after ~4.8s, returns to exam
}

/*
 * BattleEgoMode — comeback animation
 *
 * Triggered when: 3+ consecutive correct answers + time < 15 min
 *
 * Flow:
 *  0.0s — Silence / dark screen
 *  0.5s — Aura rings expand outward
 *  1.0s — Avatar slowly stands up (scale + translate)
 *  1.8s — Eyes glow purple
 *  2.4s — "I will defeat you… Time." text reveals
 *  4.8s — Auto-returns to exam_mode
 */
export default function BattleEgoMode({ onComplete }: Props) {
  // Auto-advance back to exam after cinematic ends
  useEffect(() => {
    const t = setTimeout(onComplete, 4800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className={styles.egoRoot}>
      {/* Dark atmosphere */}
      <div className={styles.egoBg} />

      {/* Expanding aura rings */}
      <div className={styles.auraRing} />
      <div className={styles.auraRing} />
      <div className={styles.auraRing} />

      {/* Avatar standing with aura glow */}
      <motion.div
        className={styles.egoAvatarWrap}
        initial={{ y: 40, scale: 0.85, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.1, ease: "easeOut" }}
      >
        <EgoAvatar />
      </motion.div>

      {/* Text */}
      <div className={styles.egoTextWrap}>
        <motion.h2
          className={styles.egoMainText}
          initial={{ opacity: 0, letterSpacing: "18px", scale: 0.88 }}
          animate={{ opacity: 1, letterSpacing: "3px", scale: 1 }}
          transition={{ delay: 2.2, duration: 0.9, ease: "easeOut" }}
        >
          I will defeat you… Time.
        </motion.h2>

        <motion.p
          className={styles.egoContinueText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.6 }}
        >
          Returning to battle…
        </motion.p>
      </div>
    </div>
  );
}

/* ── Ego Avatar: standing, glowing eyes ─────────────────── */
function EgoAvatar() {
  return (
    <svg viewBox="0 0 90 180" width="90" height="180" overflow="visible" aria-hidden="true">
      {/* Head */}
      <circle cx="45" cy="24" r="18" fill="#d4956a" />
      <ellipse cx="45" cy="10" rx="16" ry="8" fill="#221108" />

      {/* Glowing purple eyes */}
      <circle cx="38" cy="23" r="3" fill="#a855f7" style={{ filter: "drop-shadow(0 0 8px #a855f7)" }} />
      <circle cx="52" cy="23" r="3" fill="#a855f7" style={{ filter: "drop-shadow(0 0 8px #a855f7)" }} />

      {/* Neck */}
      <rect x="39" y="40" width="12" height="8" rx="3" fill="#d4956a" />

      {/* Torso */}
      <rect x="22" y="46" width="46" height="52" rx="8" fill="#1e1b4b" />
      <line x1="45" y1="46" x2="45" y2="98" stroke="rgba(168,85,247,0.3)" strokeWidth="2" />

      {/* Belt */}
      <rect x="22" y="94" width="46" height="7" fill="#4c1d95" />

      {/* Arms — down, slightly out */}
      <rect x="4" y="50" width="20" height="9" rx="4" fill="#1e1b4b" transform="rotate(10,4,50)" />
      <rect x="66" y="50" width="20" height="9" rx="4" fill="#1e1b4b" transform="rotate(-10,86,50)" />
      {/* Hands */}
      <circle cx="6" cy="62" r="7" fill="#d4956a" />
      <circle cx="84" cy="62" r="7" fill="#d4956a" />

      {/* Legs */}
      <rect x="27" y="100" width="14" height="50" rx="7" fill="#1e1b4b" />
      <rect x="49" y="100" width="14" height="50" rx="7" fill="#1e1b4b" />
      {/* Shoes */}
      <ellipse cx="34" cy="152" rx="13" ry="6" fill="#111" />
      <ellipse cx="56" cy="152" rx="13" ry="6" fill="#111" />

      {/* Dark aura glow below feet */}
      <ellipse cx="45" cy="160" rx="30" ry="6" fill="rgba(139,92,246,0.18)" style={{ filter: "blur(4px)" }} />
    </svg>
  );
}
