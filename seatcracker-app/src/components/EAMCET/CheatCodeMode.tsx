"use client";

import React, { useState } from "react";
import styles from "./CheatCodeMode.module.css";

interface Props {
  userId: string;
  exam: string;
  course: string;
  onBack: () => void;
}

export default function CheatCodeMode({ userId, exam, course, onBack }: Props) {
  // Features hidden until April 28


  return (
    <div className={styles.wrapper}>
      <div className={styles.ambientGlow} />
      
      <div className={styles.container}>
        {/* Back Button */}
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Modes
        </button>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Last Days Preparation</h1>
          <p className={styles.subtitle} style={{ marginTop: '16px', fontSize: 'clamp(18px, 5vw, 24px)', color: '#22d3ee', textTransform: 'none' }}>
            Coming out on 28 April at 5:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}
