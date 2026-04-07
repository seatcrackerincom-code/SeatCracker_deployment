"use client";

import { useState, useEffect } from "react";
import styles from "./PracticeArena.module.css";
import { saveProgress, fetchProgress, type UserProgress } from "../lib/supabase";
import ExamPractice from "./ExamPractice";
import { getBaseTime, getAttemptTargetTime } from "../utils/timer_mapping";
import { useUserState } from "../lib/useUserState";
import { calculateGlobalStats } from "../lib/stats_helper";
import ProfileModal from "./ProfileModal";
import ThemeToggle from "./ThemeToggle";
import type { User } from "../lib/firebase";
import type { AccessState } from "../lib/access";
import { trackTopicOpened, trackExamStarted, trackExamCompleted } from "../lib/analytics";



interface Chapter {
  chapter: string;
  priority?: string;
  subtopics?: string[];
  ap?: string | number;
  ts?: string | number;
  ap_questions?: string | number;
}

interface SubjectData {
  subject: string;
  chapters: Chapter[];
}

interface Formula {
  subtopic: string;
  description: string;
  equation: string;
}

interface TopicFormulas {
  topic_id?: number;
  topic_name: string;
  formulas: Formula[];
}

interface Props {
  userId: string;
  exam: string;
  course: string;
  onBack: () => void;
  onGoToRoadmap: () => void;
  authUser?: User | null;
  access?: AccessState | null;
}

const SUBJECT_MAP: Record<string, string[]> = {
  Engineering: ["Mathematics", "Physics", "Chemistry"],
  Agriculture: ["Botany", "Zoology", "Physics", "Chemistry"],
  Pharmacy: ["Botany", "Zoology", "Physics", "Chemistry"],
};

type View = "home" | "topic";

export default function PracticeArena({ userId, exam, course, onBack, onGoToRoadmap, authUser, access }: Props) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set(["Mathematics", "Physics", "Botany"]));
  const [selectedTopic, setSelectedTopic] = useState<{ subject: string; chapter: Chapter } | null>(null);
  const [view, setView] = useState<View>("home");
  const [allProgress, setAllProgress] = useState<UserProgress[]>([]);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loadingFormulas, setLoadingFormulas] = useState(false);

  // Exam mode — replaces old dummy test
  const [examMode, setExamMode] = useState(false);
  const [examCount, setExamCount] = useState<number>(15);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { user, saveState } = useUserState();


  useEffect(() => {
    setMounted(true);
    const savedFilter = localStorage.getItem("sc_arena_filter") as "All" | "High" | "Medium" | "Low";
    if (savedFilter) setFilter(savedFilter);

    const subjects = SUBJECT_MAP[course] || [];
    Promise.all(
      subjects.map(async (subject) => {
        const url = `/SYLLABUS/${exam}/${course}/${subject}/${subject}.json`;
        try {
          const res = await fetch(url);
          if (res.ok) {
            const json = await res.json();
            const chapters: Chapter[] = Array.isArray(json) ? json : json.chapters;
            return { subject, chapters };
          }
        } catch {}
        return { subject, chapters: [] };
      })
    ).then((res) => { setData(res); setLoading(false); })
     .catch(() => setLoading(false));

    fetchProgress(userId).then(setAllProgress);
  }, [exam, course, userId]);

  useEffect(() => {
    if (!selectedTopic) {
      setFormulas([]);
      return;
    }

    const normalize = (s: string) => s.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    const { subject, chapter } = selectedTopic;
    const fileBase = subject.toLowerCase().includes("math") ? "maths" : subject.toLowerCase();
    const url = `/SYLLABUS/formulas/${fileBase}.json`;

    setLoadingFormulas(true);
    fetch(url)
      .then(res => res.json())
      .then((data: TopicFormulas[]) => {
        const normTopic = normalize(chapter.chapter);
        const found = data.find(t => normalize(t.topic_name) === normTopic);
        setFormulas(found ? found.formulas : []);
        setLoadingFormulas(false);
      })
      .catch(() => {
        setFormulas([]);
        setLoadingFormulas(false);
      });
  }, [selectedTopic]);

  if (!mounted) return null;

  // ───── Handlers ─────
  const toggleSubject = (s: string) =>
    setExpandedSubjects(prev => {
      const n = new Set(prev);
      n.has(s) ? n.delete(s) : n.add(s);
      return n;
    });

  const openTopic = (subject: string, ch: Chapter) => {
    setSelectedTopic({ subject, chapter: ch });
    setView("topic");
    setFormulas([]);
    setExamMode(false); // reset any active exam
    if (window.innerWidth < 768) setSidebarOpen(false);
    trackTopicOpened(subject, ch.chapter); // Firebase: topic_opened
  };

  // ───── Computed ─────
  const filteredData = data.map(d => ({
    ...d,
    chapters: filter === "All" ? d.chapters : d.chapters.filter(c => c.priority === filter),
  })).filter(d => d.chapters.length > 0);

  const lastProgress = allProgress[0] || null;

  // ───── Render helpers ─────
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const fmtMin = (s: number) => `${Math.floor(s / 60)} min`;

  const CircleProgress = ({ pct, label, color }: { pct: number; label: string; color: string }) => {
    const r = 36; const circ = 2 * Math.PI * r;
    const dash = circ - (pct / 100) * circ;
    return (
      <div className={styles.circWrap}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={dash}
            strokeLinecap="round" transform="rotate(-90 45 45)" style={{ transition: "stroke-dashoffset 1s ease" }} />
          <text x="45" y="50" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">{pct}%</text>
        </svg>
        <span className={styles.circLabel}>{label}</span>
      </div>
    );
  };

  // ───── Main render ─────
  return (
    <div className={styles.layout}>
      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarInner}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>📚 Syllabus</span>
            <button className={styles.collapseBtn} onClick={() => setSidebarOpen(o => !o)} title="Toggle Syllabus">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M9 3v18" />
              </svg>
            </button>
          </div>

          <div className={styles.filterWrap}>
            <select
              className={styles.filterSelect}
              value={filter}
              onChange={e => { setFilter(e.target.value as any); localStorage.setItem("sc_arena_filter", e.target.value); }}
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>

          {loading ? (
            <div className={styles.sidebarLoading}>Loading…</div>
          ) : (
            <nav className={styles.subjectNav}>
              {filteredData.map(item => (
                <div key={item.subject} className={styles.subjectGroup}>
                  <button className={styles.subjectToggle} onClick={() => toggleSubject(item.subject)}>
                    <span>{item.subject}</span>
                    <span className={`${styles.arrow} ${expandedSubjects.has(item.subject) ? styles.arrowDown : ""}`}>▸</span>
                  </button>
                  {expandedSubjects.has(item.subject) && (
                    <ul className={styles.topicList}>
                      {item.chapters.map((ch, i) => {
                        const isActive = selectedTopic?.chapter.chapter === ch.chapter;
                        const prog = allProgress.find(p => p.topic === ch.chapter);
                        return (
                          <li key={i}>
                            <button
                              className={`${styles.topicItem} ${isActive ? styles.topicActive : ""}`}
                              onClick={() => openTopic(item.subject, ch)}
                            >
                              <span className={styles.topicDot} data-p={ch.priority?.toLowerCase() || "low"} />
                              <span className={styles.topicLabel}>{ch.chapter}</span>
                              {prog && prog.attempts && prog.attempts >= 2 ? (
                                <span className={styles.doneCheck} style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", marginLeft: "auto", flexShrink: 0 }}>✓</span>
                              ) : (
                                <span className={styles.todoCheck} style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid var(--border)", marginLeft: "auto", flexShrink: 0 }} />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <div className={styles.topLeft}>
            <button className={`${styles.hamburger} ${sidebarOpen ? styles.hamburgerHidden : ""}`} onClick={() => setSidebarOpen(o => !o)} title="Toggle Syllabus">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M9 3v18" />
              </svg>
            </button>
            <button className={styles.backBtn} onClick={onBack}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
          <h1 className={styles.topTitle}>Today&apos;s Practise</h1>
          {/* Home Button (Premium Circular Style) */}
          <button
            onClick={onBack}
            title="Go Home"
            style={{
              width: "42px", height: "42px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              fontSize: "1.2rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            🏠
          </button>
        </header>
        <ProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          authUser={authUser}
          access={access}
        />

        <div className={styles.contentArea}>
          {/* ── HOME VIEW ── */}
          {view === "home" && (
            <div className={styles.homeView}>
              {lastProgress && (
                <div className={styles.dailyFeedback}>
                  <div>
                    <p className={styles.feedbackTitle}>Yesterday&apos;s Performance</p>
                    <p className={styles.feedbackSub}>
                      <strong>{lastProgress.topic}</strong> — Accuracy: <strong>{lastProgress.accuracy}%</strong> · Avg time: <strong>{lastProgress.avg_time}s/q</strong>
                    </p>
                    <p className={styles.feedbackMotivation}>Keep it up and improve today! </p>
                  </div>
                </div>
              )}
              <div className={styles.homeHint}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h7" /></svg>
                <p>Select a topic from the sidebar to start learning</p>
              </div>
            </div>
          )}

          {/* ── TOPIC VIEW ── */}
          {view === "topic" && selectedTopic && (
            <div className={styles.topicView}>
              <div className={styles.topicHeader}>
                <span className={styles.topicSubjectBadge}>{selectedTopic.subject}</span>
                <h2 className={styles.topicTitle}>{selectedTopic.chapter.chapter}</h2>
                <span className={styles.priorityBadge} data-p={selectedTopic.chapter.priority?.toLowerCase() || "low"}>
                  {selectedTopic.chapter.priority || "Low"} Priority
                </span>
              </div>

              <div className={styles.theoryCard}>
                <h3>📖 Theory Overview</h3>
                <p>This section covers the fundamental concepts of <strong>{selectedTopic.chapter.chapter}</strong> as part of {selectedTopic.subject} in EAMCET {exam} preparation.</p>
                {selectedTopic.chapter.subtopics && selectedTopic.chapter.subtopics.length > 0 && (
                  <ul className={styles.subtopicList}>
                    {selectedTopic.chapter.subtopics.map((st, i) => <li key={i}>{st}</li>)}
                  </ul>
                )}
              </div>

              <div className={styles.formulaCard}>
                <h3>✏️ Important Formulas</h3>
                {loadingFormulas ? (
                  <p>Loading formulas...</p>
                ) : formulas.length > 0 ? (
                  <div className={styles.formulaGrid}>
                    {formulas.map((f, i) => (
                      <div key={i} className={styles.formulaItem}>
                        <code>{f.equation}</code>
                        <span>{f.subtopic}: {f.description}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.formulaGrid}>
                    <div className={styles.formulaItem}><code>No formulas found</code><span>Check back later</span></div>
                  </div>
                )}
              </div>

              <div className={styles.actionRow}>
                <a
                  href={`https://www.youtube.com/results?search_query=EAMCET+${exam}+${encodeURIComponent(selectedTopic.chapter.chapter)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.youtubeBtn}
                >
                  ▶ Watch on YouTube
                </a>

                <div className={styles.aiTeacherCard}>
                  {(() => {
                      const p = allProgress.find(p => p.topic === selectedTopic.chapter.chapter);
                      const attempt = (p?.attempts || 0) + 1;
                      const base = getBaseTime(selectedTopic.subject, selectedTopic.chapter.chapter);
                      const target = getAttemptTargetTime(base, attempt);
                      const modeName = ["", "Learning", "Controlled", "Speed", "Exam 💀"][attempt] || "Practice";
                      
                      const titles = [
                        "", 
                        "📖 Foundation Phase", 
                        "⏱️ Precision Training", 
                        "⚡ Speed Gauntlet", 
                        "🏆 Final Boss Simulation"
                      ];
                      
                      const subtitles = [
                        "", 
                        "Take your time, build raw accuracy without stress.", 
                        "The clock is ticking. Maintain your edge under pressure.", 
                        "No time to overthink. Trust your gut and move fast.", 
                        "This is it. The ultimate, ruthless EAMCET battle."
                      ];

                      return (
                        <>
                          <div style={{ flex: 1 }}>
                            <p className={styles.aiLabel} style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>
                              {titles[attempt] || titles[4]}
                              <span style={{ 
                                fontSize: '0.75rem', 
                                marginLeft: '10px', 
                                padding: '4px 10px', 
                                background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%)', 
                                color: 'var(--accent2)', 
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                borderRadius: '100px', 
                                fontWeight: 700 
                              }}>
                                Phase {attempt}/4
                              </span>
                            </p>
                            <p className={styles.aiSub} style={{ marginTop: '8px', fontSize: '0.95rem' }}>
                              {subtitles[attempt] || subtitles[4]}
                            </p>
                          </div>

                          <button
                            className={styles.startTestBtn}
                            id="start-exam-btn"
                            onClick={() => {
                              if (attempt === 1) {
                                const hasSeen = localStorage.getItem(`sc_seen_modal_${selectedTopic.subject}`);
                                if (!hasSeen) {
                                  setShowPracticeModal(true);
                                } else {
                                  setExamMode(true);
                                }
                              } else {
                                setExamMode(true);
                              }
                            }}
                          >
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                              <span style={{ fontSize: "1rem" }}>{modeName} Mode →</span>
                              <span style={{ fontSize: "0.75rem", opacity: 0.8, fontWeight: "normal" }}>Launch Mission · {Math.floor(target/60)} min</span>
                            </div>
                          </button>
                        </>
                      );
                  })()}
                </div>
              </div>

            </div>
          )}


          {/* ── Practice Session Modal (Attempt 1 only) ── */}
          {showPracticeModal && selectedTopic && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "1rem"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                border: "1px solid rgba(139,92,246,0.4)",
                borderRadius: "20px",
                padding: "2.5rem 2rem",
                maxWidth: "460px",
                width: "100%",
                boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.15)",
                textAlign: "center",
                animation: "fadeInUp 0.3s ease"
              }}>
                {/* Briefing Avatar */}
                <div style={{
                  width: "72px", height: "72px",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2.5rem", margin: "0 auto 1.25rem",
                  boxShadow: "0 0 30px rgba(124,58,237,0.5)"
                }}>🛡️</div>

                <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "#a78bfa", textTransform: "uppercase", marginBottom: "0.5rem", fontWeight: 600 }}>
                  Phase 1 Briefing · {selectedTopic.chapter.chapter}
                </p>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", margin: "0 0 1.25rem", lineHeight: 1.3 }}>
                  This is your Practice Session 🎯
                </h2>

                {/* Speech bubble */}
                <div style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  padding: "1.25rem 1.5rem",
                  marginBottom: "1.75rem",
                  textAlign: "left"
                }}>
                  <p style={{ color: "#e2e8f0", lineHeight: 1.7, margin: 0, fontSize: "0.95rem" }}>
                    Hey! Before we dive in — <strong style={{ color: "#a78bfa" }}>Attempt 1 is your warm-up</strong>. You have{" "}
                    <strong style={{ color: "#f59e0b" }}>30 questions</strong>. Take your time, read each question slowly and thoroughly.
                    No pressure. This is about learning, not speed. 
                  </p>
                  <p style={{ color: "#94a3b8", margin: "0.85rem 0 0", fontSize: "0.9rem" }}>
                    From <strong style={{ color: "#34d399" }}>Attempt 2 onwards</strong>, the real timed mock battles begin — faster, harder, exam-mode. 
                  </p>
                </div>

                {/* Checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem", textAlign: "left" }}>
                  {[
                    ["📖", "Read each question at least twice"],
                    ["🧘", "No rush — take your full time"],
                    ["❌", "Wrong answers = learning moments"],
                    ["⚡", "Real mock battle starts at Attempt 2"]
                  ].map(([icon, text]) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "0.5rem 0.75rem" }}>
                      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
                      <span style={{ color: "#cbd5e1", fontSize: "0.88rem" }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => setShowPracticeModal(false)}
                    style={{
                      flex: 1, padding: "0.85rem", borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "transparent", color: "#94a3b8",
                      cursor: "pointer", fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                  >
                    ← Go Back
                  </button>
                  <button
                    onClick={() => { 
                      localStorage.setItem(`sc_seen_modal_${selectedTopic.subject}`, "true");
                      setShowPracticeModal(false);
                      trackExamStarted("practice", course); // Firebase: exam_started
                      setExamMode(true); 
                    }}
                    style={{
                      flex: 2, padding: "0.85rem", borderRadius: "12px",
                      border: "none",
                      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      color: "#fff", cursor: "pointer",
                      fontSize: "1rem", fontWeight: 700,
                      boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                      transition: "all 0.2s"
                    }}
                  >
                    Let&apos;s Go! 
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Exam mode — renders on top as full-screen overlay */}
          {examMode && selectedTopic && (
            <div className={styles.examOverlay}>
              <ExamPractice
                userId={userId}
                exam={exam}
                course={course}
                onBack={() => setExamMode(false)}
                initialTopic={{
                  subject: selectedTopic.subject,
                  topic: selectedTopic.chapter.chapter,
                }}
                onExamComplete={(score?: number, total?: number) => {
                  trackExamCompleted("practice", score ?? 0, total ?? 0); // Firebase: exam_completed
                  fetchProgress(userId).then(updatedList => {
                    setAllProgress(updatedList);
                    // Update global stats
                    const stats = calculateGlobalStats(updatedList);
                    saveState({
                      ...user,
                      avgAccuracy: stats.avgAccuracy,
                      avgPace: stats.avgPace,
                      progressPercent: stats.progressPercent
                    });
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

