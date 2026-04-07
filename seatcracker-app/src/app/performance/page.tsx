"use client";

import { useState, useEffect } from "react";
import GlobalHeader from "../../components/GlobalHeader";
import { useUserState } from "../../lib/useUserState";
import { fetchProgress, type UserProgress } from "../../lib/supabase";
import { calculateGlobalStats, type GlobalStats } from "../../lib/stats_helper";
import { getAccessStateSync } from "../../lib/access";
import Link from "next/link";

export default function PerformancePage() {
  const { user } = useUserState();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessStatus, setAccessStatus] = useState<string>("Guest");

  useEffect(() => {
    if (user?.uid) {
      // Sync access status
      const access = getAccessStateSync();
      if (access.status === 'premium') setAccessStatus("Premium Gold 🏆");
      else if (access.status === 'trial') setAccessStatus("Standard Trial ⏳");
      else setAccessStatus("Guest Access 👤");

      fetchProgress(user.uid)
        .then((data) => {
          setProgress(data);
          // Rectify Bug: Dynamically calculate progress based on course
          // Engineering ~120, Medical ~160. Default 120.
          const totalTopicsTarget = 120; 
          const baseStats = calculateGlobalStats(data);
          const dynamicProgress = Math.min(100, Math.round((data.length / totalTopicsTarget) * 100));
          
          setStats({
            ...baseStats,
            progressPercent: dynamicProgress
          });
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  // Topic Mastery list (Attempted topics)
  const masteredTopics = progress
    .filter((p) => p.accuracy >= 80)
    .sort((a, b) => new Date(b.last_attempt_at || 0).getTime() - new Date(a.last_attempt_at || 0).getTime());

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0a0a0f", color: "#fff" }}>
        <div className="spinner" style={{ width: "40px", height: "40px", border: "4px solid rgba(255,255,255,0.1)", borderTopColor: "#a78bfa", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0a0a0f)", color: "#fff" }}>
      <GlobalHeader />

      <div style={{ flex: 1, maxWidth: "1100px", width: "100%", margin: "100px auto 60px", padding: "0 24px" }}>
        
        {/* Header Section with Membership Badge */}
        <header style={{ marginBottom: "48px", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, background: "linear-gradient(90deg, #fff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
              Smart Performance Dashboard
            </h1>
            <p style={{ color: "var(--text-muted, #94a3b8)", fontSize: "1.1rem" }}>
              Real-time analytics tracking your mastery, speed, and syllabus coverage.
            </p>
          </div>
          
          <div style={{ 
            padding: "8px 16px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "13px", fontWeight: 700, color: "#a78bfa", display: "flex", alignItems: "center", gap: "8px"
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 10px #a78bfa" }} />
            {accessStatus}
          </div>
        </header>

        {/* Global Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          
          <div className="stat-card" style={{ padding: "32px", background: "rgba(167, 139, 250, 0.05)", borderRadius: "24px", border: "1px solid rgba(167, 139, 250, 0.15)", position: "relative", overflow: "hidden" }}>
             <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", background: "rgba(167, 139, 250, 0.1)", borderRadius: "50%", filter: "blur(40px)" }} />
             <div style={{ fontSize: "12px", fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}> Mastery Speed (BPM) </div>
             <div style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1 }}>{stats?.bpm || 0}</div>
             <div style={{ fontSize: "13px", color: "var(--text-muted, #64748b)", marginTop: "12px" }}>Bits (Correct) Per Minute</div>
          </div>

          <div className="stat-card" style={{ padding: "32px", background: "rgba(16, 185, 129, 0.05)", borderRadius: "24px", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
             <div style={{ fontSize: "12px", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}> Global Accuracy </div>
             <div style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1 }}>{stats?.avgAccuracy || 0}%</div>
             <div style={{ fontSize: "13px", color: "var(--text-muted, #64748b)", marginTop: "12px" }}>Correct answers across all tests</div>
          </div>

          <div className="stat-card" style={{ padding: "32px", background: "rgba(59, 130, 246, 0.05)", borderRadius: "24px", border: "1px solid rgba(59, 130, 246, 0.15)" }}>
             <div style={{ fontSize: "12px", fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}> Syllabus Coverage </div>
             <div style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1 }}>{stats?.progressPercent || 0}%</div>
             <div style={{ fontSize: "13px", color: "var(--text-muted, #64748b)", marginTop: "12px" }}>{progress.length} of 120 topics attempted</div>
          </div>

        </div>

        {/* Detailed Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px" }}>
          
          {/* Mastered Topics List - FIXED SCROLLING BUG */}
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", padding: "32px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.5rem" }}>🏆</span> Mastered Topics
            </h3>
            
            <div style={{ 
              maxHeight: "450px", 
              overflowY: "auto", 
              paddingRight: "8px",
              display: "flex", 
              flexDirection: "column", 
              gap: "16px"
            }}>
              {masteredTopics.length > 0 ? (
                masteredTopics.map((item, idx) => (
                  <div key={idx} style={{ 
                    padding: "16px 20px", 
                    background: "rgba(255,255,255,0.03)", 
                    borderRadius: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid rgba(255,255,255,0.05)"
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "15px" }}>{item.topic}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted, #64748b)" }}>{item.subject} • Batch {item.attempts} Completed</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#10b981", fontWeight: 800, fontSize: "18px" }}>{item.accuracy}%</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted, #64748b)" }}>{item.avg_time}s avg. pace</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted, #64748b)", background: "rgba(255,255,255,0.01)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "12px" }}>📖</div>
                  No mastered topics yet. Reach 80%+ accuracy in any topic to see it here.
                </div>
              )}
            </div>
            
            <style>{`
              div::-webkit-scrollbar { width: 6px; }
              div::-webkit-scrollbar-track { background: transparent; }
              div::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
              div::-webkit-scrollbar-thumb:hover { background: rgba(167, 139, 250, 0.3); }
            `}</style>
          </div>

          {/* Action Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
             <div style={{ 
                padding: "40px 32px", 
                borderRadius: "24px", 
                background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                color: "#fff",
                textAlign: "center",
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)",
                border: "1px solid rgba(255,255,255,0.1)"
             }}>
               <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🚀</div>
               <h4 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "12px" }}>Boost Your BPM</h4>
               <p style={{ fontSize: "0.95rem", opacity: 0.9, marginBottom: "32px", lineHeight: 1.5 }}>
                 Focus on topics with low coverage to increase your syllabus percentage and mastery score.
               </p>
               <Link href="/" style={{ 
                 display: "block", 
                 background: "#fff", 
                 color: "#6366f1", 
                 padding: "16px", 
                 borderRadius: "16px", 
                 fontWeight: 800, 
                 textDecoration: "none",
                 transition: "transform 0.2s"
               }} onMouseEnter={(e) => e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform="translateY(0)"}>
                 Back to Practice
               </Link>
             </div>

             <div style={{ 
               padding: "24px", 
               borderRadius: "24px", 
               background: "rgba(255,255,255,0.02)", 
               border: "1px solid rgba(255,255,255,0.05)",
               fontSize: "13.5px"
             }}>
               <h5 style={{ fontWeight: 700, marginBottom: "12px", color: "#a78bfa", display: "flex", alignItems: "center", gap: "8px" }}>
                 <span style={{ fontSize: "16px" }}>ℹ️</span> About Your BPM
               </h5>
               <p style={{ color: "var(--text-muted, #94a3b8)", lineHeight: 1.6 }}>
                 <strong>Bit-per-Minute (BPM)</strong> measures how many high-quality "bits" (correct answers) you process every 60 seconds. It is the gold standard for EAMCET speed training.
               </p>
             </div>
          </div>

        </div>

        {/* Beta Disclaimer */}
        <div style={{ textAlign: "center", marginTop: "32px", padding: "16px", fontSize: "12px", color: "var(--text-muted, #64748b)" }}>
          SeatCracker is currently in active development. If you experience any issues, we sincerely apologize. Our team is constantly working to improve this platform!
        </div>

      </div>
    </main>
  );
}
