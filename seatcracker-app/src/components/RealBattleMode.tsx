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
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Target Date: April 17, 2026, 10:00 AM
  const targetDate = new Date("April 17, 2026 10:00:00").getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={styles.battleWrapper}>
      <div className={styles.countdownHeader}>
        <h1 className={styles.countdownTitle}>Real Battle Mode</h1>
        <p className={styles.countdownTitleSub}>
          The ultimate {course} {exam} simulation platform is launching soon.
        </p>
      </div>

      <div className={styles.countdownGrid}>
        <div className={styles.timeBox}>
          <span className={styles.timeValue}>{timeLeft.days}</span>
          <span className={styles.timeLabel}>Days</span>
        </div>
        <div className={styles.timeBox}>
          <span className={styles.timeValue}>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className={styles.timeLabel}>Hours</span>
        </div>
        <div className={styles.timeBox}>
          <span className={styles.timeValue}>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className={styles.timeLabel}>Mins</span>
        </div>
        <div className={styles.timeBox}>
          <span className={styles.timeValue}>{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className={styles.timeLabel}>Secs</span>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto 40px', color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
        Real Battle Mode will feature industrial-grade simulations of the actual EAMCET exam interface, 
        with verified PYQs and real-time performance analytics. Get ready to experience the official atmosphere.
      </div>

      <button className={styles.backBtn} onClick={onBack}>
        ← Back to Practice
      </button>
    </div>
  );
}
