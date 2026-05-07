"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import InstructionMode from "@/components/jee-advanced/InstructionMode";
import SyllabusPatternHub from "@/components/jee-advanced/SyllabusPatternHub";
import styles from "@/components/SelectScreen.module.css";

export default function JeeAdvancedHub() {
  const [activeMode, setActiveMode] = useState<"hub" | "instruction" | "syllabusPattern">("hub");
  const [jeeCount, setJeeCount] = useState<number>(0);

  useEffect(() => {
    fetch("/api/stats/exam-count?exam=JEE")
      .then(res => res.json())
      .then(d => setJeeCount(d.count))
      .catch(() => setJeeCount(0));
  }, []);

  if (activeMode === "instruction") {
    return <InstructionMode onBack={() => setActiveMode("hub")} />;
  }

  if (activeMode === "syllabusPattern") {
    return <SyllabusPatternHub onBack={() => setActiveMode("hub")} />;
  }

  return (
    <main className={styles.wrapper} style={{ padding: "0" }}>
      {/* No GlobalHeader here, it's in RootLayout */}
      
      {/* Background overlay - Brightened for vibrancy */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at center, rgba(10, 10, 15, 0.2) 0%, rgba(10, 10, 15, 0.5) 100%)",
        zIndex: 0
      }} />

      <div style={{ 
        flex: 1, 
        width: "100%",
        maxWidth: "600px", 
        margin: "40px auto", 
        padding: "0 20px", 
        textAlign: "center", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        position: "relative",
        zIndex: 1
      }}>
        
        <h1 className={styles.title} style={{ marginBottom: "12px" }}>
          JEE Advanced <span className={styles.accent}>Preparation</span>
        </h1>
        <p className={styles.sub} style={{ maxWidth: "500px", marginBottom: "40px", fontSize: "16px" }}>
          Master the toughest engineering entrance exam. View strategies or start a real-time mock test.
        </p>

        <div className={styles.options} style={{ width: "100%" }}>
          {/* Instruction Mode Card */}
          <div 
            onClick={() => setActiveMode("instruction")}
            className={styles.optionCard}
          >
            <span className={styles.optionIcon}>📚</span>
            <div className={styles.optionText}>
              <span className={styles.optionLabel}>Instruction Mode</span>
              <span className={styles.optionDesc}>Historical cutoffs, marking rules, and goal planning.</span>
            </div>
            <span className={styles.optionCheck}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </span>
          </div>

          {/* Real Battle Mode Card */}
          <Link href="/jee-advanced/mock-test" style={{ textDecoration: "none", width: "100%" }}>
            <div className={styles.optionCard}>
              <span className={styles.optionIcon}>⚔️</span>
              <div className={styles.optionText}>
                <span className={styles.optionLabel}>Real Battle Mode</span>
                <span className={styles.optionDesc}>Strict mock tests with real-time analysis.</span>
              </div>
              <span className={styles.optionCheck}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
              </span>
            </div>
          </Link>

          {/* Combined Syllabus & Pattern Card */}
          <div 
            onClick={() => setActiveMode("syllabusPattern")}
            className={styles.optionCard}
          >
            <span className={styles.optionIcon}>📝</span>
            <div className={styles.optionText}>
              <span className={styles.optionLabel}>Syllabus & Pattern</span>
              <span className={styles.optionDesc}>Exam structure and detailed subject-wise topics.</span>
            </div>
            <span className={styles.optionCheck}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
