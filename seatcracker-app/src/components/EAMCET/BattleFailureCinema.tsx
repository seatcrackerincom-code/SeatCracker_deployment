"use client";

import { motion } from "framer-motion";
import { RoboCharacter } from "./BattleCinema";
import styles from "./BattleCinema.module.css";

interface Props {
  onBack: () => void;
}

/*
 * BattleFailureCinema — shown when secs === 0
 *
 * Flow:
 *  1s    — freeze frame (the screen just holds black)
 *  0.8s  — Robo dashes in from right (spring)
 *  0.3s  — red flash overlay
 *  0.7s  — avatar falls left
 *  fade  — "TIME'S UP" text + return button
 */
export default function BattleFailureCinema({ onBack }: Props) {
  return (
    <div className={styles.failRoot}>
      {/* Background red atmospheric glow */}
      <div className={styles.failBg} />

      {/* Red screen flash */}
      <motion.div
        className={styles.failRedFlash}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ delay: 1.2, duration: 0.9, times: [0, 0.2, 1] }}
      />

      {/* ── Robo dashes in ── */}
      <motion.div
        className={styles.failRoboWrap}
        initial={{ x: "60vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.9 }}
        style={{ filter: "drop-shadow(0 0 40px rgba(220,38,38,0.9))" }}
      >
        <RoboCharacter />
      </motion.div>

      {/* ── Avatar falls ── */}
      <motion.div
        className={styles.failAvatarWrap}
        initial={{ rotate: 0, y: 0, opacity: 1 }}
        animate={{ rotate: -85, y: 28, opacity: 0.45 }}
        transition={{ delay: 1.1, duration: 0.7, ease: "easeIn" }}
      >
        {/* Fallen avatar (simplified silhouette) */}
        <svg viewBox="0 0 80 160" width="70" height="140" overflow="visible" aria-hidden="true">
          <circle cx="40" cy="20" r="16" fill="#d4956a" />
          <ellipse cx="40" cy="8" rx="14" ry="7" fill="#221108" />
          <circle cx="34" cy="19" r="2" fill="#1a0a00" />
          <circle cx="46" cy="19" r="2" fill="#1a0a00" />
          <rect x="34" y="34" width="12" height="8" rx="3" fill="#d4956a" />
          <rect x="20" y="40" width="40" height="46" rx="7" fill="#1e40af" />
          <rect x="4" y="46" width="18" height="9" rx="4" fill="#1e40af" />
          <rect x="58" y="46" width="18" height="9" rx="4" fill="#1e40af" />
          <rect x="24" y="86" width="12" height="40" rx="6" fill="#1e1b4b" />
          <rect x="44" y="86" width="12" height="40" rx="6" fill="#1e1b4b" />
          <ellipse cx="30" cy="128" rx="11" ry="6" fill="#111" />
          <ellipse cx="50" cy="128" rx="11" ry="6" fill="#111" />
        </svg>
      </motion.div>

      {/* ── Screen shake wrapper for text ── */}
      <motion.div
        className={styles.failCenter}
        animate={{ x: [0, -6, 6, -4, 4, 0] }}
        transition={{ delay: 1.15, duration: 0.5 }}
      >
        <motion.h1
          className={styles.timeUpText}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.5, type: "spring", stiffness: 180 }}
        >
          TIME&apos;S UP
        </motion.h1>

        <motion.p
          className={styles.failSubText}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.7 }}
        >
          You could not defeat Time.
        </motion.p>

        <motion.button
          className={styles.failReturnBtn}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.6 }}
          onClick={onBack}
        >
          Return to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}
