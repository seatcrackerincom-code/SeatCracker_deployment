"use client";

import { useState } from "react";
import styles from "../SelectScreen.module.css";

interface Props {
  currentCourse: string;
  onNext: (course: string) => void;
  onBack: () => void;
}

const COURSES = [
  {
    id: "Engineering",
    label: "Engineering",
    desc: "Physics · Chemistry · Mathematics",
    icon: "⚙️",
  },
  {
    id: "Agriculture",
    label: "Agriculture",
    desc: "Physics · Chemistry · Botany · Zoology",
    icon: "🌾",
  },
  {
    id: "Pharmacy",
    label: "Pharmacy",
    desc: "Physics · Chemistry · Botany · Zoology",
    icon: "💊",
  },
];

export default function CourseSelect({ currentCourse, onNext, onBack }: Props) {
  const [selected, setSelected] = useState(currentCourse);

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgOrb} />
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={onBack} id="course-back-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className={styles.stepIndicator}>
          <span className={styles.stepDot} data-done="true" />
          <span className={styles.stepLine} data-done="true" />
          <span className={styles.stepDot} data-active="true" />
          <span className={styles.stepLine} />
          <span className={styles.stepDot} />
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Choose your <span className={styles.accent}>Course</span></h1>
          <p className={styles.sub}>Select the stream you are applying for</p>
        </div>

        <div className={styles.options}>
          {COURSES.map((course) => (
            <button
              key={course.id}
              id={`course-option-${course.id.toLowerCase()}`}
              className={`${styles.optionCard} ${selected === course.id ? styles.optionSelected : ""}`}
              onClick={() => setSelected(course.id)}
              aria-pressed={selected === course.id}
            >
              <span className={styles.optionIcon}>{course.icon}</span>
              <div className={styles.optionText}>
                <span className={styles.optionLabel}>{course.label}</span>
                <span className={styles.optionDesc}>{course.desc}</span>
              </div>
              <span className={styles.optionCheck}>
                {selected === course.id && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>

        <button
          id="course-next-btn"
          className={`${styles.nextBtn} ${!selected ? styles.nextDisabled : ""}`}
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
        >
          View Syllabus
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
