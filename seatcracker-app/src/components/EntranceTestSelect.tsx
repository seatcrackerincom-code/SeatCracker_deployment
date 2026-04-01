"use client";

import { useState } from "react";
import styles from "./SelectScreen.module.css";

interface Props {
  currentTest: string;
  onNext: (test: string) => void;
  onBack: () => void;
}

const TESTS = [
  {
    id: "EAMCET",
    label: "EAMCET",
    desc: "Engineering, Agriculture & Medical Common Entrance Test (AP & TS)",
    icon: "🎓",
    active: true,
  },
  {
    id: "GATE",
    label: "GATE",
    desc: "Graduate Aptitude Test in Engineering (Coming Soon)",
    icon: "🔬",
    active: false,
  },
  {
    id: "JEE",
    label: "JEE",
    desc: "Joint Entrance Examination (Coming Soon)",
    icon: "📐",
    active: false,
  },
];

export default function EntranceTestSelect({ currentTest, onNext, onBack }: Props) {
  const [selected, setSelected] = useState(currentTest || "EAMCET");

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgOrb} />
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={onBack} id="test-back-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className={styles.stepIndicator}>
          <span className={styles.stepDot} data-active="true" />
          <span className={styles.stepLine} />
          <span className={styles.stepDot} />
          <span className={styles.stepLine} />
          <span className={styles.stepDot} />
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Choose your <span className={styles.accent}>Entrance Test</span></h1>
          <p className={styles.sub}>Select the test you are preparing for to start your journey</p>
        </div>

        <div className={styles.options}>
          {TESTS.map((test) => (
            <button
              key={test.id}
              id={`test-option-${test.id.toLowerCase()}`}
              className={`${styles.optionCard} ${selected === test.id ? styles.optionSelected : ""} ${!test.active ? styles.optionDisabled : ""}`}
              onClick={() => test.active && setSelected(test.id)}
              aria-pressed={selected === test.id}
              disabled={!test.active}
            >
              <span className={styles.optionIcon}>{test.icon}</span>
              <div className={styles.optionText}>
                <span className={styles.optionLabel}>{test.label}</span>
                <span className={styles.optionDesc}>{test.desc}</span>
              </div>
              <span className={styles.optionCheck}>
                {selected === test.id && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {!test.active && <span style={{ fontSize: "10px", opacity: 0.5 }}>Soon</span>}
              </span>
            </button>
          ))}
        </div>

        <button
          id="test-next-btn"
          className={`${styles.nextBtn} ${!selected ? styles.nextDisabled : ""}`}
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
        >
          Next — Select State
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
