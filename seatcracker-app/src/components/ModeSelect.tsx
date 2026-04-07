"use client";

import styles from "./SelectScreen.module.css";

interface Props {
  onNext: (mode: "practice" | "roadmap" | "battle") => void;
  onBack: () => void;
}

export default function ModeSelect({ onNext, onBack }: Props) {
  const isBattleAvailable = true; // always available
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgOrb} />
      <div className={styles.container}>
        {/* Back Button */}


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
            <span className={styles.optionIcon}>📚</span>
            <div className={styles.optionText}>
              <span className={styles.optionLabel}>Today&apos;s Practice</span>
              <span className={styles.optionDesc}>Reinforce what you learned today in college or at your institute — pick a topic, review key concepts, and test yourself with real exam questions.</span>
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

          {/* ── Real Battle Mode ── */}
          <button
            id="mode-battle"
            className={styles.optionCard}
            onClick={() => onNext("battle")}
            style={{
              borderColor: "rgba(239,68,68,0.35)",
              background: "linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(185,28,28,0.04) 100%)"
            }}
          >
            <span className={styles.optionIcon}>⚔️</span>
            <div className={styles.optionText}>
              <span className={styles.optionLabel} style={{ color: "#f87171" }}>
                Real Battle Mode &nbsp;<span style={{ fontSize: "0.65rem", background: "rgba(239,68,68,0.2)", color: "#fca5a5", padding: "1px 7px", borderRadius: "999px", fontWeight: 700, letterSpacing: "0.08em", verticalAlign: "middle" }}>NEW</span>
              </span>
              <span className={styles.optionDesc}>
                Full EAMCET simulation — 160 questions, 3 hours. 10 curated Hard &amp; Medium mocks. 2-hour cooldown between mocks to rest and revise. (Launching soon)
              </span>
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
