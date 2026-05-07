"use client";

import { useState } from "react";
import SyllabusView from "./SyllabusView";
import PatternView from "./PatternView";
import styles from "./SyllabusPattern.module.css";

export default function SyllabusPatternHub({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<"menu" | "syllabus" | "pattern">("menu");

  if (view === "syllabus") {
    return <SyllabusView onBack={() => setView("menu")} />;
  }

  if (view === "pattern") {
    return <PatternView onBack={() => setView("menu")} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.aurora} />
      
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Hub
        </button>
        <h1 className={styles.title}>JEE Advanced <span className={styles.accent}>Resources</span></h1>
        <p className={styles.subtitle}>Navigate through official syllabus and historical paper patterns.</p>
      </header>

      <div className={styles.hubGrid}>
        <div className={styles.hubCard} onClick={() => setView("syllabus")}>
          <div className={styles.cardIcon}>📚</div>
          <h2 className={styles.cardTitle}>Full Syllabus</h2>
          <p className={styles.cardDesc}>Detailed unit-wise topics for Physics, Chemistry, and Mathematics.</p>
        </div>

        <div className={styles.hubCard} onClick={() => setView("pattern")}>
          <div className={styles.cardIcon}>📊</div>
          <h2 className={styles.cardTitle}>Paper Pattern</h2>
          <p className={styles.cardDesc}>Year-wise question distribution and marking scheme breakdown.</p>
        </div>
      </div>

      <div style={{ marginTop: "auto", padding: "40px 20px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
        SeatCracker © 2026 • Based on Official IIT Roorkee Guidelines
      </div>
    </div>
  );
}
