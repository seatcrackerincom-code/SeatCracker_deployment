"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InstructionModeProps {
  onBack: () => void;
}

export default function InstructionMode({ onBack }: InstructionModeProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "cutoffs" | "strategy">("overview");

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
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>Expected Targets (Estimated)</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", color: "#cbd5e1" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                          <th style={{ padding: "12px", color: "#94a3b8", fontWeight: 600 }}>Category</th>
                          <th style={{ padding: "12px", color: "#94a3b8", fontWeight: 600 }}>Rank Goal</th>
                          <th style={{ padding: "12px", color: "#94a3b8", fontWeight: 600 }}>Approx. % Score Required</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "12px" }}>Top IITs (CSE)</td>
                          <td style={{ padding: "12px", fontWeight: 700, color: "#a78bfa" }}>&lt; 500</td>
                          <td style={{ padding: "12px" }}>~60% - 65%</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "12px" }}>Top IITs (Core)</td>
                          <td style={{ padding: "12px", fontWeight: 700, color: "#38bdf8" }}>&lt; 3000</td>
                          <td style={{ padding: "12px" }}>~40% - 45%</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "12px" }}>Any IIT (Lower Branch)</td>
                          <td style={{ padding: "12px", fontWeight: 700, color: "#34d399" }}>&lt; 10000</td>
                          <td style={{ padding: "12px" }}>~28% - 32%</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "12px" }}>Qualification (General)</td>
                          <td style={{ padding: "12px", fontWeight: 700, color: "#f472b6" }}>—</td>
                          <td style={{ padding: "12px" }}>~20% - 25%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "16px" }}>
                    * Note: Percentages vary heavily based on paper difficulty each year.
                  </p>
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
