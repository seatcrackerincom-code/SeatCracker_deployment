"use client";

import { useState } from "react";
import styles from "./SelectScreen.module.css";

interface Props {
  currentExam: string;
  onNext: (exam: string) => void;
  onBack: () => void;
}

const EXAMS = [
  {
    id: "AP",
    label: "AP EAPCET",
    desc: "Andhra Pradesh Engineering, Agriculture & Pharmacy Common Entrance Test",
    icon: "🏛️",
  },
  {
    id: "TS",
    label: "TS EAMCET",
    desc: "Telangana State Engineering, Agriculture & Medical Common Entrance Test",
    icon: "🌿",
  },
];

export default function ExamSelect({ currentExam, onNext, onBack }: Props) {
  const [selected, setSelected] = useState(currentExam);

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgOrb} />
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={onBack} id="exam-back-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className={styles.stepIndicator}>
          <span className={styles.stepDot} data-active="true" />
          <span className={styles.stepLine} />
          <span className={styles.stepDot} data-active="true" />
          <span className={styles.stepLine} />
          <span className={styles.stepDot} />
          <span className={styles.stepLine} />
          <span className={styles.stepDot} />
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Select your <span className={styles.accent}>State</span></h1>
          <p className={styles.sub}>Choose either AP or TS EAMCET to continue your preparation</p>
        </div>

        <div className={styles.options}>
          {EXAMS.map((exam) => (
            <button
              key={exam.id}
              id={`exam-option-${exam.id.toLowerCase()}`}
              className={`${styles.optionCard} ${selected === exam.id ? styles.optionSelected : ""}`}
              onClick={() => setSelected(exam.id)}
              aria-pressed={selected === exam.id}
            >
              <span className={styles.optionIcon}>{exam.icon}</span>
              <div className={styles.optionText}>
                <span className={styles.optionLabel}>{exam.label}</span>
                <span className={styles.optionDesc}>{exam.desc}</span>
              </div>
              <span className={styles.optionCheck}>
                {selected === exam.id && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>

        <button
          id="exam-next-btn"
          className={`${styles.nextBtn} ${!selected ? styles.nextDisabled : ""}`}
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
        >
          Next — Select Course
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
