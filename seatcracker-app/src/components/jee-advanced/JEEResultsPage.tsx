"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./JEEResultsPage.module.css";
import {
  type FullResult,
  type PercentileResult,
  getPerformanceAnalysis,
  getCategoryTable,
  getHeuristicPercentile,
} from "../../lib/jeeAdvancedScoring";

// Lightweight shape for localStorage results (no Supabase dependency)
interface DayResult {
  day_number: number;
  grand_total: number;
  overall_percentile?: number;
  [key: string]: any;
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface JEEResultsPageProps {
  result: FullResult;
  dayNumber: number;
  userId?: string;
  onBack: () => void;
  onViewDayResult?: (dayNumber: number) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function JEEResultsPage({
  result,
  dayNumber,
  userId,
  onBack,
  onViewDayResult,
}: JEEResultsPageProps) {
  const [percentile, setPercentile] = useState<PercentileResult | null>(null);
  const [percentileLoading, setPercentileLoading] = useState(true);
  const [percentileError, setPercentileError] = useState(false);
  const [allDayResults, setAllDayResults] = useState<DayResult[]>([]);
  const [reviewPaper, setReviewPaper] = useState<1 | 2 | null>(null);
  const [reviewData, setReviewData] = useState<{ questions: any[]; responses: any } | null>(null);
  const [selectedHistoricalYear, setSelectedHistoricalYear] = useState<number>(2025);

  // Load percentile async
  useEffect(() => {
    if (!userId) {
      setPercentileLoading(false);
      setPercentileError(true);
      return;
    }

    const fetchPercentile = async () => {
      try {
        const res = await fetch("/api/jee-advanced/percentile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dayNumber, userId }),
        });
        if (res.ok) {
          const data = await res.json();
          setPercentile(data);
        } else {
          setPercentileError(true);
        }
      } catch {
        setPercentileError(true);
      } finally {
        setPercentileLoading(false);
      }
    };

    fetchPercentile();
  }, [dayNumber, userId]);

  // Load all day results from localStorage only
  useEffect(() => {
    const localResults: DayResult[] = [];
    for (let d = 1; d <= 10; d++) {
      const saved = localStorage.getItem(`sc_jee_result_day_${d}`);
      if (saved) {
        try {
          localResults.push(JSON.parse(saved));
        } catch {}
      }
    }
    setAllDayResults(localResults);
  }, []);

  // Derived data
  const { combined, paper1, paper2 } = result;

  const heuristic = useMemo(() => {
    return getHeuristicPercentile(combined.grandTotal);
  }, [combined.grandTotal]);

  const performance = useMemo(
    () =>
      getPerformanceAnalysis(
        combined.physics,
        combined.chemistry,
        combined.maths,
        combined.grandTotal
      ),
    [combined]
  );
  const categoryTable = useMemo(
    () =>
      getCategoryTable(
        combined.physics,
        combined.chemistry,
        combined.maths,
        combined.grandTotal
      ),
    [combined]
  );

  // Badge class
  const getBadgeClass = () => {
    if (combined.grandTotal >= 280) return styles.badgeOutstanding;
    if (combined.grandTotal >= 220) return styles.badgeExcellent;
    if (combined.grandTotal >= 160) return styles.badgeGood;
    if (combined.grandTotal >= 100) return styles.badgeAverage;
    if (combined.grandTotal >= 60) return styles.badgeBelowAvg;
    return styles.badgeSerious;
  };

  // Best day
  const bestDay = useMemo(() => {
    if (allDayResults.length === 0) return null;
    return allDayResults.reduce(
      (best, r) => (r.grand_total > best.grand_total ? r : best),
      allDayResults[0]
    );
  }, [allDayResults]);

  // Day completed map
  const completedDays = useMemo(() => {
    const map = new Map<number, DayResult>();
    for (const r of allDayResults) {
      map.set(r.day_number, r);
    }
    return map;
  }, [allDayResults]);

  const handleDayClick = useCallback(
    (d: number) => {
      if (completedDays.has(d) && onViewDayResult) {
        onViewDayResult(d);
      }
    },
    [completedDays, onViewDayResult]
  );

  const openReview = (paperNum: 1 | 2) => {
    // Try to find current day's full data in localStorage
    const saved = localStorage.getItem(`sc_jee_result_day_${dayNumber}`);
    if (saved) {
      try {
        const fullData = JSON.parse(saved);
        const questions = paperNum === 1 ? fullData.paper1_questions : fullData.paper2_questions;
        const responses = paperNum === 1 ? fullData.paper1_responses : fullData.paper2_responses;
        
        if (questions && responses) {
          setReviewData({ questions, responses });
          setReviewPaper(paperNum);
        } else {
          alert("Detailed question data not available for this attempt.");
        }
      } catch (e) {
        console.error("Review load error:", e);
      }
    }
  };

  // ── Historical Data ──
  const historicalData: Record<number, any> = {
    2025: {
      marks: 360,
      observation: "Cutoff dropped significantly from 2024. Paper was harder.",
      table: [
        { cat: "CRL (General)", sub: 7, agg: 74, pct: "20.56%" },
        { cat: "GEN-EWS / OBC", sub: 6, agg: 66, pct: "18.50%" },
        { cat: "SC / ST / PwD", sub: 4, agg: 37, pct: "10.28%" },
      ]
    },
    2024: {
      marks: 360,
      observation: "Highest cutoff in post-COVID era. Paper was easier.",
      table: [
        { cat: "CRL (General)", sub: 31, agg: 109, pct: "30.34%" },
        { cat: "GEN-EWS / OBC", sub: 28, agg: 98, pct: "27.30%" },
        { cat: "SC / ST / PwD", sub: 16, agg: 55, pct: "15.17%" },
      ]
    },
    2023: {
      marks: 360,
      observation: "Moderate cutoff. New syllabus effect (Statistics added).",
      table: [
        { cat: "CRL (General)", sub: 9, agg: 90, pct: "25.0%" },
        { cat: "GEN-EWS / OBC", sub: 8, agg: 81, pct: "22.5%" },
        { cat: "SC / ST / PwD", sub: 5, agg: 45, pct: "12.5%" },
      ]
    },
    2022: {
      marks: 360,
      observation: "Lowest cutoff in history (15.28%). Paper was very difficult.",
      table: [
        { cat: "CRL (General)", sub: 5, agg: 55, pct: "15.28%" },
        { cat: "GEN-EWS / OBC", sub: 5, agg: 50, pct: "13.89%" },
        { cat: "SC / ST / PwD", sub: 3, agg: 28, pct: "7.78%" },
      ]
    },
    2021: {
      marks: 360,
      observation: "COVID year. Low cutoffs, moderate difficulty.",
      table: [
        { cat: "CRL (General)", sub: 6, agg: 63, pct: "17.50%" },
        { cat: "GEN-EWS / OBC", sub: 5, agg: 56, pct: "15.75%" },
        { cat: "SC / ST / PwD", sub: 3, agg: 31, pct: "8.75%" },
      ]
    },
    2020: {
      marks: 396,
      observation: "COVID year (Sept exam). High total marks (396).",
      table: [
        { cat: "CRL (General)", sub: 6, agg: 69, pct: "17.50%" },
        { cat: "GEN-EWS / OBC", sub: 5, agg: 62, pct: "15.75%" },
        { cat: "SC / ST / PwD", sub: 3, agg: 34, pct: "8.75%" },
      ]
    },
    2019: {
      marks: 372,
      observation: "Revised downward due to tough paper. EWS introduced.",
      table: [
        { cat: "CRL (General)", sub: "10%", agg: "25.0%", pct: "Revised" },
        { cat: "OBC / EWS", sub: "9%", agg: "22.5%", pct: "Revised" },
        { cat: "SC / ST / PwD", sub: "5%", agg: "12.5%", pct: "Revised" },
      ]
    },
    2018: {
      marks: 360,
      observation: "First year of Online (CBT) exam. Cutoffs were revised down.",
      table: [
        { cat: "CRL (General)", sub: 12, agg: 90, pct: "25.0%" },
        { cat: "OBC-NCL", sub: 11, agg: 81, pct: "22.5%" },
        { cat: "SC / ST / PwD", sub: 6, agg: 45, pct: "12.5%" },
      ]
    }
  };

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
  const selectedHist = historicalData[selectedHistoricalYear] || historicalData[2025];

  const getDotClass = (score: number) => {
    if (score >= 220) return styles.dotGreen;
    if (score >= 160) return styles.dotYellow;
    return styles.dotRed;
  };

  return (
    <div className={styles.resultsPage}>
      <div className={styles.resultsInner}>
        {/* Back Button */}
        <button className={styles.backBtn} onClick={onBack}>
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className={styles.resultsHeader}>
          <div className={styles.headerDay}>Day {dayNumber} Results</div>
          <h1 className={styles.headerTitle}>JEE Advanced Analysis</h1>
          <div className={styles.headerDate}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* ── SECTION A — Score Summary ─── */}
        <div className={styles.scoreCard}>
          <div className={styles.grandScoreRow}>
            <span className={styles.grandScore}>{combined.grandTotal}</span>
            <span className={styles.grandScoreMax}>/ 360</span>
          </div>

          <div className={styles.paperScoresRow}>
            <div 
              className={`${styles.paperScorePill} ${styles.paperScoreClickable}`}
              onClick={() => openReview(1)}
            >
              <div className={styles.paperScoreLabel}>Paper 1</div>
              <div className={styles.paperScoreValue}>
                {paper1.total} <span>/ 180</span>
              </div>
              <div className={styles.reviewPrompt}>Click to Review →</div>
            </div>
            <div 
              className={`${styles.paperScorePill} ${styles.paperScoreClickable}`}
              onClick={() => openReview(2)}
            >
              <div className={styles.paperScoreLabel}>Paper 2</div>
              <div className={styles.paperScoreValue}>
                {paper2.total} <span>/ 180</span>
              </div>
              <div className={styles.reviewPrompt}>Click to Review →</div>
            </div>
          </div>

          {/* Subject Progress Bars */}
          <div className={styles.subjectBarsSection}>
            {[
              {
                name: "Physics",
                score: combined.physics,
                max: 120,
                barClass: styles.barPhysics,
              },
              {
                name: "Chemistry",
                score: combined.chemistry,
                max: 120,
                barClass: styles.barChemistry,
              },
              {
                name: "Mathematics",
                score: combined.maths,
                max: 120,
                barClass: styles.barMaths,
              },
            ].map((sub) => (
              <div key={sub.name} className={styles.subjectBar}>
                <div className={styles.subjectBarHeader}>
                  <span className={styles.subjectName}>{sub.name}</span>
                  <span className={styles.subjectScore}>
                    {sub.score} / {sub.max}
                  </span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.barFill} ${sub.barClass}`}
                    style={{
                      width: `${Math.max(0, (sub.score / sub.max) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <span className={`${styles.statChip} ${styles.statChipCorrect}`}>
              ✅ Correct: {combined.totalCorrect}
            </span>
            <span className={`${styles.statChip} ${styles.statChipWrong}`}>
              ❌ Wrong: {combined.totalWrong}
            </span>
            <span className={`${styles.statChip} ${styles.statChipSkipped}`}>
              ⬜ Skipped: {combined.totalUnattempted}
            </span>
          </div>

          <div className={styles.accuracyRow}>
            <span>
              Accuracy: <strong>{combined.accuracyPercent}%</strong>
            </span>
            <span>
              Efficiency: <strong>{combined.timeEfficiencyTag}</strong>
            </span>
          </div>
        </div>

        {/* ── SECTION B — Percentile & Rank ─── */}
        <div className={styles.percentileCard}>
          <div className={styles.percentileHero}>
            <div className={styles.percentileLabel}>Overall Percentile</div>
            {percentileLoading ? (
              <div className={styles.percentileLoading}>
                <div className={styles.spinner} />
                Analyzing Performance...
              </div>
            ) : percentileError ? (
              <div style={{ textAlign: "center", animation: "fadeSlideUp 0.5s ease-out" }}>
                <div className={styles.percentileValue} style={{ color: "#a78bfa", fontSize: "4.5rem", textShadow: "0 0 40px rgba(167, 139, 250, 0.3)" }}>
                  ~{heuristic.toFixed(2)}%
                </div>
                <div style={{ fontSize: "14px", color: "#a78bfa", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", marginTop: "-5px" }}>
                  Estimated Trend 📊
                </div>
              </div>
            ) : (
              <div className={styles.percentileValue}>
                {percentile?.overall.toFixed(2)}%
              </div>
            )}
          </div>

          {!percentileLoading && !percentileError && percentile && (
            <>
              <div className={styles.rankRow}>
                <div className={styles.rankLabel}>Estimated Rank</div>
                <div className={styles.rankValue}>
                  #{percentile.rankEstimate.toLocaleString("en-IN")} out of{" "}
                  {percentile.totalStudents.toLocaleString("en-IN")} students
                </div>
              </div>

              <table className={styles.percentileTable}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Percentile</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Physics</td>
                    <td>{combined.physics}/120</td>
                    <td>{percentile.physics.toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td>Chemistry</td>
                    <td>{combined.chemistry}/120</td>
                    <td>{percentile.chemistry.toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td>Mathematics</td>
                    <td>{combined.maths}/120</td>
                    <td>{percentile.maths.toFixed(2)}%</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {percentileError && !percentileLoading && (
            <div className={styles.rankRow} style={{ marginTop: "20px", padding: "20px", background: "rgba(16, 185, 129, 0.03)", borderRadius: "16px", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
              <div className={styles.rankLabel} style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>ESTIMATED ALL-INDIA RANK</div>
              <div className={styles.rankValue} style={{ color: "#34d399", fontSize: "2.5rem", margin: "5px 0" }}>
                #{Math.max(1, Math.round(200000 * (1 - heuristic / 100))).toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: "13px", color: "#34d399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                Trend among ~2 Lakh Aspirants
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION C — Performance Badge ─── */}
        <div className={styles.performanceCard}>
          <div className={`${styles.performanceBadge} ${getBadgeClass()}`}>
            {performance.tag}
          </div>

          <div className={styles.subjectPillsRow}>
            {performance.strongSubjects.map((s) => (
              <span key={s} className={`${styles.subjectPill} ${styles.pillStrong}`}>
                💪 {s}
              </span>
            ))}
            {performance.averageSubjects.map((s) => (
              <span key={s} className={`${styles.subjectPill} ${styles.pillAverage}`}>
                ➡️ {s}
              </span>
            ))}
            {performance.weakSubjects.map((s) => (
              <span key={s} className={`${styles.subjectPill} ${styles.pillWeak}`}>
                ⚠️ {s}
              </span>
            ))}
          </div>

          <div className={styles.improvementBox}>
            <strong>💡 Improvement Tip:</strong> {performance.improvementTip}
          </div>
        </div>

        {/* ── SECTION D — Category Qualification Table ─── */}
        <div className={styles.categoryCard}>
          <div className={styles.sectionTitle}>
            Category Qualification — JEE Advanced 2024
          </div>

          <table className={styles.categoryTable}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Min Agg</th>
                <th>Min Sub</th>
                <th>Status</th>
                <th>Projected Rank</th>
                <th>Marks Gap</th>
              </tr>
            </thead>
            <tbody>
              {categoryTable.map((row) => (
                <tr
                  key={row.category}
                  className={
                    row.qualified
                      ? styles.categoryRowQualified
                      : styles.categoryRowFailed
                  }
                >
                  <td style={{ fontWeight: 700, color: "#e2e8f0" }}>
                    {row.category}
                  </td>
                  <td>{row.aggregateThreshold}</td>
                  <td>{row.subjectThreshold}</td>
                  <td>
                    {row.qualified ? (
                      <span className={styles.statusBadgeQualified}>
                        ✅ QUALIFIED
                      </span>
                    ) : (
                      <span className={styles.statusBadgeFailed}>
                        ❌{" "}
                        {row.failReason === "aggregate_low"
                          ? "Agg low"
                          : row.failReason === "physics_low"
                          ? "Phy low"
                          : row.failReason === "chemistry_low"
                          ? "Chem low"
                          : "Math low"}
                      </span>
                    )}
                  </td>
                  <td>
                    {row.qualified && row.estimatedCategoryRank ? (
                      <div style={{ color: "#34d399", fontWeight: 800 }}>
                        #{row.estimatedCategoryRank.toLocaleString("en-IN")}
                      </div>
                    ) : (
                      <span style={{ color: "#64748b" }}>—</span>
                    )}
                  </td>
                  <td className={styles.marksGapCell}>
                    {row.marksNeeded.aggregate > 0 && (
                      <div className={styles.needMark}>
                        Agg: +{row.marksNeeded.aggregate}
                      </div>
                    )}
                    {row.marksNeeded.aggregate === 0 && row.qualified && (
                      <div className={styles.metMark}>Agg: ✓ Met</div>
                    )}
                    {row.marksNeeded.physics > 0 && (
                      <div className={styles.needMark}>
                        Phy: +{row.marksNeeded.physics}
                      </div>
                    )}
                    {row.marksNeeded.chemistry > 0 && (
                      <div className={styles.needMark}>
                        Chem: +{row.marksNeeded.chemistry}
                      </div>
                    )}
                    {row.marksNeeded.maths > 0 && (
                      <div className={styles.needMark}>
                        Math: +{row.marksNeeded.maths}
                      </div>
                    )}
                    {row.qualified && (
                      <span className={styles.metMark}>✓ All Met</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.privacyNote}>
            Find your category in the table above. No need to share your category
            with us — your privacy matters.
          </div>
        </div>

        {/* ── SECTION E — 10-Day Progress Tracker ─── */}
        <div className={styles.progressCard}>
          <div className={styles.sectionTitle}>📊 10-Day Progress Tracker</div>

          <div className={styles.progressTimeline}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => {
              const dayResult = completedDays.get(d);
              const isCurrentDay = d === dayNumber;
              const isCompleted = !!dayResult;

              return (
                <div
                  key={d}
                  className={`${styles.progressDay} ${
                    isCurrentDay ? styles.progressDayActive : ""
                  } ${isCompleted ? styles.progressDayClickable : ""} ${
                    !isCompleted && !isCurrentDay ? styles.progressDayLocked : ""
                  }`}
                  onClick={() => isCompleted && handleDayClick(d)}
                >
                  <div className={styles.progressDayLabel}>Day {d}</div>
                  {isCompleted ? (
                    <>
                      <div className={styles.progressDayScore}>
                        {dayResult.grand_total}
                      </div>
                      <div className={styles.progressDayPercentile}>
                        {dayResult.overall_percentile
                          ? `${Number(dayResult.overall_percentile).toFixed(1)}%`
                          : "—"}
                      </div>
                      <div
                        className={`${styles.progressDot} ${getDotClass(
                          dayResult.grand_total
                        )}`}
                      />
                    </>
                  ) : (
                    <>
                      <div className={styles.progressDayLockIcon}>🔒</div>
                      <div
                        className={`${styles.progressDot} ${styles.dotGrey}`}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {bestDay && (
            <div className={styles.bestDayBadge}>
              🏆 Your Best: Day {bestDay.day_number} with{" "}
              {bestDay.grand_total}/360
            </div>
          )}
        </div>

        {/* ── SECTION E — Historical Analysis ─── */}
        <div className={styles.historicalCard}>
          <div className={styles.sectionTitle}>
            Historical Cutoff Analysis (2013-2025)
          </div>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
            Compare your current performance against historical qualifying trends.
          </p>

          <div className={styles.yearTabs}>
            {years.map(y => (
              <button 
                key={y} 
                className={`${styles.yearTab} ${selectedHistoricalYear === y ? styles.yearTabActive : ""}`}
                onClick={() => setSelectedHistoricalYear(y)}
              >
                {y}
              </button>
            ))}
          </div>

          <div className={styles.histContent}>
            <div className={styles.histHeader}>
              <div className={styles.histYearLabel}>YEAR {selectedHistoricalYear}</div>
              <div className={styles.histMarksLabel}>Total Marks: {selectedHist.marks}</div>
            </div>

            <table className={styles.histTable}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Min / Sub</th>
                  <th>Min Aggregate</th>
                  <th>% Age</th>
                </tr>
              </thead>
              <tbody>
                {selectedHist.table.map((r: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: "#fff" }}>{r.cat}</td>
                    <td>{r.sub}</td>
                    <td>{r.agg}</td>
                    <td>{r.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.observationBox}>
              <strong>🔎 Key Observation:</strong> {selectedHist.observation}
            </div>
          </div>
        </div>
      </div>

      {/* ── Review Modal ── */}
      {reviewPaper && reviewData && (
        <div className={styles.reviewModalOverlay}>
          <div className={styles.reviewModal}>
            <div className={styles.reviewModalHeader}>
              <div>
                <h2 style={{ margin: 0 }}>Review: Paper {reviewPaper}</h2>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                  Day {dayNumber} • JEE Advanced
                </div>
              </div>
              <button className={styles.closeReviewBtn} onClick={() => setReviewPaper(null)}>
                ✕ Close
              </button>
            </div>

            <div className={styles.reviewModalContent}>
              {reviewData.questions.map((q, idx) => {
                const res = reviewData.responses[q.id];
                const studentAns = res?.option;
                const correctAns = q.answer;
                
                // Determine if correct
                let isCorrect = false;
                if (studentAns !== null && studentAns !== undefined) {
                  if (Array.isArray(studentAns) && Array.isArray(correctAns)) {
                    isCorrect = JSON.stringify(studentAns.sort()) === JSON.stringify(correctAns.sort());
                  } else {
                    isCorrect = String(studentAns).trim() === String(correctAns).trim();
                  }
                }
                const isSkipped = studentAns === null || studentAns === undefined || (Array.isArray(studentAns) && studentAns.length === 0);

                return (
                  <div key={q.id} className={styles.reviewItem}>
                    <div className={styles.reviewItemHeader}>
                      <span className={styles.qBadge}>Q{idx + 1}</span>
                      <span className={styles.qType}>{q.type}</span>
                      <span className={isCorrect ? styles.statusCorrect : isSkipped ? styles.statusSkipped : styles.statusWrong}>
                        {isCorrect ? "✅ Correct" : isSkipped ? "⏭ Skipped" : "❌ Wrong"}
                      </span>
                    </div>

                    <div className={styles.reviewQuestionText}>
                      {q.image ? (
                        <img src={q.image} alt="Question" />
                      ) : q.text ? (
                        <p>{q.text}</p>
                      ) : (
                        <p>Question image unavailable</p>
                      )}
                    </div>

                    <div className={styles.reviewAnswers}>
                      {!isSkipped && (
                        <div className={styles.ansRow}>
                          <span className={styles.ansLabel}>Your Answer:</span>
                          <span className={isCorrect ? styles.ansValCorrect : styles.ansValWrong}>
                            {Array.isArray(studentAns) ? studentAns.join(", ") : String(studentAns)}
                          </span>
                        </div>
                      )}
                      <div className={styles.ansRow}>
                        <span className={styles.ansLabel}>Correct Answer:</span>
                        <span className={styles.ansValCorrect}>
                          {Array.isArray(correctAns) ? correctAns.join(", ") : String(correctAns)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
