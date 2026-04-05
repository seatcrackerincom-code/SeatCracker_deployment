"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ExamPractice.module.css";
import { saveProgress, fetchProgress, type UserProgress } from "../lib/supabase";
import { getBaseTime, getAttemptTargetTime } from "../utils/timer_mapping";



// ─── Types ───────────────────────────────────────────────────────────────────
interface RawQuestion {
  question: string;
  difficulty: "Medium" | "Hard";
  pyq?: boolean;
  hasDiagram: boolean;
  diagram_description: string;
  options: { A: string; B: string; C: string; D: string };
  answer: "A" | "B" | "C" | "D";
}

interface Question extends RawQuestion {
  originalIndex: number;
}

type QState = "unanswered" | "answered" | "marked" | "answeredMarked";

interface QuestionStatus {
  selectedOption: "A" | "B" | "C" | "D" | null;
  isAnswered: boolean;
  isMarkedForReview: boolean;
}

interface Chapter {
  chapter: string;
  priority?: string;
  subtopics?: string[];
}

interface SubjectData {
  subject: string;
  chapters: Chapter[];
}

interface Props {
  userId: string;
  exam: string;
  course: string;
  onBack: () => void;
  // Pre-select topic in setup screen
  initialTopic?: { subject: string; topic: string };
  // Called after exam finishes so parent can react
  onExamComplete?: (correct: number, total: number, elapsed: number, seenIds: number[]) => void;
}

type Screen = "setup" | "exam" | "confirmation" | "result";

const SUBJECT_MAP: Record<string, string[]> = {
  Engineering: ["Mathematics", "Physics", "Chemistry"],
  Agriculture: ["Botany", "Zoology", "Physics", "Chemistry"],
  Pharmacy: ["Botany", "Zoology", "Physics", "Chemistry"],
};

const PRIORITY_MULTIPLIER: Record<string, number> = {
  High: 1.2,
  Medium: 1.0,
  Low: 0.8,
};

const ATTEMPT_MODES: Record<number, { label: string; tag: string; color: string }> = {
  1: { label: "Learning Mode", tag: "It's Learning Time! 📖", color: "#3b82f6" },
  2: { label: "Controlled Mode", tag: "It's Controlled Mode ⏱️", color: "#f59e0b" },
  3: { label: "Speed Training", tag: "It's Speed Training ⚡", color: "#8b5cf6" },
  4: { label: "Exam Mode 💀", tag: "It's Exam Mode 💀", color: "#ef4444" },
};

// ─── Utility ─────────────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function fmtMin(mins: number): string {
  const m = Math.floor(mins);
  const s = Math.round((mins - m) * 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getQState(status: QuestionStatus): QState {
  if (status.isAnswered && status.isMarkedForReview) return "answeredMarked";
  if (status.isAnswered) return "answered";
  if (status.isMarkedForReview) return "marked";
  return "unanswered";
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExamPractice({ userId, exam, course, onBack, initialTopic, onExamComplete }: Props) {
  const [screen, setScreen] = useState<Screen>("setup");
  const [syllabusData, setSyllabusData] = useState<SubjectData[]>([]);
  const [syllabusLoading, setSyllabusLoading] = useState(true);

  // Setup state
  const [selectedSubject, setSelectedSubject] = useState(initialTopic?.subject ?? "");
  const [selectedTopic, setSelectedTopic] = useState(initialTopic?.topic ?? "");
  const [selectedAttempt, setSelectedAttempt] = useState<number>(1);
  const [questionCount, setQuestionCount] = useState<number>(20);

  const [allProgress, setAllProgress] = useState<UserProgress[]>([]);

  // Exam state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [statuses, setStatuses] = useState<QuestionStatus[]>([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState("");
  const [maxAttempts, setMaxAttempts] = useState(4);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fullscreen
  const examRef = useRef<HTMLDivElement>(null);

  // Palette drawer (mobile)
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Camera & Confirmation
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Load syllabus for subject/topic picker
  useEffect(() => {
    const subjects = SUBJECT_MAP[course] || [];
    if (!subjects.length) { setSyllabusLoading(false); return; }

    Promise.all(
      subjects.map(async (sub) => {
        try {
          const res = await fetch(`/SYLLABUS/${exam}/${course}/${sub}/${sub}.json`);
          if (!res.ok) return { subject: sub, chapters: [] };
          const json = await res.json();
          const chapters: Chapter[] = Array.isArray(json) ? json : json.chapters || [];
          return { subject: sub, chapters };
        } catch {
          return { subject: sub, chapters: [] };
        }
      })
    ).then((data) => {
      setSyllabusData(data);
      if (data.length > 0) {
        setSyllabusData(data);
        if (!selectedSubject) setSelectedSubject(data[0].subject);
      }
      setSyllabusLoading(false);
    }).catch(() => setSyllabusLoading(false));
  }, [exam, course, selectedSubject]);



  // Load user progress to prevent repeating questions
  useEffect(() => {
    fetchProgress(userId).then(setAllProgress).catch(console.error);
  }, [userId]);

  // Auto-select the next available attempt
  useEffect(() => {
    if (!selectedTopic) return;
    const progress = allProgress.find(p => p.topic === selectedTopic);
    const nextAttempt = Math.min((progress?.attempts || 0) + 1, 4);
    setSelectedAttempt(nextAttempt);
  }, [selectedTopic, allProgress]);

  // Hide global header when in exam mode
  useEffect(() => {
    document.body.classList.add("exam-active");
    return () => { document.body.classList.remove("exam-active"); };
  }, []);



  // ─── Start Exam (with explicit params — used by autoStart) ─────────────────
  const startExamWith = useCallback(async (subject: string, topic: string) => {
    if (!subject || !topic) return;
    setExamLoading(true);
    setExamError("");
    setSelectedSubject(subject);
    setSelectedTopic(topic);

    // Get current attempt number
    const progress = allProgress.find(p => p.topic === topic);
    const attemptNum = (progress?.attempts || 0) + 1;
    const count = 20; 
    setQuestionCount(count);

    try {
      const subjectFolderMap: Record<string, string> = {
        "Mathematics": "maths",
        "Physics": "physics",
        "Chemistry": "chemistry",
        "Botany": "botany",
        "Zoology": "zoology"
      };
      const folderName = subjectFolderMap[subject] || subject.toLowerCase();
      const topicSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
      
      // Use the new folder-based attempt structure for all modernized subjects
      const isRestructured = ["Mathematics", "Physics", "Chemistry", "Botany", "Zoology"].includes(subject);
      const fetchPath = isRestructured 
        ? `/questions_v2/${folderName}/${topicSlug}/attempt_${selectedAttempt}.json`
        : `/questions_v2/${folderName}/${topicSlug}.json`;
        
      const res = await fetch(fetchPath);

      if (res.ok) {
        const raw = await res.json();
        const qsArray = Array.isArray(raw) ? raw : (raw.questions || []);
        
        let selected = qsArray;

        // legacy slicing no longer needed for restructured folders as they are already partitioned
        if (!isRestructured) {
          const i = attemptNum - 1;
          const hardPool = qsArray.filter((q: any) => q.difficulty?.toLowerCase() === 'hard');
          const mediumPool = qsArray.filter((q: any) => q.difficulty?.toLowerCase() === 'medium' && !q.pyq);
          const pyqPool = qsArray.filter((q: any) => q.pyq === true);
          
          const selectedHard = hardPool.slice(i * 10, (i + 1) * 10);
          const selectedMedium = mediumPool.slice(i * 5, (i + 1) * 5);
          const selectedPYQ = pyqPool.slice(i * 5, (i + 1) * 5);
          selected = [...selectedHard, ...selectedMedium, ...selectedPYQ];
          
          if (selected.length < 20 && qsArray.length > 0) {
            const usedIds = new Set(selected.map((q: any) => q.id || q.question));
            const remainingPool = qsArray.filter((q: any) => !usedIds.has(q.id || q.question));
            selected = [...selected, ...remainingPool.slice(0, 20 - selected.length)];
          }
        }

        const finalSet = shuffleArray(selected).map((q: any, idx: number) => ({
          ...q,
          difficulty: q.difficulty === 'hard' ? 'Hard' : q.difficulty === 'medium' ? 'Medium' : q.difficulty || 'Hard',
          originalIndex: q.originalIndex ?? idx
        })) as Question[];

        setQuestions(finalSet);
        setStatuses(finalSet.map(() => ({ selectedOption: null, isAnswered: false, isMarkedForReview: false })));
        setCurrentIdx(0);
        
        // Timer Logic: EAMCET Optimization Engine
        const base = getBaseTime(subject, topic);
        const target = getAttemptTargetTime(base, attemptNum);

        setElapsedSeconds(attemptNum === 1 ? 0 : target); 
        setTargetSeconds(target);
        setExamStarted(false);
        setScreen("exam");
        setExamLoading(false);

        setTimeout(() => {
          if (examRef.current?.requestFullscreen) examRef.current.requestFullscreen().catch(() => {});
        }, 300);
      } else {
        setExamError("Question bank for this topic is being synchronized. Please try again in a moment.");
        setExamLoading(false);
      }
    } catch (e) {
      setExamError("Failed to load questions. Please try again.");
      setExamLoading(false);
    }
  }, [allProgress, selectedAttempt]);

  // ─── Start Exam (from setup screen using current state) ─────────────────────
  const startExam = useCallback(async () => {
    await startExamWith(selectedSubject, selectedTopic);
  }, [selectedSubject, selectedTopic, startExamWith]);

  // ─── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen === "exam" && examStarted) {
      const progress = allProgress.find(p => p.topic === selectedTopic);
      const attemptNum = (progress?.attempts || 0) + 1;

      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => {
          if (attemptNum === 1) {
            return prev + 1; // Count up
          }
          
          const next = prev - 1;
          if (next <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Auto-submit for Attempt 2, 3, 4
            if (attemptNum >= 2) {
              performFinalSubmit();
            }
            return 0;
          }
          return next; // Count down
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screen, examStarted, allProgress, selectedTopic]);

  useEffect(() => {
    if (screen === "exam" && !examStarted && questions.length > 0) {
      setExamStarted(true);
    }
  }, [screen, questions.length, examStarted]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const selectOption = useCallback((opt: "A" | "B" | "C" | "D") => {
    setStatuses(prev => {
      const next = [...prev];
      next[currentIdx] = { ...next[currentIdx], selectedOption: opt, isAnswered: true };
      return next;
    });
  }, [currentIdx]);

  const toggleMarkForReview = useCallback(() => {
    setStatuses(prev => {
      const next = [...prev];
      next[currentIdx] = { ...next[currentIdx], isMarkedForReview: !next[currentIdx].isMarkedForReview };
      return next;
    });
  }, [currentIdx]);

  const goTo = useCallback((idx: number) => {
    setCurrentIdx(idx);
    setPaletteOpen(false);
  }, []);

  // ─── Camera Logic ─────────────────────────────────────────────────────────
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied or unavailable. Please ensure you have granted permission.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/png");
        setCapturedImage(data);
        stopCamera();
      }
    }
  };

  const resetPhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const submitExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setScreen("confirmation");
    startCamera();
  }, []);

  const performFinalSubmit = useCallback(() => {
    stopCamera();
    
    // Attempt Logic again for calculation
    const currentProgress = allProgress.find(p => p.topic === selectedTopic);
    const attemptNum = (currentProgress?.attempts || 0) + 1;
    
    // For Count-down (Attempt 2+), the actual time taken is Target - Remaining
    const actualElapsed = attemptNum === 1 ? elapsedSeconds : (targetSeconds - elapsedSeconds);

    const correct = statuses.filter((s, i) => s.isAnswered && s.selectedOption === questions[i]?.answer).length;
    const currentSeenIds = questions.filter((_, i) => statuses[i].isAnswered).map(q => q.originalIndex);
    
    // Merge with existing progress for this topic
    const prevSeenIds = currentProgress?.seen_question_ids || [];
    const mergedSeenIds = Array.from(new Set([...prevSeenIds, ...currentSeenIds]));
    const newAttempts = attemptNum;
    
    // Save to Supabase
    saveProgress({
      user_id: userId,
      topic: selectedTopic,
      subject: selectedSubject,
      accuracy: Math.round((correct / questions.length) * 100),
      avg_time: actualElapsed > 0 ? Number((actualElapsed / questions.length).toFixed(1)) : 0,
      completed: true,
      seen_question_ids: mergedSeenIds,
      attempts: newAttempts,
      last_attempt_at: new Date().toISOString(),
    })
      .then(() => fetchProgress(userId).then(setAllProgress))
      .catch(() => {});

    // Notify parent if embedded
    onExamComplete?.(correct, questions.length, actualElapsed, currentSeenIds);
    setScreen("result");
  }, [statuses, questions, onExamComplete, elapsedSeconds, targetSeconds, selectedSubject, selectedTopic, allProgress, userId]);


  const retryExam = useCallback(() => {
    setScreen("setup");
    setQuestions([]);
    setStatuses([]);
    setElapsedSeconds(0);
  }, []);

  // ─── Computed ──────────────────────────────────────────────────────────────
  const currentQ = questions[currentIdx];
  const currentStatus = statuses[currentIdx];

  const answeredCount = statuses.filter(s => s.isAnswered).length;
  const unansweredCount = statuses.filter(s => !s.isAnswered && !s.isMarkedForReview).length;
  const markedCount = statuses.filter(s => s.isMarkedForReview && !s.isAnswered).length;
  const answeredMarkedCount = statuses.filter(s => s.isAnswered && s.isMarkedForReview).length;

  // Results computation
  const correctCount = statuses.filter((s, i) => s.isAnswered && s.selectedOption === questions[i]?.answer).length;
  const wrongCount = statuses.filter((s, i) => s.isAnswered && s.selectedOption !== questions[i]?.answer).length;
  const skippedCount = statuses.filter(s => !s.isAnswered).length;
  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const timeComparison = ((targetSeconds - elapsedSeconds) / targetSeconds) * 100;

  // Overage & underage
  const overtime = elapsedSeconds > targetSeconds;
  const timeDiff = Math.abs(elapsedSeconds - targetSeconds);

  // ─── Render: Setup ─────────────────────────────────────────────────────────
  if (screen === "setup") {
    const subData = syllabusData.find(d => d.subject === selectedSubject);

    return (
      <div className={styles.setupScreen}>
        <div className={styles.setupBg} />

        <div className={styles.setupCard}>
          {/* Header */}
          <div className={styles.setupHeader}>
            <button className={styles.backBtn} onClick={onBack} id="exam-practice-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className={styles.setupBadge}>{exam} EAMCET · {course}</div>
          </div>

          <div className={styles.setupBody}>
            <div className={styles.setupTitleRow}>
              <span className={styles.setupEmoji}>🎯</span>
              <div>
                <h1 className={styles.setupTitle}>{selectedTopic || "Topic Practice"}</h1>
                <p className={styles.setupSub}>{selectedSubject} • EAMCET {course}</p>
              </div>
            </div>

            {syllabusLoading ? (
              <div className={styles.setupLoading}>
                <div className={styles.spinner} />
                <span>Loading syllabus…</span>
              </div>
            ) : (
              <>

                {/* Attempt Selection */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>🚀 Select Attempt Batch</label>
                  <div className={styles.attemptGrid}>
                    {[1, 2, 3, 4].map((n) => {
                      const p = allProgress.find(p => p.topic === selectedTopic);
                      const completedCount = p?.attempts || 0;
                      const isUnlocked = n === 1 || n <= (completedCount + 1);
                      const isCompleted = n <= completedCount;
                      const isNewUnlock = n === (completedCount + 1);

                      return (
                        <div
                          key={n}
                          className={`
                            ${styles.attemptCard} 
                            ${!isUnlocked ? styles.locked : ""} 
                            ${selectedAttempt === n ? styles.attemptSelected : ""}
                            ${isNewUnlock ? styles.unlockedNew : ""}
                          `}
                          onClick={() => isUnlocked && setSelectedAttempt(n)}
                        >
                          <div className={styles.attemptHeader}>
                            <span className={styles.attemptNum}>Batch {n}</span>
                            {!isUnlocked && (
                              <svg className={styles.lockIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                              </svg>
                            )}
                            {isCompleted && <span className={styles.completedBadge}>DONE</span>}
                          </div>
                          <span className={styles.attemptTitle}>Attempt {n}</span>
                          <span className={styles.attemptSub}>20 Questions</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Last Attempt Info */}
                {(() => {
                  const p = allProgress.find(p => p.topic === selectedTopic);
                  if (!p || !p.last_attempt_at) return null;
                  return (
                    <div style={{ marginTop: "12px", padding: "12px 14px", background: "var(--bg-card2)", borderRadius: "10px", fontSize: "0.85rem", color: "var(--text)", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span>🕒 <strong>Last Attempt:</strong> {new Date(p.last_attempt_at).toLocaleString()}</span>
                        <span style={{ fontWeight: "600", color: "var(--accent)" }}>Attempt #{p.attempts || 1}</span>
                      </div>
                      {p.accuracy !== undefined && (
                        <div style={{ fontSize: "14px", fontWeight: "700", color: p.accuracy >= 50 ? "#10b981" : "#fca5a5" }}>
                          🎯 Previous Score: {p.accuracy.toFixed(0)}%
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Info row */}
                {(() => {
                  const base = getBaseTime(selectedSubject, selectedTopic);
                  const target = getAttemptTargetTime(base, selectedAttempt);
                  const modeText = ATTEMPT_MODES[selectedAttempt]?.label || "Practice Mode";

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div className={styles.examInfoRow}>
                        <div className={styles.examInfoItem} style={{ background: selectedAttempt === 4 ? 'rgba(239,68,68,0.1)' : 'var(--bg-card2)', border: selectedAttempt === 4 ? '1px solid rgba(239,68,68,0.2)' : '1px solid var(--border)' }}>
                          <span className={styles.examInfoIcon}>{selectedAttempt === 4 ? '💀' : '⏱'}</span>
                          <span style={{ fontWeight: "700" }}>{modeText}</span>
                        </div>
                        <div className={styles.examInfoItem}>
                          <span className={styles.examInfoIcon}>🎯</span>
                          <span><strong>Target:</strong> {fmt(target)}</span>
                        </div>
                        <div className={styles.examInfoItem}>
                          <span className={styles.examInfoIcon}>📝</span>
                          <span>{questionCount} MCQs</span>
                        </div>
                      </div>
                      <div style={{ fontSize: "14px", color: "var(--accent)", padding: "12px", background: "rgba(99, 102, 241, 0.05)", borderRadius: "8px", border: "1px dashed var(--accent)", textAlign: "center", fontWeight: "600" }}>
                        💡 This topic needs <strong>{Math.floor(target / 60)} min {target % 60 > 0 ? `${target % 60} sec` : ""}</strong> target to solve.
                      </div>
                    </div>
                  );
                })()}

                {examError && <div className={styles.examError}>{examError}</div>}

                {/* Start Button */}
                <button
                  id="exam-start-btn"
                  className={styles.startExamBtn}
                  onClick={startExam}
                  disabled={!selectedTopic || examLoading}
                >
                  {examLoading ? (
                    <><div className={styles.btnSpinner} /> Loading Questions…</>
                  ) : (
                    <>🚀 Start Exam</>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Confirmation ──────────────────────────────────────────────────
  if (screen === "confirmation") {
    const answeredCount = statuses.filter(s => s.isAnswered).length;
    const unansweredCount = statuses.filter(s => !s.isAnswered).length;
    const markedCount = statuses.filter(s => s.isMarkedForReview).length;

    return (
      <div className={styles.setupOverlay}>
        <div className={styles.setupCard} style={{ maxWidth: "600px" }}>
          <div className={styles.header}>
            <div className={styles.emoji}>📝</div>
            <div className={styles.title}>Submit Confirmation</div>
            <div className={styles.subtitle}>Review your attempts and verify your work</div>
          </div>

          <div className={styles.statsSummaryGrid}>
            <div className={styles.statSummaryItem}>
              <span className={styles.statSummaryVal} style={{ color: "#10b981" }}>{answeredCount}</span>
              <span className={styles.statSummaryLbl}>Attempted</span>
            </div>
            <div className={styles.statSummaryItem}>
              <span className={styles.statSummaryVal} style={{ color: "#ef4444" }}>{unansweredCount}</span>
              <span className={styles.statSummaryLbl}>Not Attempted</span>
            </div>
            <div className={styles.statSummaryItem}>
              <span className={styles.statSummaryVal} style={{ color: "#6366f1" }}>{markedCount}</span>
              <span className={styles.statSummaryLbl}>Marked</span>
            </div>
          </div>

          <div className={styles.cameraSection}>
            <h3 className={styles.cameraTitle}>📸 Verification Photo</h3>
            <p className={styles.cameraDesc}>Please take a clear photo of your practice rough work papers. (Laptop/Mobile camera)</p>
            
            <div className={styles.cameraViewport}>
              {!capturedImage ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={styles.cameraVideo}
                  />
                  {cameraError && <div className={styles.cameraError}>{cameraError}</div>}
                  <button className={styles.captureBtn} onClick={takePhoto}>Capture Photo</button>
                </>
              ) : (
                <>
                  <img src={capturedImage} alt="Captured work" className={styles.capturedImg} />
                  <button className={styles.retakeBtn} onClick={resetPhoto}>🔄 Retake Photo</button>
                </>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          </div>

          <div className={styles.confirmActions}>
            <button className={styles.confirmBackBtn} onClick={() => { stopCamera(); setScreen("exam"); }}>
              ← Back to Questions
            </button>
            <button 
              className={styles.finalSubmitBtn} 
              onClick={performFinalSubmit}
              disabled={!capturedImage && !cameraError}
            >
              ✅ Final Submit & See Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Result ────────────────────────────────────────────────────────
  if (screen === "result") {
    const scorePercent = Math.round((correctCount / questions.length) * 100);

    let performanceMsg = "";
    let performanceEmoji = "";
    if (scorePercent >= 80) { performanceMsg = "Outstanding! You're exam-ready."; performanceEmoji = "🏆"; }
    else if (scorePercent >= 60) { performanceMsg = "Good attempt! A bit more practice and you'll ace it."; performanceEmoji = "💪"; }
    else if (scorePercent >= 40) { performanceMsg = "Keep grinding — you're getting there!"; performanceEmoji = "📈"; }
    else { performanceMsg = "Don't give up! Review the topic and try again."; performanceEmoji = "🔥"; }

    return (
      <div className={styles.resultScreen}>
        <div className={styles.resultBg} />
        <div className={styles.resultCard}>
          {/* Header */}
          <div className={styles.resultHeader}>
            <div className={styles.resultEmoji}>{performanceEmoji}</div>
            <h1 className={styles.resultTitle}>Exam Complete!</h1>
            <p className={styles.resultTopic}>{selectedTopic} — {selectedSubject}</p>
            <p className={styles.performanceMsg}>{performanceMsg}</p>
            {(() => {
              const p = allProgress.find(p => p.topic === selectedTopic);
              const completedCount = p?.attempts || 0;
              const nextAttempt = completedCount + 1;
              const nextModeName = ATTEMPT_MODES[nextAttempt]?.label || "Practice";
              
              if (completedCount >= maxAttempts) {
                return <p className={styles.previousAttemptHint} style={{ color: "#10b981", fontWeight: "700" }}>🏆 Topic Mastered! You have completed all {maxAttempts} unique batches. 🔥</p>;
              }
              return <p className={styles.previousAttemptHint}>Your attempt has been saved. 🚀 **Next:** Start Attempt {nextAttempt}: **{nextModeName}** 🔥</p>;
            })()}
          </div>

          {/* ── Attempt Logged Banner ── */}
          <div className={styles.nextLevelUnlocked} style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <span className={styles.nextLevelIcon}>✅</span>
            <div className={styles.nextLevelText}>
              <span className={styles.nextLevelTitle}>Attempt Saved</span>
              <span className={styles.nextLevelSub}>You answered {questions.length} questions. Future attempts will use unseen questions!</span>
            </div>
          </div>

          {/* Score circle */}
          <div className={styles.scoreCircleWrap}>
            <svg className={styles.scoreCircle} viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={scorePercent >= 60 ? "#10b981" : scorePercent >= 40 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - scorePercent / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
              />
              <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800">{scorePercent}%</text>
              <text x="60" y="72" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Score</text>
            </svg>
          </div>

          {/* Stats grid */}
          <div className={styles.resultStatsGrid}>
            <div className={styles.resultStat}>
              <span className={styles.resultStatVal} style={{ color: "#10b981" }}>{correctCount}</span>
              <span className={styles.resultStatLbl}>Correct</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatVal} style={{ color: "#ef4444" }}>{wrongCount}</span>
              <span className={styles.resultStatLbl}>Wrong</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatVal} style={{ color: "#94a3b8" }}>{skippedCount}</span>
              <span className={styles.resultStatLbl}>Skipped</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatVal} style={{ color: "#6366f1" }}>{accuracy}%</span>
              <span className={styles.resultStatLbl}>Accuracy</span>
            </div>
          </div>

          {/* Accuracy bar */}
          <div className={styles.accuracyBarWrap}>
            <div className={styles.accuracyBarLabel}>
              <span>Accuracy</span>
              <span>{accuracy}%</span>
            </div>
            <div className={styles.accuracyBar}>
              <div
                className={styles.accuracyBarFill}
                style={{
                  width: `${accuracy}%`,
                  background: accuracy >= 60 ? "linear-gradient(90deg, #10b981, #34d399)" : accuracy >= 40 ? "linear-gradient(90deg, #f59e0b, #fbbf24)" : "linear-gradient(90deg, #ef4444, #f87171)"
                }}
              />
            </div>
          </div>

          {/* Time comparison */}
          <div className={styles.timeComparison}>
            <div className={styles.timeBox}>
              <span className={styles.timeLabel}>⏱ Your Time</span>
              <span className={styles.timeVal}>{fmt(elapsedSeconds)}</span>
            </div>
            <div className={styles.timeVs}>vs</div>
            <div className={styles.timeBox}>
              <span className={styles.timeLabel}>🎯 Target Time</span>
              <span className={styles.timeVal}>{fmt(targetSeconds)}</span>
            </div>
          </div>

          <div className={styles.timeDiffRow}>
            {overtime ? (
              <span className={styles.timeOver}>⚠️ Over by {fmt(timeDiff)}</span>
            ) : (
              <span className={styles.timeUnder}>✅ Under by {fmt(timeDiff)}</span>
            )}
          </div>

          {/* Review section */}
          <div className={styles.reviewSection}>
            <h2 className={styles.reviewTitle}>Question Review</h2>
            <div className={styles.reviewList}>
              {questions.map((q, i) => {
                const status = statuses[i];
                const isCorrect = status.isAnswered && status.selectedOption === q.answer;
                const isWrong = status.isAnswered && status.selectedOption !== q.answer;
                const isSkipped = !status.isAnswered;
                return (
                  <div
                    key={i}
                    className={`${styles.reviewItem} ${isCorrect ? styles.reviewCorrect : isWrong ? styles.reviewWrong : styles.reviewSkipped}`}
                  >
                    <div className={styles.reviewQHeader}>
                      <span className={styles.reviewQNum}>Q{i + 1}</span>
                      <span className={styles.reviewDiff} data-diff={q.difficulty.toLowerCase()}>{q.difficulty}</span>
                      <span className={styles.reviewResult}>
                        {isCorrect ? "✅ Correct" : isWrong ? "❌ Wrong" : "⏭ Skipped"}
                      </span>
                    </div>
                    <p className={styles.reviewQText}>{q.question}</p>
                    <div className={styles.reviewAnswers}>
                      {isWrong && (
                        <span className={styles.reviewYour}>Your answer: <strong>{status.selectedOption} — {q.options[status.selectedOption!]}</strong></span>
                      )}
                      {!isCorrect && (
                        <span className={styles.reviewCorrectAns}>Correct: <strong>{q.answer} — {q.options[q.answer]}</strong></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.resultActions}>
            <button id="exam-retry-btn" className={styles.retryBtn} onClick={retryExam}>
              🔄 Try Again
            </button>
            <button id="exam-back-btn" className={styles.resultBackBtn} onClick={onBack}>
              ← Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Exam ──────────────────────────────────────────────────────────
  if (screen !== "exam" || !currentQ) return null;

  const timerPct = targetSeconds > 0 ? Math.min((elapsedSeconds / targetSeconds) * 100, 100) : 0;
  const timerColor = timerPct < 50 ? "#10b981" : timerPct < 80 ? "#f59e0b" : "#ef4444";

  return (
    <div className={styles.examScreen} ref={examRef}>
      {/* ── Top bar ── */}
      <header className={styles.examTopBar}>
        <div className={styles.examTopLeft}>
          <div className={styles.examInfo}>
            <span className={styles.examBadge}>{exam} EAMCET</span>
            {(() => {
              const p = allProgress.find(p => p.topic === selectedTopic);
              const attemptNum = (p?.attempts || 0) + 1;
              const mode = ATTEMPT_MODES[attemptNum] || ATTEMPT_MODES[1];
              return (
                <div className={styles.modeTag} style={{ backgroundColor: mode.color }}>
                  {mode.tag}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Double timer or Countdown */}
        {(() => {
          const progress = allProgress.find(p => p.topic === selectedTopic);
          const attemptNum = (progress?.attempts || 0) + 1;
          
          if (attemptNum === 1) {
            return (
              <div className={styles.timerSection}>
                <div className={styles.timerBox} data-over={elapsedSeconds > targetSeconds}>
                  <span className={styles.timerLabel}>Actual</span>
                  <span className={styles.timerVal}>{fmt(elapsedSeconds)}</span>
                </div>
                <div className={styles.timerDivider} />
                <div className={styles.timerBox}>
                  <span className={styles.timerLabel}>Target</span>
                  <span className={styles.timerVal}>{fmt(targetSeconds)}</span>
                </div>
              </div>
            );
          } else {
            return (
              <div className={styles.timerSection}>
                <div className={styles.timerBox} data-over={elapsedSeconds === 0}>
                  <span className={styles.timerLabel}>Remaining</span>
                  <span className={styles.timerVal}>{fmt(elapsedSeconds)}</span>
                </div>
              </div>
            );
          }
        })()}

        {/* Progress bar */}
        <div className={styles.timerProgressWrap}>
          <div
            className={styles.timerProgress}
            style={{ width: `${timerPct}%`, background: timerColor, transition: "width 1s linear, background 0.5s" }}
          />
        </div>

        <div className={styles.examTopRight}>
          <span className={styles.qProgress}>{currentIdx + 1}/{questions.length}</span>
          <button id="exam-palette-toggle" className={styles.paletteToggle} onClick={() => setPaletteOpen(o => !o)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.examBody}>
        {/* LEFT: Question area */}
        <main className={styles.questionArea}>
          {/* Diagram */}
          {currentQ.hasDiagram && (
            <div className={styles.diagramBox}>
              <img
                src={`/diagrams/${selectedSubject}/${selectedTopic.replace(/\s+/g, "_")}/${currentQ.originalIndex}.png`}
                alt={currentQ.diagram_description || "Diagram"}
                className={styles.diagramImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const alt = document.createElement("div");
                    alt.className = styles.diagramPlaceholder;
                    alt.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 9 6 6M15 9l-6 6"/></svg><p>${currentQ.diagram_description || "Diagram"}</p>`;
                    parent.appendChild(alt);
                  }
                }}
              />
              {currentQ.diagram_description && (
                <p className={styles.diagramCaption}>{currentQ.diagram_description}</p>
              )}
            </div>
          )}

          {/* Question */}
          <div className={styles.questionCard}>
            <div className={styles.questionMeta}>
              <span className={styles.qNumber}>Question {currentIdx + 1}</span>
              <span className={styles.diffBadge} data-diff={currentQ.difficulty.toLowerCase()}>{currentQ.difficulty}</span>
              {currentQ.pyq && <span className={styles.pyqBadge}>PYQ</span>}
            </div>
            <p className={styles.questionText}>{currentQ.question}</p>
          </div>

          {/* Options */}
          <div className={styles.optionsGrid}>
            {(["A", "B", "C", "D"] as const).map((opt) => {
              const sel = currentStatus?.selectedOption === opt;
              return (
                <button
                  key={opt}
                  id={`exam-option-${opt}`}
                  className={`${styles.optionBtn} ${sel ? styles.optionSelected : ""}`}
                  onClick={() => selectOption(opt)}
                >
                  <span className={styles.optionLetter}>{opt}</span>
                  <span className={styles.optionText}>{currentQ.options[opt]}</span>
                  {sel && (
                    <span className={styles.optionCheck}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom navigation */}
          <div className={styles.navBar}>
            <button
              id="exam-prev-btn"
              className={styles.navBtn}
              onClick={() => goTo(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Previous
            </button>

            <button
              id="exam-mark-btn"
              className={`${styles.markBtn} ${currentStatus?.isMarkedForReview ? styles.markBtnActive : ""}`}
              onClick={toggleMarkForReview}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={currentStatus?.isMarkedForReview ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {currentStatus?.isMarkedForReview ? "Marked" : "Mark"}
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                id="exam-next-btn"
                className={`${styles.navBtn} ${styles.navBtnPrimary}`}
                onClick={() => goTo(currentIdx + 1)}
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ) : (
              (() => {
                const progress = allProgress.find(p => p.topic === selectedTopic);
                const attemptNum = (progress?.attempts || 0) + 1;
                
                const timeUp = attemptNum === 1 ? elapsedSeconds >= targetSeconds : elapsedSeconds <= 0;
                const allAnswered = answeredCount === questions.length;
                
                // For Attempt 1: always enabled. For 2,3,4: only if all answered or time up.
                const canSubmit = attemptNum === 1 || timeUp || allAnswered;

                return (
                  <button
                    id="exam-submit-btn"
                    className={`${styles.navBtn} ${styles.submitBtn}`}
                    disabled={!canSubmit}
                    onClick={() => {
                      if (attemptNum === 1 || (!timeUp && allAnswered)) {
                        const timeLeft = attemptNum === 1 ? (targetSeconds - elapsedSeconds) : elapsedSeconds;
                        const msg = attemptNum === 1 
                          ? `You completed ${answeredCount}/${questions.length} questions.\n\nAre you sure you want to submit?`
                          : `You still have ${fmt(timeLeft)} remaining.\n\nAre you sure you want to submit the exam early?`;
                        if (!window.confirm(msg)) return;
                      }
                      submitExam();
                    }}
                    style={{ opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
                  >
                    Submit Exam
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                );
              })()
            )}
          </div>
        </main>

        {/* RIGHT: Palette */}
        <aside className={`${styles.palettePanel} ${paletteOpen ? styles.paletteOpen : ""}`}>
          <div className={styles.paletteStickyWrap}>
            {/* Legend */}
            <div className={styles.paletteLegend}>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendAnswered}`} /><span>Answered</span></div>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendMarked}`} /><span>Marked</span></div>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendUnanswered}`} /><span>Not Answered</span></div>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendCurrent}`} /><span>Current</span></div>
            </div>

            {/* Stats row */}
            <div className={styles.paletteStats}>
              <div className={styles.paletteStatItem}>
                <span className={styles.paletteStatNum} style={{ color: "#10b981" }}>{answeredCount}</span>
                <span className={styles.paletteStatLabel}>Done</span>
              </div>
              <div className={styles.paletteStatItem}>
                <span className={styles.paletteStatNum} style={{ color: "#f59e0b" }}>{markedCount + answeredMarkedCount}</span>
                <span className={styles.paletteStatLabel}>Marked</span>
              </div>
              <div className={styles.paletteStatItem}>
                <span className={styles.paletteStatNum} style={{ color: "#64748b" }}>{unansweredCount}</span>
                <span className={styles.paletteStatLabel}>Left</span>
              </div>
            </div>

            {/* Grid */}
            <div className={styles.paletteGrid}>
              {statuses.map((s, i) => {
                const state = getQState(s);
                const isCurrent = i === currentIdx;
                return (
                  <button
                    key={i}
                    id={`palette-q-${i + 1}`}
                    className={`${styles.paletteBtn}
                      ${isCurrent ? styles.paletteCurrent : ""}
                      ${!isCurrent && state === "answered" ? styles.paletteAnswered : ""}
                      ${!isCurrent && state === "marked" ? styles.paletteMarked : ""}
                      ${!isCurrent && state === "answeredMarked" ? styles.paletteAnsweredMarked : ""}
                      ${!isCurrent && state === "unanswered" ? styles.paletteUnanswered : ""}
                    `}
                    onClick={() => goTo(i)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Submit */}
            {(() => {
              const progress = allProgress.find(p => p.topic === selectedTopic);
              const attemptNum = (progress?.attempts || 0) + 1;
              const timeUp = attemptNum === 1 ? elapsedSeconds >= targetSeconds : elapsedSeconds <= 0;
              const allAnswered = answeredCount === questions.length;
              const canSubmit = attemptNum === 1 || timeUp || allAnswered;

              return (
                <button
                  id="palette-submit-btn"
                  className={styles.paletteSubmitBtn}
                  onClick={canSubmit ? submitExam : undefined}
                  disabled={!canSubmit}
                  style={{ opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
                >
                  {canSubmit ? "Submit Exam" : "Finish it to Submit"}
                </button>
              );
            })()}
          </div>
        </aside>
      </div>

      {/* Palette backdrop on mobile */}
      {paletteOpen && (
        <div className={styles.paletteBackdrop} onClick={() => setPaletteOpen(false)} />
      )}
    </div>
  );
}
