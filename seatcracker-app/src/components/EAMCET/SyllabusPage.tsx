"use client";

import { useState, useEffect } from "react";
import styles from "./SyllabusPage.module.css";
import { trackTopicOpened } from "../../lib/analytics";

interface Chapter {
  chapter: string;
  ap?: string | number;
  ts?: string | number;
  ap_questions?: string | number;
  questions?: string | number;
  priority?: string;
  subtopics?: string[];
}

interface SubjectData {
  subject: string;
  chapters: Chapter[];
}

interface Props {
  userId: string;
  exam: string;
  course: string;
  onBack: () => void;
  onRestart: () => void;
  onStartPractice?: () => void;
}

const SUBJECT_MAP: Record<string, string[]> = {
  Engineering: ["Mathematics", "Physics", "Chemistry"],
  Agriculture: ["Botany", "Zoology", "Physics", "Chemistry"],
  Pharmacy: ["Botany", "Zoology", "Physics", "Chemistry"],
};

const PRIORITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

function priorityColor(p?: string) {
  if (p === "High") return "var(--high)";
  if (p === "Medium") return "var(--medium)";
  return "var(--low)";
}

function priorityBg(p?: string) {
  if (p === "High") return "rgba(248,113,113,0.12)";
  if (p === "Medium") return "rgba(251,191,36,0.12)";
  return "rgba(110,231,183,0.12)";
}

export default function SyllabusPage({ userId, exam, course, onBack, onRestart, onStartPractice }: Props) {
  const [data, setData] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSubject, setActiveSubject] = useState<string>("");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const subjects = SUBJECT_MAP[course] || [];
  const examLabel = exam === "AP" ? "AP EAPCET" : "TS EAMCET";

  useEffect(() => {
    if (!exam || !course || subjects.length === 0) return;

    setLoading(true);
    setError("");

    Promise.all(
      subjects.map(async (subject) => {
        const url = `/EAMCET/SYLLABUS/${exam}/${course}/${subject}/${subject}.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load ${subject}`);
        const json = await res.json();
        const chapters: Chapter[] = Array.isArray(json) ? json : json.chapters;
        return { subject, chapters };
      })
    )
      .then((results) => {
        setData(results);
        setActiveSubject(results[0]?.subject || "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load syllabus");
        setLoading(false);
      });
  }, [exam, course]);

  const toggleChapter = (key: string, chapterName: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        trackTopicOpened(activeSubject, chapterName);
      }
      return next;
    });
  };

  const activeData = data.find((d) => d.subject === activeSubject);
  const sortedChapters = activeData
    ? [...activeData.chapters].sort(
        (a, b) => (PRIORITY_ORDER[a.priority || "Low"] ?? 2) - (PRIORITY_ORDER[b.priority || "Low"] ?? 2)
      )
    : [];

  const getCount = (ch: Chapter) => {
    const val = ch.ap_questions ?? (exam === "AP" ? ch.ap : ch.ts ?? ch.ap);
    return val != null ? String(val) : "—";
  };

  const totalHigh = sortedChapters.filter((c) => c.priority === "High").length;

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading syllabus…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <span className={styles.errorIcon}>⚠️</span>
        <p className={styles.errorText}>{error}</p>
        <button className={styles.backBtn} onClick={onBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backBtn} onClick={onBack} id="syllabus-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          {onStartPractice && (
            <button 
              className={`${styles.restartBtn} ${styles.pulseHighlight}`} 
              onClick={onStartPractice} 
              id="syllabus-practice-btn" 
              style={{ 
                background: "linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)", 
                color: "#fff", 
                border: "none", 
                fontWeight: 800,
                padding: "12px 28px",
                fontSize: "16px",
                boxShadow: "0 0 25px rgba(108, 99, 255, 0.5)",
                borderRadius: "100px"
              }}
            >
              🎯 Start Practising
            </button>
          )}
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.examBadge}>{examLabel}</div>
          <h1 className={styles.courseTitle}>{course}</h1>
          <p className={styles.statsLine}>
            <span className={styles.statChip}>{subjects.length} subjects</span>
            <span className={styles.statChip} data-priority="high">{totalHigh} high-priority chapters</span>
          </p>
        </div>
      </header>

      {/* Subject tabs */}
      <div className={styles.tabsWrapper}>
        <div className={styles.tabs}>
          {subjects.map((sub) => (
            <button
              key={sub}
              id={`tab-${sub.toLowerCase()}`}
              className={`${styles.tab} ${activeSubject === sub ? styles.tabActive : ""}`}
              onClick={() => setActiveSubject(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter list */}
      <div className={styles.chapterList}>
        {sortedChapters.map((ch, idx) => {
          const key = `${activeSubject}-${idx}`;
          const isExpanded = expandedChapters.has(key);
          const hasSubtopics = ch.subtopics && ch.subtopics.length > 0;
          const qCount = getCount(ch);

          return (
            <div
              key={key}
              className={`${styles.chapterCard} ${isExpanded ? styles.chapterExpanded : ""}`}
              style={{ borderLeftColor: priorityColor(ch.priority) }}
              id={`chapter-${idx}`}
            >
              <button
                className={styles.chapterHeader}
                onClick={() => hasSubtopics && toggleChapter(key, ch.chapter)}
                style={{ cursor: hasSubtopics ? "pointer" : "default" }}
                aria-expanded={isExpanded}
              >
                <div className={styles.chapterMeta}>
                  <span
                    className={styles.priorityTag}
                    style={{ color: priorityColor(ch.priority), background: priorityBg(ch.priority) }}
                  >
                    {ch.priority || "Low"}
                  </span>
                  <span className={styles.chapterName}>{ch.chapter}</span>
                </div>

                <div className={styles.chapterRight}>
                  {qCount !== "—" && (
                    <span className={styles.qCount} title="Questions">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      {qCount} Q
                    </span>
                  )}
                  {hasSubtopics && (
                    <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  )}
                </div>
              </button>

              {isExpanded && hasSubtopics && (
                <ul className={styles.subtopicList}>
                  {ch.subtopics!.map((topic, ti) => (
                    <li key={ti} className={styles.subtopic}>
                      <span className={styles.subtopicDot} />
                      {topic}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>SeatCracker · {examLabel} · {course}</p>
      </footer>
    </div>
  );
}
