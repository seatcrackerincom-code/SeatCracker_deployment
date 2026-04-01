"use client";

import styles from "./SelectScreen.module.css";

interface Props {
  onNext: (mode: "practice" | "roadmap") => void;
  onBack: () => void;
}

export default function ModeSelect({ onNext, onBack }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgOrb} />
      <div className={styles.container}>
        {/* Back Button */}
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          <span className={styles.stepDot} data-done="true" />
          <span className={styles.stepLine} data-done="true" />
          <span className={styles.stepDot} data-done="true" />
          <span className={styles.stepLine} data-done="true" />
          <span className={styles.stepDot} data-active="true" />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Choose your <span className={styles.accent}>Path</span></h1>
          <p className={styles.sub}>How would you like to prepare for the exam?</p>
        </div>

        {/* Options */}
        <div className={styles.options}>
          <button
            id="mode-practice"
            className={styles.optionCard}
            onClick={() => onNext("practice")}
          >
            <span className={styles.optionIcon}>🎯</span>
            <div className={styles.optionText}>
              <span className={styles.optionLabel}>Free Practice Mode</span>
              <span className={styles.optionDesc}>Browse syllabus topics, review formulas, and take real topic-based exam tests with dual timer & palette.</span>
            </div>
            <div className={styles.optionCheck}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>

          <button
            id="mode-roadmap"
            className={styles.optionCard}
            onClick={() => onNext("roadmap")}
          >
            <span className={styles.optionIcon}>🗺️</span>
            <div className={styles.optionText}>
              <span className={styles.optionLabel}>Roadmap Mode (AI / Manual)</span>
              <span className={styles.optionDesc}>Get a structured day-by-day study plan. Each topic includes a full exam test with real questions.</span>
            </div>
            <div className={styles.optionCheck}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
