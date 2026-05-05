"use client";

import GlobalHeader from "@/components/GlobalHeader";
import Link from "next/link";
import { useState, useEffect } from "react";
import InstructionMode from "@/components/jee-advanced/InstructionMode";

export default function JeeAdvancedHub() {
  const [activeMode, setActiveMode] = useState<"hub" | "instruction">("hub");
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

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0a0a0f)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, maxWidth: "1000px", margin: "80px auto", padding: "0 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div style={{ padding: "8px 16px", background: "rgba(167, 139, 250, 0.1)", color: "#a78bfa", borderRadius: "20px", fontSize: "0.9rem", fontWeight: 700, border: "1px solid rgba(167, 139, 250, 0.2)" }}>
            NEW MODULE
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(52, 211, 153, 0.1)", padding: "8px 16px", borderRadius: "20px", color: "#34d399", fontSize: "0.9rem", fontWeight: 700, border: "1px solid rgba(52, 211, 153, 0.2)" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 10px #34d399" }} />
            {jeeCount > 0 ? jeeCount.toLocaleString() : "..."} Students Preparing
          </div>
        </div>

        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "20px", color: "#f8fafc", lineHeight: 1.1 }}>
          JEE Advanced <span style={{ color: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)" }}>Preparation</span>
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto 48px", color: "var(--text-muted, #94a3b8)", lineHeight: 1.6 }}>
          Master the toughest engineering entrance exam. Learn the strategies in Instruction Mode, or test your mettle in the Real Battle Mode.
        </p>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "24px", 
          marginBottom: "60px",
          width: "100%"
        }}>
          {/* Instruction Mode Card */}
          <div 
            onClick={() => setActiveMode("instruction")}
            style={{ 
              padding: "40px 32px", 
              background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)", 
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.08)",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>📚</div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "12px", color: "#f8fafc" }}>
              Instruction Mode
            </h3>
            <p style={{ color: "#94a3b8", lineHeight: 1.5 }}>
              Understand the JEE Advanced structure. View historical cutoffs, learn the negative marking rules, and plan your target score.
            </p>
          </div>

          {/* Real Battle Mode Card */}
          <Link href="/jee-advanced/mock-test" style={{ textDecoration: "none" }}>
            <div 
              style={{ 
                padding: "40px 32px", 
                background: "linear-gradient(145deg, rgba(167,139,250,0.1) 0%, rgba(236,72,153,0.05) 100%)", 
                borderRadius: "24px",
                border: "1px solid rgba(167, 139, 250, 0.2)",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.3s ease",
                height: "100%"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.2)";
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>⚔️</div>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "12px", color: "#f8fafc" }}>
                Real Battle Mode
              </h3>
              <p style={{ color: "#94a3b8", lineHeight: 1.5, marginBottom: "20px" }}>
                Take full-length JEE Advanced mock tests under strict exam conditions. First test analysis is completely free!
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(236, 72, 153, 0.2)", padding: "6px 12px", borderRadius: "12px", color: "#fbcfe8", fontSize: "0.85rem", fontWeight: 600 }}>
                <span>Free Trial Available</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
