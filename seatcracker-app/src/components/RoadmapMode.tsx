"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import styles from "./RoadmapMode.module.css";
import ExamPractice from "./ExamPractice";

/* ─── Types ─── */
interface RoadmapTask {
  subject: string;
  topic: string;
  priority: string;
  time: string;
  completed?: boolean;
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

interface RoadmapDay {
  day: number;
  tasks: RoadmapTask[];
}

interface Props {
  userId: string;
  exam: string;
  course: string;
  roadmap: RoadmapDay[];
  onBack: () => void;
}

type Screen =
  | { kind: "map" }
  | { kind: "day"; dayNum: number }
  | { kind: "topic"; dayNum: number; subject: string; topic: string; priority: string; subtopics?: string[] }
  | { kind: "test"; dayNum: number; subject: string; topic: string }
  | { kind: "result"; dayNum: number; subject: string; topic: string; correct: number; total: number; elapsed: number; qTimes: number[] };



/* ─── Confetti colours ─── */
const CONFETTI_COLORS = ["#6c63ff", "#a78bfa", "#f59e0b", "#10b981", "#f87171", "#fbbf24", "#60a5fa"];

/* ─── Helpers ─── */
const LS_KEY_CURRENT    = "sc_rm_current_day";
const LS_KEY_COMPLETED  = "sc_rm_completed_days";
const LS_KEY_TOPIC_DONE = (day: number, topic: string) => `sc_rm_td_${day}_${topic.replace(/\s+/g, "_")}`;

function fmtTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const MOTIVATIONS = [
  "You Got This!", "Keep Going!", "Almost There!", "Speed Up!", "Nice Work!",
  "Unstoppable!", "Great Job!", "Stay Focused!", "Success Awaits!", "Power Up!"
];

function getMotivation(day: number) {
  return MOTIVATIONS[day % MOTIVATIONS.length];
}

export default function RoadmapMode({ userId, exam, course, roadmap, onBack }: Props) {
  const [screen, setScreen]            = useState<Screen>({ kind: "map" });
  const [currentDay, setCurrentDay]    = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [celebrating, setCelebrating]  = useState<number | null>(null); // level number
  const [confettis, setConfettis]      = useState<{ id: number; x: number; color: string; delay: number; size: number }[]>([]);
  const [formulas, setFormulas]        = useState<Formula[]>([]);
  const [loadingFormulas, setLoadingFormulas] = useState(false);

  /* exam state — replaces dummy MCQ test */
  const [examMode, setExamMode]       = useState(false);
  const [examCount, setExamCount]     = useState<number>(15);
  const [examSubject, setExamSubject] = useState("");
  const [examTopic, setExamTopic]     = useState("");
  const [examDayNum, setExamDayNum]   = useState(0);

  /* node refs for tracking */
  const pathRef  = useRef<HTMLDivElement | null>(null);

  /* ── Manage Body Class ── */
  useEffect(() => {
    document.body.classList.add("roadmap-active");
    return () => {
      document.body.classList.remove("roadmap-active");
    };
  }, []);

  /* ── Load localStorage ── */
  useEffect(() => {
    const cd  = parseInt(localStorage.getItem(LS_KEY_CURRENT) || "1");
    const cds = JSON.parse(localStorage.getItem(LS_KEY_COMPLETED) || "[]") as number[];
    setCurrentDay(isNaN(cd) ? 1 : cd);
    setCompletedDays(cds);

    // rebuild completedTopics from localStorage
    const doneSet = new Set<string>();
    roadmap.forEach(d => {
      d.tasks.forEach(t => {
        if (t.completed || localStorage.getItem(LS_KEY_TOPIC_DONE(d.day, t.topic)) === "1") {
          doneSet.add(`${d.day}::${t.topic}`);
          if (t.completed) {
            localStorage.setItem(LS_KEY_TOPIC_DONE(d.day, t.topic), "1");
          }
        }
      });
    });
    setCompletedTopics(doneSet);
  }, [roadmap]);

  const totalDays = roadmap.length;
  const completedPct = totalDays > 0 ? Math.round((completedDays.length / totalDays) * 100) : 0;

  /* ── Auto-scroll to current active level ── */
  useEffect(() => {
    if (screen.kind === "map") {
      // Allow DOM to paint slightly before measuring and jumping
      setTimeout(() => {
        const activeElement = document.getElementById(`level-node-${currentDay}`);
        if (activeElement) {
          const topBarOffset = 180; // approximate height of header and progress
          const y = activeElement.getBoundingClientRect().top + window.scrollY - topBarOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
      }, 100);
    }
  }, [screen.kind, currentDay]);

  /* ── Level state helper ── */
  const getDayState = useCallback(
    (dayNum: number): "completed" | "current" | "locked" => {
      if (completedDays.includes(dayNum)) return "completed";
      if (dayNum === currentDay) return "current";
      return "locked";
    },
    [completedDays, currentDay]
  );

  /* ── Topic completion ── */
  const markTopicDone = (dayNum: number, topic: string) => {
    const key = `${dayNum}::${topic}`;
    setCompletedTopics(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    localStorage.setItem(LS_KEY_TOPIC_DONE(dayNum, topic), "1");
  };

  const isTopicDone = (dayNum: number, topic: string) =>
    completedTopics.has(`${dayNum}::${topic}`);

  /* ── Check if all topics in a level are done ── */
  const isDayReadyToComplete = (dayNum: number) => {
    const dayData = roadmap.find(d => d.day === dayNum);
    if (!dayData) return false;
    const allTopics = dayData.tasks.flatMap(t => t.topic.split(" + ").map(s => s.trim()));
    return allTopics.every(t => isTopicDone(dayNum, t));
  };

  /* ── Complete a level ── */
  const completeDay = (dayNum: number) => {
    const nextCompleted = [...completedDays, dayNum];
    setCompletedDays(nextCompleted);
    localStorage.setItem(LS_KEY_COMPLETED, JSON.stringify(nextCompleted));

    const nextDay = dayNum + 1;
    if (nextDay <= totalDays) {
      setCurrentDay(nextDay);
      localStorage.setItem(LS_KEY_CURRENT, String(nextDay));
      // Celebrate AFTER animation to next node finishes
      setTimeout(() => {
        setCelebrating(dayNum);
        launchConfetti();
      }, 700);
    } else {
      setCelebrating(dayNum);
      launchConfetti();
    }
  };

  /* ── Confetti ── */
  const launchConfetti = () => {
    const pieces = Array.from({ length: 90 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
    }));
    setConfettis(pieces);
    setTimeout(() => setConfettis([]), 3500);
  };

  /* ── Test handlers ── */
  const startTest = (subject: string, topic: string, dayNum: number) => {
    setExamSubject(subject);
    setExamTopic(topic);
    setExamDayNum(dayNum);
    setExamMode(true);
  };

  /* ── Normalization Helper ── */
  const normalize = (s: string) => s.replace(/[^A-Z0-9]/gi, "").toUpperCase();

  /* ── Formula Fetching ── */
  useEffect(() => {
    if (screen.kind !== "topic") {
      setFormulas([]);
      return;
    }

    const { subject, topic } = screen;
    const fileBase = subject.toLowerCase().includes("math") ? "maths" : subject.toLowerCase();
    const url = `/SYLLABUS/formulas/${fileBase}.json`;

    setLoadingFormulas(true);
    fetch(url)
      .then(res => res.json())
      .then((data: TopicFormulas[]) => {
        const normTopic = normalize(topic);
        const found = data.find(t => normalize(t.topic_name) === normTopic);
        setFormulas(found ? found.formulas : []);
        setLoadingFormulas(false);
      })
      .catch(() => {
        setFormulas([]);
        setLoadingFormulas(false);
      });
  }, [screen]);

  /* ── Navigation ── */
  const goBack = () => {
    if (screen.kind === "result" || screen.kind === "test") {
      setScreen({ kind: "topic", dayNum: screen.dayNum, subject: screen.subject, topic: screen.topic, priority: "" });
      return;
    }
    if (screen.kind === "topic") {
      setScreen({ kind: "day", dayNum: screen.dayNum });
      return;
    }
    if (screen.kind === "day") {
      setScreen({ kind: "map" });
      return;
    }
    onBack();
  };

  /* ────────────────────────────────────────────
     RENDER: MAP (Level Journey)
  ──────────────────────────────────────────── */
  if (screen.kind === "map") {
    // Generate curved path data
    const nodes = [...roadmap].reverse();
    const generatePath = () => {
      if (nodes.length < 2) return "";
      let d = "";
      const nodeSpacing = 280; // matches .levelBlock height
      const width = typeof window !== "undefined" ? Math.min(window.innerWidth, 600) : 600;
      const xLeft = width * 0.25;
      const xRight = width * 0.75;

      nodes.forEach((_, i) => {
        const y = i * nodeSpacing + 140; // center of block
        const x = (nodes.length - 1 - i) % 2 === 0 ? xRight : xLeft;
        
        if (i === 0) {
          d += `M ${x} ${y}`;
        } else {
          const prevY = (i - 1) * nodeSpacing + 140;
          const prevX = (nodes.length - 1 - (i - 1)) % 2 === 0 ? xRight : xLeft;
          const cpY = (y + prevY) / 2;
          d += ` C ${prevX} ${cpY}, ${x} ${cpY}, ${x} ${y}`;
        }
      });
      return d;
    };

    return (
      <div className={styles.wrapper}>
        <div className={styles.spaceBg} />
        <div className={styles.bgOverlay} />

        {/* Top Bar (Exact Match to Image) */}
        <div className={styles.roadmapTopBar}>
          <button className={styles.headerBackBtn} onClick={onBack} id="roadmap-top-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
          <h1 className={styles.courseTitle}>{course || "Engineering"}</h1>
          <button className={styles.settingsBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* Top Progress Section */}
        <div className={styles.roadmapProgressHeader}>
          <div className={styles.progressTopRow}>
            <span className={styles.daysLeft}>Days Left: <span className={styles.highlight}>{totalDays - completedDays.length}</span></span>
          </div>
          <div className={styles.mainProgressBar}>
            <motion.div 
              className={styles.mainProgressFill} 
              initial={{ width: 0 }}
              animate={{ width: `${completedPct}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {completedDays.length}/{totalDays} days completed : {completedPct}%
          </span>
        </div>

        <div className={styles.pathSection}>
          <div className={styles.pathInner} ref={pathRef}>
            {/* SVG Background Path */}
            <svg className={styles.svgPathContainer} preserveAspectRatio="none">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path 
                d={generatePath()} 
                className={styles.roadmapPathLine}
                filter="url(#glow)"
              />

              {[...Array(nodes.length * 4)].map((_, i) => (
                <circle key={i} r="2.5" className={styles.pathParticle}>
                  <animateMotion 
                    dur={`${8 + Math.random() * 8}s`} 
                    repeatCount="indefinite" 
                    path={generatePath()} 
                    rotate="auto"
                    begin={`-${Math.random() * 20}s`}
                  />
                </circle>
              ))}
            </svg>

            {nodes.map((dayData, idx) => {
              const state = getDayState(dayData.day);
              const isLeft = (dayData.day) % 2 !== 0; 
              const isChar = dayData.day === currentDay;

              return (
                <div key={dayData.day} className={styles.levelBlock}>
                  <div className={`${styles.stepRow} ${isLeft ? styles.alignLeft : styles.alignRight}`}>
                    <div
                      className={`${styles.dayNode} ${styles[state]}`}
                      onClick={() => state !== "locked" && setScreen({ kind: "day", dayNum: dayData.day })}
                      id={`level-node-${dayData.day}`}
                    >
                      <span className={styles.nodeLabel}>Day {dayData.day}</span>
                      <span className={styles.nodeMeta}>{dayData.tasks.length} topics</span>

                      {isChar && (
                        <motion.div
                          layoutId="charAvatarAnim"
                          className={styles.characterAvatar}
                          initial={false}
                          transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        >
                          <img src="/character-avatar.png" alt="Explorer" />
                        </motion.div>
                      )}

                      <div className={styles.nodeIcon}>
                        {state === "completed" ? "✓" : state === "locked" ? (
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                        ) : null}
                      </div>

                      <div className={styles.tagRow}>
                        {state === "completed" ? (
                          dayData.tasks.slice(0, 3).map((t, ti) => {
                            const isMath = t.subject.toLowerCase().includes("math");
                            const isPhys = t.subject.toLowerCase().includes("phys");
                            const tagClass = isMath ? styles.compMath : isPhys ? styles.compPhys : styles.compChem;
                            return (
                              <span key={ti} className={`${styles.topicPill} ${tagClass}`}>
                                {t.topic}
                              </span>
                            );
                          })
                        ) : (
                          ["Math", "Phys", "Chem"].map(s => {
                            const sc = s.toLowerCase();
                            const tagClass = sc.includes("math") ? styles.tagMath : sc.includes("phys") ? styles.tagPhys : styles.tagChem;
                            return <span key={s} className={`${styles.topicPill} ${tagClass}`}>{s}</span>;
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Celebration popup */}
        {celebrating !== null && (
          <div className={styles.celebOverlay}>
            <div className={styles.celebCard}>
              <span className={styles.celebEmoji}>🎉</span>
              <h2 className={styles.celebTitle}>Level {celebrating} Completed!</h2>
              <p className={styles.celebSub}>
                You're on fire! 🔥 Keep your momentum — Level {celebrating + 1} is now unlocked.
              </p>
              <button
                className={styles.celebBtn}
                onClick={() => { setCelebrating(null); }}
                id="celeb-continue-btn"
              >
                Continue Journey →
              </button>
            </div>
          </div>
        )}

        {/* Confetti */}
        {confettis.length > 0 && (
          <div className={styles.confettiWrap}>
            {confettis.map(c => (
              <div
                key={c.id}
                className={styles.confettiPiece}
                style={{
                  left: `${c.x}%`,
                  top: 0,
                  backgroundColor: c.color,
                  width: c.size,
                  height: c.size,
                  animationDelay: `${c.delay}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ────────────────────────────────────────────
     RENDER: DAY VIEW (Now 'Level View')
  ──────────────────────────────────────────── */
  if (screen.kind === "day") {
    const dayData = roadmap.find(d => d.day === screen.dayNum)!;
    const state   = getDayState(screen.dayNum);
    const readyToComplete = isDayReadyToComplete(screen.dayNum);
    const alreadyCompleted = completedDays.includes(screen.dayNum);

    const bySubject: Record<string, { topic: string; priority: string }[]> = {};
    dayData.tasks.forEach(t => {
      if (!bySubject[t.subject]) bySubject[t.subject] = [];
      t.topic.split(" + ").forEach(tp => {
        bySubject[t.subject].push({ topic: tp.trim(), priority: t.priority });
      });
    });

    return (
      <div className={styles.dayView}>
        <header className={styles.dayViewBar}>
          <button className={styles.backBtn} onClick={goBack} id="day-view-back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Map
          </button>
          <h1 className={styles.dayViewTitle}>✨ Level {screen.dayNum}</h1>
          {alreadyCompleted && (
            <span style={{ fontSize: 13, color: "var(--success)", fontWeight: 700 }}>✅ Done</span>
          )}
        </header>

        <div className={styles.dayViewContent}>
          {Object.entries(bySubject).map(([subject, topics]) => (
            <div key={subject} className={styles.subjectSection}>
              <div className={styles.subjectName}>{subject}</div>
              {topics.map(({ topic, priority }) => {
                const done = isTopicDone(screen.dayNum, topic);
                return (
                  <button
                    key={topic}
                    className={`${styles.topicCardBtn} ${done ? styles.topicDone : ""}`}
                    onClick={() =>
                      setScreen({
                        kind: "topic",
                        dayNum: screen.dayNum,
                        subject,
                        topic,
                        priority,
                      })
                    }
                    id={`topic-btn-${topic.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    <span className={`${styles.topicDot} ${priority.toLowerCase()}`} />
                    <span className={styles.topicCardName}>{topic}</span>
                    <div className={styles.topicCardRight}>
                      <span className={`${styles.topicPriBadge} ${priority.toLowerCase()}`}>{priority}</span>
                      {done && <span className={styles.topicDoneCheck}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          {!alreadyCompleted && state === "current" && (
            <button
              className={styles.completeBtn}
              disabled={!readyToComplete}
              onClick={() => completeDay(screen.dayNum)}
              id="complete-day-btn"
            >
              {readyToComplete
                ? "🚀 Complete Level & Move Target"
                : `Complete all topics to unlock (${Object.values(bySubject).flat().filter(t => isTopicDone(screen.dayNum, t.topic)).length}/${Object.values(bySubject).flat().length} done)`}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────────
     RENDER: TOPIC VIEW
  ──────────────────────────────────────────── */
  if (screen.kind === "topic") {
    const done = isTopicDone(screen.dayNum, screen.topic);

    const handleMarkDone = () => {
      markTopicDone(screen.dayNum, screen.topic);
      setScreen({ kind: "day", dayNum: screen.dayNum });
    };

    return (
      <div className={styles.topicView}>
        <header className={styles.topicViewBar}>
          <button className={styles.backBtn} onClick={goBack} id="topic-view-back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Level {screen.dayNum}
          </button>
          <div className={styles.topicViewBarTitle}>
            <div className={styles.topicViewExam}>{screen.subject}</div>
            <h1 className={styles.topicViewName}>{screen.topic}</h1>
          </div>
        </header>

        <div className={styles.topicViewContent}>
          <div className={`${styles.priBadge} ${screen.priority.toLowerCase() || 'medium'}`}>
            {screen.priority || 'Medium'} Priority
          </div>

          <div className={styles.theoryCard}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Theory Overview
            </h3>
            <p>
              This section covers the fundamental concepts of{" "}
              <strong>{screen.topic}</strong> as part of {screen.subject} in EAMCET {exam}{" "}
              preparation. Understanding these concepts will help you solve problems
              efficiently.
            </p>
            {screen.subtopics && screen.subtopics.length > 0 && (
              <ul className={styles.subtopicList}>
                {screen.subtopics.map((st, i) => <li key={i}>{st}</li>)}
              </ul>
            )}
          </div>

          <div className={styles.formulaCard}>
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              Important Formulas
            </h3>
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
                <div className={styles.formulaItem}>
                  <code>No formulas found</code>
                  <span>Check back later</span>
                </div>
              </div>
            )}
          </div>

          <button className={styles.youtubeBtn}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
             Watch on YouTube
          </button>

          <div className={styles.aiCard}>
            <div>
              <p className={styles.aiLabel}>🤖 AI Teacher Check</p>
              <p className={styles.aiSub}>Test your understanding with a real EAMCET exam.</p>
            </div>



            <button
              className={styles.startTestBtn}
              onClick={() => startTest(screen.subject, screen.topic, screen.dayNum)}
            >
              Attempt Test →
            </button>
          </div>

          <button
            className={`${styles.markDoneBtn} ${done ? styles.alreadyDone : ""}`}
            onClick={done ? undefined : handleMarkDone}
            id="mark-done-btn"
          >
            {done ? "✅ Topic Completed" : "✅ Mark as Done"}
          </button>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────────
     RENDER: EXAM MODE (full-screen ExamPractice overlay)
  ──────────────────────────────────────────── */
  if (examMode) {
    return (
      <ExamPractice
        userId={userId}
        exam={exam}
        course={course}
        onBack={() => setExamMode(false)}
        initialTopic={{ subject: examSubject, topic: examTopic }}
        onExamComplete={(correct) => {
          // Always mark topic done on attempt completion since threshold is removed
          if (examDayNum > 0) {
            markTopicDone(examDayNum, examTopic);
          }
          setExamMode(false);
        }}
      />
    );
  }

  return null;
}
