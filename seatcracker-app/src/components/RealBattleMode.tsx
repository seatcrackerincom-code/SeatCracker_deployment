"use client";

import { useState, useEffect } from "react";
import styles from "./RealBattleMode.module.css";

interface Props {
  userId: string;
  exam: string;
  course: string;
  onBack: () => void;
}

export default function RealBattleMode({ userId, exam, course, onBack }: Props) {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className={styles.comingSoonWrap}>
      <div className={styles.comingSoonCard}>
        <div className={styles.comingSoonBadge}>
          Premium Feature
        </div>
        <button
          onClick={onBack}
          title="Go Home"
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1.2rem",
            zIndex: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: 0
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          🏠
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
