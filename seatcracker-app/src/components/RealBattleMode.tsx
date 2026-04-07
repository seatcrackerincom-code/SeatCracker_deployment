"use client";

import { useState, useEffect } from "react";
import styles from "./RealBattleMode.module.css";
import { trackExamStarted } from "../lib/analytics";

interface Props {
  userId: string;
  exam: string;
  course: string;
  onBack: () => void;
}

export default function RealBattleMode({ userId, exam, course, onBack }: Props) {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    trackExamStarted("real_battle", course); // Firebase: exam_started

    const targetDate = new Date("2026-04-11T10:00:00+05:30").getTime();

    const updateTimer = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [course]);

  return (
    <div className={styles.comingSoonWrap}>
      <div className={styles.comingSoonCard}>

        <button 
          className={styles.backBtn} 
          onClick={onBack}
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "100px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 10
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className={styles.comingSoonTitle}>
          Real Battle <br />
          <span style={{ color: "var(--accent)" }}>Mode</span>
        </h1>
        <p className={styles.comingSoonSub}>
          The ultimate 160-question EAMCET simulation is undergoing final calibration. 
          <strong>Launching soon on April 11th!</strong>
        </p>
        
        <div className={styles.comingSoonTimer}>
          {timeLeft ? (
            <>
              <div className={styles.timeUnit}>
                <span className={styles.timeVal}>{String(timeLeft.days).padStart(2, '0')}</span>
                <span className={styles.timeLbl}>DAYS</span>
              </div>
              <div className={styles.timeDivider}>:</div>
              <div className={styles.timeUnit}>
                <span className={styles.timeVal}>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className={styles.timeLbl}>HRS</span>
              </div>
              <div className={styles.timeDivider}>:</div>
              <div className={styles.timeUnit}>
                <span className={styles.timeVal}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className={styles.timeLbl}>MIN</span>
              </div>
              <div className={styles.timeDivider}>:</div>
              <div className={styles.timeUnit}>
                <span className={styles.timeVal}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className={styles.timeLbl}>SEC</span>
              </div>
            </>
          ) : (
             <div className={styles.timeUnit}>
                <span className={styles.timeVal}>--</span>
                <span className={styles.timeLbl}>--</span>
             </div>
          )}
        </div>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
