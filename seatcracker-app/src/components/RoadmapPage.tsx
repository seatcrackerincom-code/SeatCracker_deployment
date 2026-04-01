"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./RoadmapPage.module.css";

/* ─── Types ─── */
interface Chapter {
  chapter: string;
  priority?: string;
  subtopics?: string[];
  ap?: number;
  ts?: number;
  ap_questions?: string | number;
}

interface SubjectData {
  subject: string;
  chapters: Chapter[];
}

interface RoadmapTask {
  subject: string;
  topic: string;
  priority: string;
  time: string;
  completed?: boolean;
}

interface RoadmapDay {
  day: number;
  tasks: RoadmapTask[];
}

interface Props {
  userId: string;
  exam: string;
  course: string;
  onBack: () => void;
  onStartRoadmapMode: (roadmap: RoadmapDay[]) => void;
}

/* ─── Constants ─── */
const EXAM_DATES: Record<string, string> = { AP: "May 12", TS: "May 9" };
const STUDY_END: Record<string, string> = { AP: "May 7", TS: "May 4" };
const MOCK_DATES: Record<string, string> = { AP: "May 8–11", TS: "May 5–8" };

const SUBJECT_MAP: Record<string, string[]> = {
  Engineering: ["Mathematics", "Physics", "Chemistry"],
  Agriculture: ["Botany", "Zoology", "Physics", "Chemistry"],
  Pharmacy: ["Botany", "Zoology", "Physics", "Chemistry"],
};

const PRIORITIES = ["High", "Medium", "Low"];

function calcStudyDays(exam: string): number {
  const today = new Date();
  const year = today.getFullYear();
  const endDateStr = exam === "AP" ? `${year}-05-07` : `${year}-05-04`;
  const end = new Date(endDateStr);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
}

function priorityClass(p: string) {
  if (p === "High") return styles.taskHigh;
  if (p === "Medium") return styles.taskMedium;
  return styles.taskLow;
}

/* ─── Manual Roadmap Generator ─── */
function generateManualRoadmap(
  selectedTopics: Array<{ subject: string; topic: string; priority: string }>,
  totalDays: number,
  dailyHours: number,
  priorityOrder: string[],
  course: string,
  completedTopicKeys: Set<string>
): RoadmapDay[] {
  // Sort by priority order
  const orderMap: Record<string, number> = {};
  priorityOrder.forEach((p, i) => { orderMap[p] = i; });

  const sorted = [...selectedTopics].sort((a, b) =>
    (orderMap[a.priority] ?? 99) - (orderMap[b.priority] ?? 99)
  );

  const completedTasks: RoadmapTask[] = [];
  const pendingTasks: typeof sorted = [];

  sorted.forEach(t => {
    const key = `${t.subject}::${t.topic}`;
    if (completedTopicKeys.has(key)) {
      completedTasks.push({ subject: t.subject, topic: t.topic, priority: t.priority, time: "0h (Done)", completed: true });
    } else {
      pendingTasks.push(t);
    }
  });

  // Subject time ratios
  const isEngineering = course === "Engineering";
  const subjects = SUBJECT_MAP[course] || [];
  const ratios: Record<string, number> = {};
  if (isEngineering) {
    ratios["Mathematics"] = 0.50;
    ratios["Physics"] = 0.25;
    ratios["Chemistry"] = 0.25;
  } else {
    // BiPC
    subjects.forEach(s => { ratios[s] = 0.25; });
  }

  const bySubject: Record<string, typeof pendingTasks> = {};
  subjects.forEach(s => { bySubject[s] = []; });
  pendingTasks.forEach(t => {
    if (bySubject[t.subject]) bySubject[t.subject].push(t);
  });

  const totalMinPerDay = dailyHours * 60;
  const roadmap: RoadmapDay[] = [];
  
  if (completedTasks.length > 0) {
    roadmap.push({ day: 0, tasks: completedTasks }); // Use Day 0 for completed tasks
  }

  const pointers: Record<string, number> = {};
  subjects.forEach(s => { pointers[s] = 0; });

  for (let day = 1; day <= totalDays; day++) {
    const tasks: RoadmapTask[] = [];
    let scheduledAnything = false;

    // Optional: Add Mathematics at the beginning AND end for Engineering to enforce 4 topics
    const dailySubjects = isEngineering ? ["Mathematics", "Physics", "Chemistry", "Mathematics"] : subjects;

    for (let slot = 0; slot < dailySubjects.length; slot++) {
      const subject = dailySubjects[slot];
      const pool = bySubject[subject];
      let pIdx = pointers[subject];
      
      let ratio = ratios[subject] || (1 / subjects.length);
      if (isEngineering && subject === "Mathematics") {
         ratio = slot === 0 ? 0.333 : 0.167; // split the 50% into roughly 2h and 1h
      }

      const minutesForSubject = Math.round(totalMinPerDay * ratio);
      
      const topicsToTake = Math.max(1, Math.ceil(minutesForSubject / 120));
      const timePerTopic = Math.round(minutesForSubject / topicsToTake);
      
      let topicNames: string[] = [];
      let priority = "Low";
      
      for(let i = 0; i < topicsToTake; i++) {
        if (pIdx < pool.length) {
          topicNames.push(pool[pIdx].topic);
          priority = pool[pIdx].priority;
          pIdx++;
          scheduledAnything = true;
        }
      }
      
      if (topicNames.length > 0) {
        pointers[subject] = pIdx;
        const totalTimeForThisChunk = timePerTopic * topicNames.length;
        const h = Math.floor(totalTimeForThisChunk / 60);
        const m = totalTimeForThisChunk % 60;
        const timeStr = h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
        
        tasks.push({
          subject: subject,
          topic: topicNames.join(" + "),
          priority: priority,
          time: timeStr
        });
      }
    }

    if (!scheduledAnything) break;
    if (tasks.length > 0) roadmap.push({ day, tasks });
  }

  // Shift days up if day 0 exists just as visual help (we'll render Day 0 as "Already Completed")
  return roadmap;
}

/* ─── Main Component ─── */
export default function RoadmapPage({ userId, exam, course, onBack, onStartRoadmapMode }: Props) {
  const subjects = SUBJECT_MAP[course] || [];
  const totalDays = calcStudyDays(exam);
  const examLabel = exam === "AP" ? "AP EAPCET" : "TS EAMCET";

  // Config state
  const [dailyHours, setDailyHours] = useState(6);
  const [priorityOrder, setPriorityOrder] = useState<string[]>(["High", "Medium", "Low"]);
  const [mode, setMode] = useState<"smart" | "manual">("smart");
  
  // New States
  const [strategy, setStrategy] = useState<"full" | "good_score">("full");
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [activeCompletedSubject, setActiveCompletedSubject] = useState(subjects[0] || "");

  // Manual mode
  const [syllabusData, setSyllabusData] = useState<SubjectData[]>([]);
  const [activeSubject, setActiveSubject] = useState(subjects[0] || "");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());

  // Roadmap state
  const [roadmap, setRoadmap] = useState<RoadmapDay[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load from localStorage on mount (with Course-Awareness fix)
  useEffect(() => {
    const saved = localStorage.getItem("sc_roadmap");
    if (saved) {
      try { 
        const parsed = JSON.parse(saved) as RoadmapDay[];
        // Safety check: If current course is NOT Engineering, but roadmap contains Maths, clear it.
        const isNotEng = course !== "Engineering";
        const hasMaths = parsed.some(d => d.tasks.some(t => t.subject === "Mathematics"));
        
        if (isNotEng && hasMaths) {
          localStorage.removeItem("sc_roadmap");
          setRoadmap(null);
        } else {
          setRoadmap(parsed);
        }
      } catch { /* ignore */ }
    }
  }, [course]);

  // Fetch syllabus for manual mode
  useEffect(() => {
    if (mode !== "manual" || syllabusData.length > 0) return;
    Promise.all(
      subjects.map(async (subject) => {
        const url = `/SYLLABUS/${exam}/${course}/${subject}/${subject}.json`;
        const res = await fetch(url);
        if (!res.ok) return { subject, chapters: [] };
        const json = await res.json();
        const chapters: Chapter[] = Array.isArray(json) ? json : json.chapters;
        return { subject, chapters };
      })
    ).then(setSyllabusData).catch(() => {});
  }, [mode, exam, course, subjects, syllabusData.length]);

  // Priority reorder
  const movePriority = (idx: number, dir: -1 | 1) => {
    const next = [...priorityOrder];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setPriorityOrder(next);
  };

  // Topic toggle
  const toggleTopic = (key: string) => {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleCompletedTopic = (key: string) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const activeChapters = syllabusData.find(d => d.subject === activeSubject)?.chapters || [];
  const activeCompletedChapters = syllabusData.find(d => d.subject === activeCompletedSubject)?.chapters || [];

  // Build topic list for query
  const buildTopicList = useCallback(() => {
    if (mode === "manual") {
      const list: Array<{ subject: string; topic: string; priority: string }> = [];
      syllabusData.forEach(sd => {
        sd.chapters.forEach(ch => {
          const key = `${sd.subject}::${ch.chapter}`;
          if (selectedTopics.has(key)) {
            list.push({ subject: sd.subject, topic: ch.chapter, priority: ch.priority || "Low" });
          }
        });
      });
      return list;
    }
    // Smart mode — send full syllabus
    const list: Array<{ subject: string; topic: string; priority: string }> = [];
    subjects.forEach(sub => {
      const dat = syllabusData.find(d => d.subject === sub);
      if (dat) {
        dat.chapters.forEach(ch => {
          list.push({ subject: sub, topic: ch.chapter, priority: ch.priority || "Low" });
        });
      }
    });
    return list;
  }, [mode, syllabusData, selectedTopics, subjects]);

  // For smart mode, we need syllabus loaded first
  const ensureSyllabus = (): Promise<SubjectData[]> => {
    if (syllabusData.length > 0) return Promise.resolve(syllabusData);
    return Promise.all(
      subjects.map(async (subject) => {
        const url = `/SYLLABUS/${exam}/${course}/${subject}/${subject}.json`;
        const res = await fetch(url);
        if (!res.ok) return { subject, chapters: [] };
        const json = await res.json();
        const chapters: Chapter[] = Array.isArray(json) ? json : json.chapters;
        return { subject, chapters };
      })
    ).then(data => { setSyllabusData(data); return data; });
  };

  const handleGenerate = async () => {
    setError("");
    setLoading(true);

    try {
      let topicList: Array<{ subject: string; topic: string; priority: string }> = [];

      if (mode === "manual") {
        topicList = buildTopicList();
        if (topicList.length === 0) {
          setError("Please select at least one topic.");
          setLoading(false);
          return;
        }
        const result = generateManualRoadmap(topicList, totalDays, dailyHours, priorityOrder, course, completedTopics);
        setRoadmap(result);
        localStorage.setItem("sc_roadmap", JSON.stringify(result));
      } else {
        // Smart mode - call API
        const data = await ensureSyllabus();
        const fullTopics: Array<{ subject: string; topic: string; priority: string }> = [];
        data.forEach(sd => {
          sd.chapters.forEach(ch => {
            fullTopics.push({ subject: sd.subject, topic: ch.chapter, priority: ch.priority || "Low" });
          });
        });

        const res = await fetch("/api/ai-roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            syllabus: fullTopics,
            total_days: totalDays,
            daily_hours: dailyHours,
            priority_order: priorityOrder,
            course,
            strategy,
            completed_topics: Array.from(completedTopics)
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "AI failed");
        setRoadmap(json.roadmap);
        localStorage.setItem("sc_roadmap", JSON.stringify(json.roadmap));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRoadmap(null);
    localStorage.removeItem("sc_roadmap");
    setError("");
  };

  // Download roadmap
  const handleDownload = () => {
    if (!roadmap) return;
    let text = `SeatCracker — ${examLabel} (${course}) Study Roadmap\n`;
    text += `Generated: ${new Date().toLocaleDateString()}\n`;
    text += `Daily Hours: ${dailyHours}h | Priority Order: ${priorityOrder.join(" → ")}\n\n`;
    roadmap.forEach(day => {
      text += `─── Day ${day.day} ───\n`;
      day.tasks.forEach(t => {
        text += `  [${t.priority}] ${t.subject}: ${t.topic} (${t.time})\n`;
      });
      text += "\n";
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seatcracker-roadmap-${exam}-${course}.txt`.toLowerCase();
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalHours = roadmap ? roadmap.reduce((acc, d) => {
    return acc + d.tasks.reduce((s, t) => {
      const match = t.time.match(/(\d+)h/);
      return s + (match ? parseInt(match[1]) : 0);
    }, 0);
  }, 0) : 0;

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backBtn} onClick={onBack} id="roadmap-back-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          {roadmap && (
            <button className={styles.downloadBtn} onClick={handleDownload} id="roadmap-download-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </button>
          )}
        </div>

        <div className={styles.headerBody}>
          <span className={styles.examBadge}>{examLabel} · {course}</span>
          <h1 className={styles.pageTitle}>Study Roadmap</h1>
          <div className={styles.infoBanner}>
            <span className={styles.infoChip}>📅 Exam: <strong>{EXAM_DATES[exam]}</strong></span>
            <span className={styles.infoChip}>📚 Study till: <strong>{STUDY_END[exam]}</strong></span>
            <span className={styles.infoChip}>🧪 Mocks: <strong>{MOCK_DATES[exam]}</strong></span>
            <span className={styles.infoChip}>⏳ <strong>{totalDays} days</strong> left</span>
          </div>
        </div>
      </header>

      {/* Config or Roadmap */}
      {!roadmap && !loading && (
        <div className={styles.configPanel}>

          {/* Daily hours */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>⏱ Daily Study Hours</p>
            <div className={styles.hoursRow}>
              <button className={styles.hoursBtn} onClick={() => setDailyHours(h => Math.max(1, h - 1))} id="hours-dec">−</button>
              <span className={styles.hoursValue}>{dailyHours}</span>
              <button className={styles.hoursBtn} onClick={() => setDailyHours(h => Math.min(16, h + 1))} id="hours-inc">+</button>
              <span className={styles.hoursLabel}>hours / day</span>
            </div>
          </div>

          {/* Priority order */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>🎯 Priority Order <span style={{ fontSize: "10px", fontWeight: 400, textTransform: "none", marginLeft: 4 }}>(drag order via arrows)</span></p>
            <div className={styles.priorityList}>
              {priorityOrder.map((p, i) => (
                <div key={p} className={styles.priorityItem}>
                  <div className={styles.priorityLeft}>
                    <span className={styles.priorityIndex}>{i + 1}</span>
                    <span className={`${styles.priorityLabel} ${styles[p as keyof typeof styles]}`}>{p}</span>
                  </div>
                  <div className={styles.priorityArrows}>
                    <button className={styles.arrowBtn} onClick={() => movePriority(i, -1)} disabled={i === 0} id={`priority-up-${i}`}>▲</button>
                    <button className={styles.arrowBtn} onClick={() => movePriority(i, 1)} disabled={i === priorityOrder.length - 1} id={`priority-down-${i}`}>▼</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mode selection */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>⚡ Mode</p>
            <div className={styles.modeToggle}>
              <button
                className={`${styles.modeBtn} ${mode === "smart" ? styles.modeActive : ""}`}
                onClick={() => setMode("smart")}
                id="mode-smart"
              >
                <span className={styles.modeEmoji}>🤖</span>
                Smart Mode
                <span className={styles.modeDesc}>AI-powered via Groq</span>
              </button>
              <button
                className={`${styles.modeBtn} ${mode === "manual" ? styles.modeActive : ""}`}
                onClick={() => setMode("manual")}
                id="mode-manual"
              >
                <span className={styles.modeEmoji}>✋</span>
                Manual Mode
                <span className={styles.modeDesc}>Pick your own topics</span>
              </button>
            </div>
          </div>

          {/* Strategy Selection (Smart Only) */}
          {mode === "smart" && (
            <div className={styles.card}>
              <p className={styles.cardTitle}>♟️ Preparation Strategy</p>
              <div className={styles.modeToggle}>
                <button
                  className={`${styles.modeBtn} ${strategy === "full" ? styles.modeActive : ""}`}
                  onClick={() => setStrategy("full")}
                >
                  <span className={styles.modeEmoji}>📚</span>
                  Full Syllabus
                  <span className={styles.modeDesc}>Cover everything</span>
                </button>
                <button
                  className={`${styles.modeBtn} ${strategy === "good_score" ? styles.modeActive : ""}`}
                  onClick={() => setStrategy("good_score")}
                >
                  <span className={styles.modeEmoji}>🎯</span>
                  Good Score
                  <span className={styles.modeDesc}>Skip low yield topics if tight</span>
                </button>
              </div>
            </div>
          )}

          {/* Warning System */}
          {(() => {
            const totalSyllabusTopics = subjects.reduce((acc, sub) => acc + (syllabusData.find(d => d.subject === sub)?.chapters.length || 0), 0);
            const remainingToLearn = totalSyllabusTopics > 0 ? totalSyllabusTopics - completedTopics.size : 0;
            const requiredHours = remainingToLearn * 1.5; // Approx 1.5h per topic
            const availableHours = totalDays * dailyHours;
            
            if (totalSyllabusTopics > 0 && strategy === "full" && requiredHours > availableHours + 10) {
              return (
                <div className={styles.errorState} style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                  <p className={styles.errorTitle} style={{ color: "#f59e0b" }}>⚠️ Time Warning: Tight Schedule</p>
                  <p className={styles.errorMsg} style={{ color: "rgba(255,255,255,0.8)" }}>
                    You have ~{availableHours} study hours left, but covering the remaining {remainingToLearn} topics requires ~{Math.round(requiredHours)}h. 
                    Consider switching to <strong>Good Score</strong> strategy or increasing your daily hours!
                  </p>
                </div>
              );
            }
            return null;
          })()}

          {/* Completed Topics Selector */}
          <div className={styles.card} onClick={() => { if (syllabusData.length === 0) ensureSyllabus() }}>
            <p className={styles.cardTitle}>✅ Already Completed Topics <span style={{ fontSize: "10px", fontWeight: 400, textTransform: "none", marginLeft: 4 }}>(Optional)</span></p>
            {syllabusData.length === 0 ? (
               <button onClick={ensureSyllabus} style={{ background: "var(--bg-card)", color: "var(--text-light)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", cursor: "pointer", width: "100%" }}>Load Chapters...</button>
            ) : (
              <>
                <div className={styles.subjectTabs}>
                  {subjects.map(s => (
                    <button
                      key={s}
                      className={`${styles.subjectTab} ${activeCompletedSubject === s ? styles.subjectTabActive : ""}`}
                      onClick={() => setActiveCompletedSubject(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className={styles.topicGrid} style={{ maxHeight: "200px", overflowY: "auto", borderTop: "1px solid var(--border)" }}>
                  {activeCompletedChapters.map(ch => {
                    const key = `${activeCompletedSubject}::${ch.chapter}`;
                    const isSelected = completedTopics.has(key);
                    return (
                      <button
                        key={key}
                        className={`${styles.topicItem} ${isSelected ? styles.topicSelected : ""}`}
                        onClick={() => toggleCompletedTopic(key)}
                        style={isSelected ? { borderColor: "#10b981", background: "rgba(16, 185, 129, 0.1)" } : {}}
                      >
                        <span className={styles.topicCheck} style={isSelected ? { borderColor: "#10b981", background: "#10b981" } : {}}>
                          {isSelected && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </span>
                        <span style={{ flex: 1, textAlign: "left", fontSize: "11px", color: isSelected ? "#10b981" : "var(--text-main)"}}>{ch.chapter}</span>
                      </button>
                    );
                  })}
                </div>
                <p className={styles.selectionInfo}>{completedTopics.size} marked as completed.</p>
              </>
            )}
          </div>

          {/* Manual topic picker */}
          {mode === "manual" && (
            <div className={styles.card}>
              <p className={styles.cardTitle}>📖 Select Topics to Learn</p>
              <div className={styles.subjectTabs}>
                {subjects.map(s => (
                  <button
                    key={s}
                    className={`${styles.subjectTab} ${activeSubject === s ? styles.subjectTabActive : ""}`}
                    onClick={() => setActiveSubject(s)}
                    id={`subject-tab-${s.toLowerCase()}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className={styles.topicGrid}>
                {activeChapters.map(ch => {
                  const key = `${activeSubject}::${ch.chapter}`;
                  const isSelected = selectedTopics.has(key);
                  // Hide if completed
                  if (completedTopics.has(key)) return null;

                  return (
                    <button
                      key={key}
                      className={`${styles.topicItem} ${isSelected ? styles.topicSelected : ""}`}
                      onClick={() => toggleTopic(key)}
                      id={`topic-${key.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      <span className={styles.topicCheck}>
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </span>
                      <span style={{ flex: 1, textAlign: "left" }}>{ch.chapter}</span>
                      <span className={`${styles.topicPriority} ${styles[ch.priority as keyof typeof styles] || ""}`}>
                        {ch.priority || "Low"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className={styles.selectionInfo}>{selectedTopics.size} topic{selectedTopics.size !== 1 ? "s" : ""} selected for generation.</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={styles.errorState}>
              <p className={styles.errorTitle}>⚠️ Error</p>
              <p className={styles.errorMsg}>{error}</p>
            </div>
          )}

          {/* Generate */}
          <button
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={loading}
            id="generate-roadmap-btn"
          >
            {loading ? "Generating…" : `Generate ${mode === "smart" ? "AI" : "Manual"} Roadmap →`}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>{mode === "smart" ? "AI is building your roadmap…" : "Generating roadmap…"}</p>
          <p className={styles.loadingSubtext}>{mode === "smart" ? "This may take 15–30 seconds" : "Distributing topics across days"}</p>
        </div>
      )}

      {/* Roadmap Display */}
      {roadmap && !loading && (
        <div className={styles.roadmapSection}>
          {/* START PREPARING CTA */}
          <div style={{
            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            borderRadius: 16,
            padding: "20px 18px",
            marginBottom: 16,
            textAlign: "center",
            boxShadow: "0 8px 28px rgba(108,99,255,0.35)"
          }}>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>
              🎓 Your personalized roadmap is ready!
            </p>
            <button
              id="start-preparing-btn"
              onClick={() => onStartRoadmapMode(roadmap)}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: "#fff",
                color: "#6c63ff",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "0.01em",
                transition: "transform 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              🚀 Start Preparing →
            </button>
          </div>

          <div className={styles.roadmapMeta}>
            <span className={styles.roadmapCount}>{roadmap.length} days · ~{totalHours}h total</span>
            <button className={styles.resetBtn} onClick={handleReset} id="roadmap-reset-btn">↺ Regenerate</button>
          </div>

          {roadmap.map(day => {
            const isDayZero = day.day === 0;
            const dayTotal = day.tasks.reduce((s, t) => {
              if (t.completed) return s;
              const h = t.time.match(/(\d+)h/)?.[1] || "0";
              const m = t.time.match(/(\d+)m/)?.[1] || "0";
              return s + parseInt(h) * 60 + parseInt(m);
            }, 0);
            const dayHStr = dayTotal >= 60
              ? `${Math.floor(dayTotal / 60)}h ${dayTotal % 60 > 0 ? dayTotal % 60 + "m" : ""}`
              : `${dayTotal}m`;

            return (
              <div key={day.day} className={styles.dayCard} id={`day-${day.day}`} style={isDayZero ? { border: "1px dashed #10b981", background: "rgba(16, 185, 129, 0.03)" } : {}}>
                <div className={styles.dayHeader}>
                  <span className={styles.dayLabel} style={isDayZero ? { color: "#10b981" } : {}}>
                    {isDayZero ? "Already Completed ✅" : `Day ${day.day}`}
                  </span>
                  <div className={styles.dayStats}>
                    <span className={styles.dayStat}>{day.tasks.length} topics</span>
                    {!isDayZero && <span className={styles.dayStat}>{dayHStr}</span>}
                  </div>
                </div>
                <div className={styles.taskList}>
                  {day.tasks.map((task, ti) => (
                    <div key={ti} className={`${styles.taskRow} ${task.completed ? "" : priorityClass(task.priority)}`} style={task.completed ? { opacity: 0.7, borderColor: "#10b981", background: "rgba(16, 185, 129, 0.1)" } : {}}>
                      <span className={styles.taskSubject} style={task.completed ? { color: "#10b981", borderColor: "rgba(16, 185, 129, 0.3)" } : {}}>{task.subject.slice(0, 4).toUpperCase()}</span>
                      <span className={styles.taskTopic} style={task.completed ? { textDecoration: "line-through", color: "#10b981" } : {}}>{task.topic}</span>
                      <span className={styles.taskTime} style={task.completed ? { color: "#10b981" } : {}}>{task.completed ? "Done ✅" : task.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
