"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InstructionModeProps {
  onBack: () => void;
}

export default function InstructionMode({ onBack }: InstructionModeProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "cutoffs" | "strategy">("overview");
  const [selectedYear, setSelectedYear] = useState(2025);

  const histData: Record<number, any> = {
    2025: { total: 360, diff: "VERY HARD", obs: "Cutoff dropped significantly from 2024. Paper was harder.", rows: [{ cat: "CRL (General)", sub: 7, agg: 74, pct: "20.56%" }, { cat: "GEN-EWS / OBC", sub: 6, agg: 66, pct: "18.50%" }, { cat: "SC / ST / PwD", sub: 4, agg: 37, pct: "10.28%" }], r100: 245, p100: 68, r500: 195, p500: 54, r2k: 155, p2k: 43, r5k: 125, p5k: 35, r10k: 95, p10k: 26 },
    2024: { total: 360, diff: "MODERATE-EASY", obs: "Highest cutoff in post-COVID era. Paper was easier.", rows: [{ cat: "CRL (General)", sub: 31, agg: 109, pct: "30.34%" }, { cat: "GEN-EWS / OBC", sub: 28, agg: 98, pct: "27.30%" }, { cat: "SC / ST / PwD", sub: 16, agg: 55, pct: "15.17%" }], r100: 295, p100: 82, r500: 255, p500: 71, r2k: 215, p2k: 60, r5k: 185, p5k: 51, r10k: 145, p10k: 40 },
    2023: { total: 360, diff: "MODERATE", obs: "Moderate cutoff. New syllabus effect (Statistics added).", rows: [{ cat: "CRL (General)", sub: 9, agg: 90, pct: "25.0%" }, { cat: "GEN-EWS / OBC", sub: 8, agg: 81, pct: "22.5%" }, { cat: "SC / ST / PwD", sub: 5, agg: 45, pct: "12.5%" }], r100: 280, p100: 77, r500: 235, p500: 65, r2k: 195, p2k: 54, r5k: 165, p5k: 46, r10k: 130, p10k: 36 },
    2022: { total: 360, diff: "VERY HARD", obs: "Lowest cutoff in history (15.28%). Paper was very difficult.", rows: [{ cat: "CRL (General)", sub: 5, agg: 55, pct: "15.28%" }, { cat: "GEN-EWS / OBC", sub: 5, agg: 50, pct: "13.89%" }, { cat: "SC / ST / PwD", sub: 3, agg: 28, pct: "7.78%" }], r100: 190, p100: 53, r500: 155, p500: 43, r2k: 125, p2k: 35, r5k: 95, p5k: 26, r10k: 75, p10k: 21 },
    2021: { total: 360, diff: "HARD", obs: "COVID year. Low cutoffs, moderate difficulty.", rows: [{ cat: "CRL (General)", sub: 6, agg: 63, pct: "17.50%" }, { cat: "GEN-EWS / OBC", sub: 5, agg: 56, pct: "15.75%" }, { cat: "SC / ST / PwD", sub: 3, agg: 31, pct: "8.75%" }], r100: 245, p100: 68, r500: 195, p500: 54, r2k: 160, p2k: 44, r5k: 130, p5k: 36, r10k: 105, p10k: 29 },
    2020: { total: 396, diff: "HARD", obs: "COVID year (Sept exam). High total marks (396).", rows: [{ cat: "CRL (General)", sub: 6, agg: 69, pct: "17.50%" }, { cat: "GEN-EWS / OBC", sub: 5, agg: 62, pct: "15.75%" }, { cat: "SC / ST / PwD", sub: 3, agg: 34, pct: "8.75%" }], r100: 285, p100: 72, r500: 235, p500: 59, r2k: 195, p2k: 49, r5k: 155, p5k: 39, r10k: 120, p10k: 30 },
    2019: { total: 372, diff: "VERY HARD", obs: "Revised downward due to tough paper. EWS introduced.", rows: [{ cat: "CRL (General)", sub: "10%", agg: "25.0%", pct: "Revised" }, { cat: "OBC / EWS", sub: "9%", agg: "22.5%", pct: "Revised" }, { cat: "SC / ST / PwD", sub: "5%", agg: "12.5%", pct: "Revised" }], r100: 265, p100: 71, r500: 220, p500: 59, r2k: 185, p2k: 50, r5k: 155, p5k: 42, r10k: 125, p10k: 34 },
    2018: { total: 360, diff: "MODERATE", obs: "First year of Online (CBT) exam. Cutoffs were revised down.", rows: [{ cat: "CRL (General)", sub: 12, agg: 90, pct: "25.0%" }, { cat: "OBC-NCL", sub: 11, agg: 81, pct: "22.5%" }, { cat: "SC / ST / PwD", sub: 6, agg: 45, pct: "12.5%" }], r100: 255, p100: 71, r500: 215, p500: 60, r2k: 185, p2k: 51, r5k: 155, p5k: 43, r10k: 125, p10k: 35 },
    2017: { total: 366, diff: "EASY", obs: "Standard year — 35% aggregate rule in full effect.", rows: [{ cat: "CRL (General)", sub: 11, agg: 118, pct: "35.0%" }, { cat: "OBC-NCL", sub: 10, agg: 115, pct: "31.5%" }, { cat: "SC / ST / PwD", sub: 5, agg: 63, pct: "17.5%" }], r100: 310, p100: 85, r500: 275, p500: 75, r2k: 235, p2k: 64, r5k: 200, p5k: 55, r10k: 170, p10k: 46 },
    2016: { total: 372, diff: "MODERATE", obs: "Consistent 35% rule for GEN category. Four new IITs opened.", rows: [{ cat: "CRL (General)", sub: "10%", agg: "35.0%", pct: "35.0%" }, { cat: "OBC-NCL", sub: "9%", agg: "31.5%", pct: "31.5%" }, { cat: "SC / ST / PwD", sub: "5%", agg: "17.5%", pct: "17.5%" }], r100: 265, p100: 71, r500: 225, p500: 60, r2k: 195, p2k: 52, r5k: 170, p5k: 46, r10k: 145, p10k: 39 },
    2015: { total: 504, diff: "EASY (HIGH MARKS)", obs: "Highest total marks in history (504). Pattern was different.", rows: [{ cat: "CRL (General)", sub: "10%", agg: "35.0%", pct: "35.0%" }, { cat: "OBC-NCL", sub: "9%", agg: "31.5%", pct: "31.5%" }, { cat: "SC / ST / PwD", sub: "5%", agg: "17.5%", pct: "17.5%" }], r100: 420, p100: 83, r500: 370, p500: 73, r2k: 320, p2k: 63, r5k: 280, p5k: 55, r10k: 240, p10k: 48 },
    2014: { total: 360, diff: "MODERATE", obs: "Second year of JEE Advanced. Standard 35% rule applied.", rows: [{ cat: "CRL (General)", sub: "~12", agg: 126, pct: "35.0%" }, { cat: "OBC-NCL", sub: "~11", agg: 113, pct: "31.5%" }, { cat: "SC / ST / PwD", sub: "~6", agg: 63, pct: "17.5%" }], r100: 260, p100: 72, r500: 220, p500: 61, r2k: 190, p2k: 53, r5k: 165, p5k: 46, r10k: 140, p10k: 39 },
    2013: { total: 360, diff: "MODERATE", obs: "First year of JEE Advanced. PEN and PAPER mode.", rows: [{ cat: "CRL (General)", sub: "10%", agg: "35.0%", pct: "35.0%" }, { cat: "OBC-NCL", sub: "9%", agg: "31.5%", pct: "31.5%" }, { cat: "SC / ST / PwD", sub: "5%", agg: "17.5%", pct: "17.5%" }], r100: 275, p100: 76, r500: 230, p500: 64, r2k: 195, p2k: 54, r5k: 170, p5k: 47, r10k: 145, p10k: 40 },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "20px 40px", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <button 
          onClick={onBack}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, transition: "all 0.2s" }}
          onMouseOver={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseOut={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          ← Back to Hub
        </button>
      </div>

      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "16px" }}
        >
          JEE Advanced <span style={{ color: "#a78bfa" }}>Instructions</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: "1.1rem", color: "#94a3b8", marginBottom: "40px", maxWidth: "700px", lineHeight: 1.6 }}
        >
          Before entering the Real Battle Mode, understand the enemy. JEE Advanced requires precision, strategy, and an understanding of the marking scheme.
        </motion.p>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px" }}>
          {[
            { id: "overview", label: "Exam Overview" },
            { id: "cutoffs", label: "Historical Cutoffs" },
            { id: "strategy", label: "Scoring Strategy" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "10px 20px",
                background: activeTab === tab.id ? "rgba(167, 139, 250, 0.1)" : "transparent",
                color: activeTab === tab.id ? "#a78bfa" : "#64748b",
                border: "none",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && (
              <div style={{ display: "grid", gap: "24px" }}>
                <div style={{ padding: "32px", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>Structure of JEE Advanced</h3>
                  <p style={{ color: "#94a3b8", lineHeight: 1.6, marginBottom: "16px" }}>
                    The exam consists of two papers (Paper 1 and Paper 2), both compulsory. Each paper is 3 hours long.
                  </p>
                  <ul style={{ color: "#94a3b8", lineHeight: 1.8, paddingLeft: "20px" }}>
                    <li><strong style={{ color: "#e2e8f0" }}>Question Types:</strong> Multiple Choice (Single Correct), Multiple Choice (One or More Correct), Numerical Value type, and Paragraph type.</li>
                    <li><strong style={{ color: "#e2e8f0" }}>Negative Marking:</strong> Varies heavily per question type. Multiple Correct questions often have partial marking but heavy negative marks (-2) for incorrect combinations.</li>
                    <li><strong style={{ color: "#e2e8f0" }}>Subject Inclusion:</strong> Physics, Chemistry, and Mathematics in both papers.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "cutoffs" && (
              <div style={{ display: "grid", gap: "24px" }}>
                <div style={{ padding: "32px", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>Historical Qualifying Trends</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "24px" }}>Select a year to see official qualifying marks and key paper observations.</p>
                  
                  {/* Year Tabs */}
                  <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "15px", marginBottom: "24px", scrollbarWidth: "none" }}>
                    {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013].map(y => (
                      <button 
                        key={y} 
                        onClick={() => setSelectedYear(y)}
                        style={{
                          padding: "8px 20px",
                          background: selectedYear === y ? "#6366f1" : "rgba(255,255,255,0.05)",
                          color: selectedYear === y ? "#fff" : "#94a3b8",
                          border: "1px solid",
                          borderColor: selectedYear === y ? "#818cf8" : "rgba(255,255,255,0.1)",
                          borderRadius: "100px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {y}
                      </button>
                    ))}
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#818cf8", letterSpacing: "0.05em" }}>YEAR {selectedYear}</div>
                      <div style={{ fontSize: "0.95rem", color: "#94a3b8", fontWeight: 600 }}>Total Marks: {histData[selectedYear].total}</div>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", color: "#cbd5e1" }}>
                      <thead>
                        <tr style={{ textAlign: "left", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b" }}>
                          <th style={{ padding: "12px" }}>Category</th>
                          <th style={{ padding: "12px" }}>Min / Sub</th>
                          <th style={{ padding: "12px" }}>Min Aggregate</th>
                          <th style={{ padding: "12px" }}>% Age</th>
                        </tr>
                      </thead>
                      <tbody>
                        {histData[selectedYear].rows.map((r: any, idx: number) => (
                          <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            <td style={{ padding: "16px 12px", fontWeight: 700, color: "#fff" }}>{r.cat}</td>
                            <td style={{ padding: "16px 12px" }}>{r.sub}</td>
                            <td style={{ padding: "16px 12px" }}>{r.agg}</td>
                            <td style={{ padding: "16px 12px" }}>{r.pct}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ marginTop: "24px", padding: "16px", background: "rgba(99, 102, 241, 0.1)", borderRadius: "12px", borderLeft: "4px solid #6366f1", color: "#c7d2fe", fontSize: "0.95rem", lineHeight: 1.6 }}>
                      <strong>🔎 Key Observation:</strong> {histData[selectedYear].obs}
                    </div>
                  </div>

                  <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "24px", textAlign: "center" }}>
                    * Qualifying cutoff: Minimum marks required to enter the official JEE Advanced rank list.
                  </p>

                  {/* Dynamic Year-wise Course Cutoffs Section */}
                  <div style={{ marginTop: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", margin: 0 }}>Year {selectedYear}: Marks vs. Rank</h3>
                      <span style={{ padding: "4px 10px", background: "rgba(167, 139, 250, 0.1)", color: "#a78bfa", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>ESTIMATED</span>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "20px" }}>Approximate marks needed to achieve these All India Ranks in {selectedYear}.</p>

                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", color: "#cbd5e1" }}>
                        <thead>
                          <tr style={{ textAlign: "left", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b" }}>
                            <th style={{ padding: "12px" }}>Target Rank (AIR)</th>
                            <th style={{ padding: "12px" }}>Target Branch / Course</th>
                            <th style={{ padding: "12px" }}>Marks Needed ({selectedYear})</th>
                            <th style={{ padding: "12px" }}>% Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { rank: "Top 100", course: "IIT Bombay / Delhi CSE", marks: histData[selectedYear].r100, pct: histData[selectedYear].p100 },
                            { rank: "Top 500", course: "Top 5 IITs CSE", marks: histData[selectedYear].r500, pct: histData[selectedYear].p500 },
                            { rank: "Top 2000", course: "Top 7 IITs Core (EE/ME)", marks: histData[selectedYear].r2k, pct: histData[selectedYear].p2k },
                            { rank: "Top 5000", course: "Mid-Tier IITs (CSE/Electrical)", marks: histData[selectedYear].r5k, pct: histData[selectedYear].p5k },
                            { rank: "Top 10,000", course: "Any IIT (Lower / Core)", marks: histData[selectedYear].r10k, pct: histData[selectedYear].p10k },
                          ].map((row, i) => (
                            <tr key={i} style={{ background: "rgba(255,255,255,0.03)" }}>
                              <td style={{ padding: "16px 12px", borderTopLeftRadius: "12px", borderBottomLeftRadius: "12px", fontWeight: 800, color: "#a78bfa" }}>{row.rank}</td>
                              <td style={{ padding: "16px 12px", fontWeight: 600, color: "#fff" }}>{row.course}</td>
                              <td style={{ padding: "16px 12px", color: "#38bdf8", fontWeight: 800 }}>{row.marks} <span style={{ fontSize: "0.7rem", color: "#64748b" }}>/ {histData[selectedYear].total}</span></td>
                              <td style={{ padding: "16px 12px", borderTopRightRadius: "12px", borderBottomRightRadius: "12px", color: "#94a3b8", fontWeight: 600 }}>{row.pct}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div style={{ marginTop: "24px", background: "linear-gradient(90deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <h4 style={{ color: "#fff", margin: "0 0 10px 0" }}>💡 Why did marks change for the same rank?</h4>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.6 }}>
                        In <strong style={{ color: "#e2e8f0" }}>{selectedYear}</strong>, the paper difficulty was <strong>{histData[selectedYear].diff}</strong>. 
                        This is why for a Top 500 rank, you needed <strong>{histData[selectedYear].r500} marks</strong>. 
                        Always analyze the difficulty before setting your target during the exam!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "strategy" && (
              <div style={{ display: "grid", gap: "24px" }}>
                <div style={{ padding: "32px", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>The Golden Rule: Accuracy over Attempts</h3>
                  <p style={{ color: "#94a3b8", lineHeight: 1.6, marginBottom: "16px" }}>
                    In JEE Advanced, attempting fewer questions with 100% accuracy yields a massively higher rank than attempting many with low accuracy. Negative marking destroys ranks.
                  </p>
                  <div style={{ background: "rgba(239, 68, 68, 0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
                    <h4 style={{ color: "#ef4444", margin: "0 0 8px 0" }}>⚠️ Warning on Multiple Correct Questions</h4>
                    <p style={{ color: "#fca5a5", fontSize: "0.95rem", margin: 0, lineHeight: 1.5 }}>
                      Do not guess options in Multiple Correct Type unless you are absolutely sure. Partial marks are awarded for correct options, but selecting even ONE wrong option gives you a -2 penalty.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
