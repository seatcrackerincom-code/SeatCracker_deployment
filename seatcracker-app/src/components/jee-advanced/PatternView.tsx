"use client";

import { useState } from "react";
import styles from "./SyllabusPattern.module.css";

const YEAR_HISTORY = [
  { year: "2025", iit: "IIT Kanpur", qp: 48, qs: 16, marks: 360, mode: "Online", obs: "Lowest question count in recent years." },
  { year: "2024", iit: "IIT Madras", qp: 51, qs: 17, marks: 360, mode: "Online", obs: "Stable 51 question pattern." },
  { year: "2023", iit: "IIT Guwahati", qp: 51, qs: 17, marks: 360, mode: "Online", obs: "Followed Madras 2024 pattern." },
  { year: "2022", iit: "IIT Bombay", qp: 54, qs: 18, marks: 360, mode: "Online", obs: "18 questions per subject." },
  { year: "2021", iit: "IIT Kharagpur", qp: 54, qs: 18, marks: 360, mode: "Online", obs: "Consistent with 2022." },
  { year: "2020", iit: "IIT Delhi", qp: 59, qs: "~20", marks: 396, mode: "Online", obs: "High question count year." },
  { year: "2018", iit: "IIT Kanpur", qp: 64, qs: "~21", marks: 360, mode: "Online*", obs: "First ever online CBT mode exam." },
  { year: "2015", iit: "IIT Bombay", qp: 75, qs: 25, marks: 504, mode: "Offline", obs: "Highest question count and marks ever." }
];

export default function PatternView({ onBack }: { onBack: () => void }) {
  const [openYear, setOpenYear] = useState<string | null>("2025");

  return (
    <div className={styles.wrapper}>
      <div className={styles.aurora} />
      
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Menu
        </button>
        <h1 className={styles.title}>Paper <span className={styles.accent}>Pattern</span></h1>
        <p className={styles.subtitle}>Year-wise history and detailed marking scheme</p>
      </header>

      {/* Overview Section */}
      <div className={styles.accordionList}>
        <div className={styles.accordionCard} style={{ border: "1px solid rgba(99, 102, 241, 0.3)", background: "rgba(99, 102, 241, 0.05)" }}>
          <div className={styles.accordionContent} style={{ padding: "32px" }}>
            <h3 style={{ margin: "0 0 16px", color: "#6366f1" }}>Exam Overview</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "14px", color: "#94a3b8" }}>
              <div>• 2 Compulsory Papers</div>
              <div>• 3 Hours per Paper</div>
              <div>• Online CBT Since 2018</div>
              <div>• English & Hindi Mode</div>
              <div>• Physics, Chem, Maths</div>
              <div>• Pattern Changes Yearly</div>
            </div>
            <p style={{ marginTop: "20px", fontSize: "13px", fontStyle: "italic", opacity: 0.8 }}>
              Note: IIT Roorkee is confirmed for 2026 with a pattern similar to 2024/25 (51 Qs).
            </p>
          </div>
        </div>
      </div>

      {/* Year-wise History */}
      <div className={styles.header} style={{ paddingBottom: "20px" }}>
        <h2 style={{ fontSize: "1.5rem", margin: "0" }}>Historical Patterns</h2>
      </div>

      <div className={styles.accordionList}>
        {YEAR_HISTORY.map((y) => (
          <div key={y.year} className={styles.accordionCard}>
            <button 
              className={styles.accordionHeader} 
              onClick={() => setOpenYear(openYear === y.year ? null : y.year)}
            >
              <span className={styles.chapterTitle}>{y.year} — {y.iit}</span>
              <span className={`${styles.chevron} ${openYear === y.year ? styles.chevronOpen : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </button>
            {openYear === y.year && (
              <div className={styles.accordionContent}>
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Questions/Paper</td><td>{y.qp} Qs</td></tr>
                      <tr><td>Questions/Subject</td><td>{y.qs} Qs</td></tr>
                      <tr><td>Total Marks</td><td>{y.marks}</td></tr>
                      <tr><td>Exam Mode</td><td><span className={styles.badge} style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>{y.mode}</span></td></tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: "16px", fontSize: "14px", color: "#94a3b8", background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px" }}>
                  <strong>Observation:</strong> {y.obs}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current Marking Scheme */}
      <div className={styles.header} style={{ paddingBottom: "20px" }}>
        <h2 style={{ fontSize: "1.5rem", margin: "0" }}>Marking Scheme (2024-26)</h2>
      </div>

      <div className={styles.accordionList}>
        <div className={styles.accordionCard}>
          <div className={styles.accordionContent} style={{ padding: "24px" }}>
             <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Section Type</th>
                      <th>Correct</th>
                      <th>Partial</th>
                      <th>Wrong</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Single Correct MCQ</td>
                      <td style={{ color: "#34d399" }}>+3</td>
                      <td>—</td>
                      <td style={{ color: "#f87171" }}>-1</td>
                    </tr>
                    <tr>
                      <td>Multiple Correct MCQ</td>
                      <td style={{ color: "#34d399" }}>+4</td>
                      <td style={{ color: "#fbbf24" }}>+1/opt</td>
                      <td style={{ color: "#f87171" }}>-2</td>
                    </tr>
                    <tr>
                      <td>Numerical (Integer)</td>
                      <td style={{ color: "#34d399" }}>+4</td>
                      <td>—</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>Match List / Para</td>
                      <td style={{ color: "#34d399" }}>+3</td>
                      <td>—</td>
                      <td>-1 / 0</td>
                    </tr>
                  </tbody>
                </table>
             </div>
             <p style={{ marginTop: "16px", fontSize: "13px", color: "#94a3b8" }}>
               *Paper 2 Section IV (Decimal Numerical) has **ZERO** negative marking.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
