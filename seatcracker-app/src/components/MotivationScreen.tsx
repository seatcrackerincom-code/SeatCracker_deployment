"use client";

import { useState, useEffect } from "react";
import styles from "./MotivationScreen.module.css";

interface Props {
  onNext: () => void;
}

export default function MotivationScreen({ onNext }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`${styles.wrapper} ${visible ? styles.visible : ""}`}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          EAMCET / EAPCET Prep
        </div>

        <h1 className={styles.headline}>
          Your seat is<br />
          <span className={styles.accent}>waiting.</span>
        </h1>

        <p className={styles.sub}>
          Start now — every chapter counts.
        </p>

        <button
          id="motivation-next-btn"
          className={styles.btn}
          onClick={onNext}
          aria-label="Get started"
        >
          <span>Get Started</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        <p className={styles.hint}>Select your exam and course in 30 seconds.</p>
      </div>
    </div>
  );
}
