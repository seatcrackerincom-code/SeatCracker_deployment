"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./RealBattleMode.module.css";
import { type User } from "../../lib/firebase";
import { updateUserProfile } from "../../lib/supabase";
import { calculateMarks, getPerformanceAnalysis, type FullResult, type JEEQuestion, type JEEResponse } from "../../lib/jeeAdvancedScoring";
import JEEResultsPage from "./JEEResultsPage";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { getExamConfig } from "@/config/examConfig";
import PurchaseScreen from "../premium/PurchaseScreen";
import LoginScreen from "../LoginScreen";

const AVATAR_LS_KEY = "sc_profile_avatar";

// ── Types ──────────────────────────────────────────────────────────────────
type ViewState = "daySelection" | "dayView" | "examMode" | "submit_summary" | "results" | "jee_login" | "jee_inst1" | "jee_inst2" | "jee_decl";
type Subject = "Math" | "Phy" | "Chem";

interface Day { id: number; label: string; }

interface Question {
  id: string;
  subject: Subject;
  section: number;
  number: number;
  type: "MCQ" | "MSQ" | "SA" | "MATCH" | "SA_DECIMAL";
  text: string;
  question?: string;
  image?: string;           // e.g. "images/1.png" from paper.json
  images?: string[];        // legacy array format
  options?: string[];
  marks: string;
  markingScheme?: string;
  answer: string | string[];
  match_options?: Record<string, Record<string, number>>;
  passage?: string;
  passage_id?: number;
}

// 0=not visited, 1=not answered, 2=answered, 3=marked, 4=answered+marked
type QStatus = 0 | 1 | 2 | 3 | 4;

interface Response {
  option: string | string[] | null;
  status: QStatus;
}

interface Props {
  userId?: string;
  exam?: string;
  course?: string;
  onBack: () => void;
  onRestart?: () => void;
  authUser?: User | null;
}

const MathText = ({ text }: { text: string }) => {
  if (!text) return null;
  const parts = text.split(/(\$.*?\$)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          return <InlineMath key={i} math={part.slice(1, -1)} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

// ── Status Badge Component ──────────────────────────────────────────────────
const QBadge = ({ status, label, active, onClick }: { status: QStatus, label: string | number, active?: boolean, onClick?: () => void }) => {
  return (
    <div className={`${styles.palBtn} ${styles[`s${status}`]} ${active ? styles.palActive : ""}`} onClick={onClick}>
      {label}
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────
export default function RealBattleMode({ userId, exam, course, onBack, onRestart, authUser }: Props) {
  // ── Hub States ──
  const [view, setView] = useState<ViewState>("daySelection");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [theme, setTheme] = useState<"video" | "image" | "plain">("image");
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [p1Done, setP1Done] = useState(false);
  const [p2Done, setP2Done] = useState(false);

  // ── Exam Engine States ──
  const [examData, setExamData] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePaperNum, setActivePaperNum] = useState<number>(1);

  const [activeSub, setActiveSub] = useState<Subject>("Math");
  const [activeSec, setActiveSec] = useState<number>(1);
  const [activeQIdx, setActiveQIdx] = useState<number>(0);

  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [timeLeft, setTimeLeft] = useState(10800); // 3 Hours
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [numAns, setNumAns] = useState<string>("");

  // ── Results States ──
  const [fullResult, setFullResult] = useState<FullResult | null>(null);
  const [completedDaysMap, setCompletedDaysMap] = useState<Record<number, boolean>>({});

  // ── Premium States ──
  const [isPremium, setIsPremium] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPurchaseAfterLogin, setShowPurchaseAfterLogin] = useState(false);
  const [purchaseUser, setPurchaseUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [declChecked, setDeclChecked] = useState(false);
  const currentExamId = exam || "jee-advanced";
  const examConfig = getExamConfig(currentExamId);

  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarSrc = authUser?.photoURL || "/avatar.png";
  const displayName = authUser?.displayName || (authUser?.email ? authUser.email.split('@')[0] : "Candidate");

  const requestPremiumAccess = useCallback(() => {
    if (!authUser) {
      setShowPurchaseAfterLogin(true);
      setShowLogin(true);
      return;
    }

    setShowPurchase(true);
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem("sc_jee_phase", view);
    window.dispatchEvent(new CustomEvent("sc_step_change", { detail: { jeePhase: view } }));
  }, [view]);

  // Load Day Progress + Completed Days
  useEffect(() => {
    // Show welcome popup once per session
    const welcomeSeen = sessionStorage.getItem("sc_welcome_seen");
    if (!welcomeSeen) {
      setShowWelcome(true);
      sessionStorage.setItem("sc_welcome_seen", "true");
    }
    const savedActive = localStorage.getItem("sc_active_day");
    const savedP1 = localStorage.getItem("sc_day_p1_done") === "true";
    const savedP2 = localStorage.getItem("sc_day_p2_done") === "true";
    if (savedActive) {
      setActiveDay(parseInt(savedActive));
      setP1Done(savedP1);
      setP2Done(savedP2);
    }
    // Load completed days
    try {
      const savedCompleted = localStorage.getItem("sc_jee_completed_days");
      if (savedCompleted) setCompletedDaysMap(JSON.parse(savedCompleted));
    } catch { }

    // Load Premium Status
    if (userId) {
      fetch(`/api/payment/status?userId=${userId}&examId=${currentExamId}`)
        .then(res => {
          if (!res.ok) throw new Error("API failed");
          return res.json();
        })
        .then(data => setIsPremium(data.isPremium))
        .catch(() => { });
    }
  }, [userId, currentExamId]);

  // Handler to view saved results for a completed day
  const viewSavedResult = useCallback((dayNum: number) => {
    // Premium Lock Check
    const isFreeDay = dayNum <= examConfig.freeDays;
    const isLocked = examConfig.isPremium && !isPremium && !isFreeDay;
    if (isLocked) {
      requestPremiumAccess();
      return;
    }

    const saved = localStorage.getItem(`sc_jee_result_day_${dayNum}`);
    if (!saved) return;
    try {
      const sr = JSON.parse(saved);
      const reconstructed: FullResult = {
        paper1: { physics: sr.paper1_physics || 0, chemistry: sr.paper1_chemistry || 0, maths: sr.paper1_maths || 0, total: sr.paper1_total || 0, correct: 0, wrong: 0, unattempted: 0 },
        paper2: { physics: sr.paper2_physics || 0, chemistry: sr.paper2_chemistry || 0, maths: sr.paper2_maths || 0, total: sr.paper2_total || 0, correct: 0, wrong: 0, unattempted: 0 },
        combined: { physics: sr.physics_total || 0, chemistry: sr.chemistry_total || 0, maths: sr.maths_total || 0, grandTotal: sr.grand_total || 0, totalCorrect: sr.total_correct || 0, totalWrong: sr.total_wrong || 0, totalUnattempted: sr.total_unattempted || 0, accuracyPercent: sr.accuracy_percent || 0, timeEfficiencyTag: "—" },
      };
      setFullResult(reconstructed);
      setSelectedDay(dayNum);
      setView("results");
    } catch { }
  }, [examConfig.freeDays, examConfig.isPremium, isPremium, requestPremiumAccess]);

  // Timer
  useEffect(() => {
    if (view === "examMode") {
      const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [view]);

  const days: Day[] = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, label: `Day ${i + 1}` }));

  // ── Hub Functions ──
  const handleDayClick = (dayId: number) => {
    // Premium Lock Check
    const isFreeDay = dayId <= examConfig.freeDays;
    const isLocked = examConfig.isPremium && !isPremium && !isFreeDay;

    if (isLocked) {
      requestPremiumAccess();
      return;
    }

    if (dayId > 5) {
      alert("⏳ Coming in 24 hours! We are calibrating these advanced papers for the ultimate accuracy. Stay tuned!");
      return;
    }

    // Set day and go to view (Reset button will be available there)
    setSelectedDay(dayId);
    setView("dayView");
  };

  const handleBackToDays = () => {
    setView("daySelection");
    setSelectedDay(null);
  };

  const startExam = async (paperNum: number) => {
    setIsLoading(true);
    setActivePaperNum(paperNum);

    try {
      const response = await fetch(`/JEE_Advanced/Day_${selectedDay || 1}/Paper_${paperNum}/paper.json`);
      if (!response.ok) throw new Error("JSON missing");
      const data = await response.json();
      
      const loadedQuestions = data.questions.map((q: any, index: number) => {
        const id = index + 1;
        return {
          ...q,
          image: `/JEE_Advanced/Day_${selectedDay || 1}/Paper_${paperNum}/images/q_${id}.png`
        };
      });

      setExamData(loadedQuestions);
    } catch (error) {
      console.error("JSON fetch failed, using fallback:", error);
      const isDay2 = selectedDay === 2;
      const fallback: Question[] = Array.from({ length: isDay2 ? 48 : 51 }, (_, i) => {
        const id = i + 1;
        let sub = id > (isDay2 ? 32 : 34) ? "Chem" : id > (isDay2 ? 16 : 17) ? "Phy" : "Math";
        return {
          id: `fallback-${id}`,
          subject: sub,
          section: 1,
          number: id,
          type: "MCQ",
          image: `/JEE_Advanced/Day_${selectedDay || 1}/Paper_${paperNum}/images/q_${id}.png`,
          options: ["A", "B", "C", "D"],
          marks: "+3, -1",
          answer: "1"
        } as any;
      });
      setExamData(fallback);
    }

    setResponses({});
    setTimeLeft(10800);
    setActiveSub("Math");
    setActiveSec(1);
    setActiveQIdx(0);
    setNumAns("");
    setView("jee_login");
    setIsLoading(false);
  };

  // ── Exam Logic ──
  const subjectQuestions = examData.filter(q => q.subject === activeSub);
  const activeQuestions = examData.filter(q => q.subject === activeSub && q.section === activeSec);
  const currentQ = activeQuestions[activeQIdx];

  useEffect(() => {
    if (!currentQ || (currentQ.type !== "SA" && currentQ.type !== "SA_DECIMAL")) return;
    const existing = responses[currentQ.id]?.option;
    setNumAns(typeof existing === "string" ? existing : "");
  }, [currentQ, responses]);

  useEffect(() => {
    if (view !== "examMode" || !currentQ) return;
    setResponses(prev => {
      if (prev[currentQ.id]) return prev;
      return { ...prev, [currentQ.id]: { option: null, status: 1 } };
    });
  }, [currentQ?.id, view]);

  const [lastPaperResult, setLastPaperResult] = useState<{ total: number; correct: number; wrong: number } | null>(null);

  const handleSubmitExam = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
    setShowSubmitConfirm(false);

    const dayNum = selectedDay || 1;

    // Calculate immediate result for this paper
    let pScore = 0;
    let pCorrect = 0;
    let pWrong = 0;

    examData.forEach(q => {
      const res = responses[q.id];
      if (!res || !res.option || (Array.isArray(res.option) && res.option.length === 0)) return;

      const isCorrect = Array.isArray(q.answer)
        ? (Array.isArray(res.option) && res.option.length === q.answer.length && (res.option as string[]).every(o => (q.answer as string[]).includes(o)))
        : (String(res.option) === String(q.answer));

      if (isCorrect) {
        pScore += parseInt((q.marks || "3").split(',')[0].replace('+', '').trim());
        pCorrect++;
      } else {
        const neg = parseInt((q.marks || "3, 0").split(',')[1]?.replace('-', '').trim() || "0");
        pScore -= neg;
        pWrong++;
      }
    });

    setLastPaperResult({ total: pScore, correct: pCorrect, wrong: pWrong });

    if (activePaperNum === 1) {
      // Save Paper 1 responses + questions to localStorage
      setP1Done(true);
      localStorage.setItem("sc_day_p1_done", "true");
      localStorage.setItem(`sc_jee_p1_responses_day_${dayNum}`, JSON.stringify(responses));
      localStorage.setItem(`sc_jee_p1_questions_day_${dayNum}`, JSON.stringify(examData));
      localStorage.setItem(`sc_jee_p1_submitted_at_${dayNum}`, new Date().toISOString());

      // Only save P1 completion flag to Supabase
      const uid = userId || authUser?.uid;
      if (uid) {
        updateUserProfile(uid, { [`jee_day_${dayNum}_p1_done`]: true } as any).catch(() => { });
      }

      setView("submit_summary");
      return;
    }

    if (activePaperNum === 2) {
      setP2Done(true);
      localStorage.setItem("sc_day_p2_done", "true");

      // Retrieve Paper 1 data
      const p1ResponsesRaw = localStorage.getItem(`sc_jee_p1_responses_day_${dayNum}`);
      const p1QuestionsRaw = localStorage.getItem(`sc_jee_p1_questions_day_${dayNum}`);
      const p1SubmittedAt = localStorage.getItem(`sc_jee_p1_submitted_at_${dayNum}`) || "";
      const p2SubmittedAt = new Date().toISOString();

      let p1Responses: Record<string, JEEResponse> = {};
      let p1Questions: JEEQuestion[] = [];
      try {
        if (p1ResponsesRaw) p1Responses = JSON.parse(p1ResponsesRaw);
        if (p1QuestionsRaw) p1Questions = JSON.parse(p1QuestionsRaw);
      } catch { /* fallback empty */ }

      // Map current responses to JEEResponse format
      const p2Responses: Record<string, JEEResponse> = {};
      for (const [qId, r] of Object.entries(responses)) {
        p2Responses[qId] = { option: r.option, status: r.status };
      }

      // Map current exam data to JEEQuestion format
      const p2Questions: JEEQuestion[] = examData.map(q => ({
        id: q.id, subject: q.subject, section: q.section,
        type: q.type as JEEQuestion["type"],
        answer: q.answer,
      }));

      // Run scoring engine
      const result = calculateMarks(p1Questions, p1Responses, p2Questions, p2Responses);
      setFullResult(result);

      // Get performance analysis
      const perf = getPerformanceAnalysis(
        result.combined.physics, result.combined.chemistry,
        result.combined.maths, result.combined.grandTotal
      );

      // Build result record (stored in localStorage only)
      const jeeResult = {
        user_id: userId || authUser?.uid || "anonymous",
        day_number: dayNum,
        paper1_physics: result.paper1.physics,
        paper1_chemistry: result.paper1.chemistry,
        paper1_maths: result.paper1.maths,
        paper1_total: result.paper1.total,
        paper2_physics: result.paper2.physics,
        paper2_chemistry: result.paper2.chemistry,
        paper2_maths: result.paper2.maths,
        paper2_total: result.paper2.total,
        physics_total: result.combined.physics,
        chemistry_total: result.combined.chemistry,
        maths_total: result.combined.maths,
        grand_total: result.combined.grandTotal,
        total_correct: result.combined.totalCorrect,
        total_wrong: result.combined.totalWrong,
        total_unattempted: result.combined.totalUnattempted,
        accuracy_percent: result.combined.accuracyPercent,
        performance_tag: perf.tag,
        strong_subjects: perf.strongSubjects,
        weak_subjects: perf.weakSubjects,
        paper1_submitted_at: p1SubmittedAt,
        paper2_submitted_at: p2SubmittedAt,
        // Store for Review Mode
        paper1_questions: p1Questions,
        paper1_responses: p1Responses,
        paper2_questions: p2Questions,
        paper2_responses: p2Responses
      };

      // Save EVERYTHING to localStorage (results live here only)
      localStorage.setItem(`sc_jee_result_day_${dayNum}`, JSON.stringify(jeeResult));

      // Save P2 completion flag to Supabase
      const uid = userId || authUser?.uid;
      if (uid) {
        updateUserProfile(uid, { [`jee_day_${dayNum}_p2_done`]: true } as any).catch(() => { });
      }

      // Mark day completed
      const newCompleted = { ...completedDaysMap, [dayNum]: true };
      setCompletedDaysMap(newCompleted);
      localStorage.setItem("sc_jee_completed_days", JSON.stringify(newCompleted));

      // Cleanup temporary working data (NOT the final result data)
      localStorage.removeItem(`sc_jee_p1_responses_day_${dayNum}`);
      localStorage.removeItem(`sc_jee_p1_questions_day_${dayNum}`);
      localStorage.removeItem(`sc_jee_p1_submitted_at_${dayNum}`);
      localStorage.removeItem(`sc_jee_p2_responses_day_${dayNum}`);
      localStorage.removeItem(`sc_jee_p2_questions_day_${dayNum}`);

      // Show results page
      setView("results");
      return;
    }
  }, [activePaperNum, selectedDay, responses, examData, userId, authUser, completedDaysMap]);

  function saveAndMove(newStatus: QStatus) {
    if (!currentQ) return;
    const isNumerical = currentQ.type === "SA" || currentQ.type === "SA_DECIMAL";
    let opt = isNumerical ? (numAns !== "" ? numAns : null) : (responses[currentQ.id]?.option ?? null);

    let finalStatus: QStatus = newStatus;
    if (newStatus === 2 && (!opt || (Array.isArray(opt) && opt.length === 0))) finalStatus = 1;
    if (newStatus === 4 && (!opt || (Array.isArray(opt) && opt.length === 0))) finalStatus = 3;

    setResponses(prev => ({ ...prev, [currentQ.id]: { option: opt, status: finalStatus } }));

    if (activeQIdx + 1 < activeQuestions.length) {
      setActiveQIdx(activeQIdx + 1);
    }
  }

  function selectOption(val: string) {
    if (!currentQ) return;
    setResponses(prev => {
      const current = prev[currentQ.id] || { option: null, status: 1 };
      if (currentQ.type === "MSQ") {
        let arr = Array.isArray(current.option) ? current.option : [];
        if (arr.includes(val)) arr = arr.filter(v => v !== val);
        else arr = [...arr, val];
        return { ...prev, [currentQ.id]: { ...current, option: arr } };
      } else {
        return { ...prev, [currentQ.id]: { ...current, option: val } };
      }
    });
  }

  function clearResponse() {
    if (!currentQ) return;
    setNumAns("");
    setResponses(prev => ({ ...prev, [currentQ.id]: { option: null, status: 1 } }));
  }

  // ── Render Helpers ──
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const renderBackground = () => {
    if (theme === "plain") return <div className={styles.bgImageGoal} />;
    if (theme === "image") return <div className={styles.bgImageBattle} />;
    if (theme === "video") return <video ref={videoRef} autoPlay muted loop playsInline className={styles.bgVideo}><source src="/assets/videos/Red_and_Blue_Video_Generated.mp4" type="video/mp4" /></video>;
    return <div className={styles.bgImageGoal} />;
  };

  const renderSettings = () => (
    <>
      <button className={styles.settingsGear} onClick={() => setShowSettings(!showSettings)}>⚙️</button>
      {showSettings && (
        <div className={styles.settingsPanel}>
          <div className={styles.settingsHeader}>BATTLE ENGINE</div>
          <button onClick={() => { setTheme("plain"); setShowSettings(false); }} className={theme === "plain" ? styles.activeSetting : ""} style={{ width: "100%", fontSize: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", padding: "10px", borderRadius: "6px", cursor: "pointer", marginBottom: "8px" }}>Default Bg</button>
          <button onClick={() => { setTheme("image"); setShowSettings(false); }} className={theme === "image" ? styles.activeSetting : ""} style={{ width: "100%", fontSize: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", padding: "10px", borderRadius: "6px", cursor: "pointer", marginBottom: "8px" }}>Battle Bg</button>
          <button onClick={() => { setTheme("video"); setShowSettings(false); }} className={theme === "video" ? styles.activeSetting : ""} style={{ width: "100%", fontSize: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", padding: "10px", borderRadius: "6px", cursor: "pointer" }}>Battle Video</button>
        </div>
      )}
    </>
  );

  const renderNumericalKeypad = () => (
    <div className={styles.keypadGrid}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ".", "-"].map((val) => (
        <button key={val} className={styles.keyBtn} onClick={() => setNumAns(prev => prev + val.toString())}>{val}</button>
      ))}
      <button className={styles.keyBtn} style={{ gridColumn: "span 3" }} onClick={() => setNumAns(prev => prev.slice(0, -1))}>Backspace</button>
    </div>
  );

  // ── Sub-Renders ──
  if (view === "daySelection") {
    return (
      <div className={styles.wrapper}>
        {renderBackground()}{renderSettings()}
        <div className={styles.selectionOverlay}>
          <header className={styles.header}>
            <button className={styles.backButton} onClick={onBack}>← Back to Hub</button>
            <h1 className={styles.title}>JEE Advanced <span className={styles.accent}>Dashboard</span></h1>
            <p className={styles.subtitle}>Select a day to view available mock papers</p>
          </header>

          {!isPremium && (
            <div className={styles.premiumPromoCard} onClick={requestPremiumAccess}>
              <div className={styles.promoIcon}>⭐</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "15px" }}>Unlock Full Access</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>Get 10 days of mocks, detailed rank analytics & more.</div>
              </div>
              <button className={styles.promoBtn}>Go Premium</button>
            </div>
          )}

          <div className={styles.dayList}>
            {days.map((day) => {
              const isDayCompleted = completedDaysMap[day.id];
              const isInProgress = activeDay === day.id && (!p1Done || !p2Done);
              const isFreeDay = day.id <= examConfig.freeDays;
              const isLocked = examConfig.isPremium && !isPremium && !isFreeDay;

              return (
                <div
                  key={day.id}
                  className={`${styles.dayRectangle} ${isLocked ? styles.dayLocked : ""}`}
                  onClick={() => handleDayClick(day.id)}
                >
                  <div className={styles.dayIcon}>
                    {isLocked ? "🔒" : isDayCompleted ? "✓" : "⚔️"}
                  </div>
                  <div className={styles.dayInfo}>
                    <h3 className={styles.dayLabel}>
                      {day.label}
                      {isDayCompleted && <span style={{ color: "#10b981", fontSize: "12px", marginLeft: "10px" }}>✓ Completed</span>}
                      {isInProgress && <span style={{ color: "#f59e0b", fontSize: "12px", marginLeft: "10px" }}>• In Progress</span>}
                      {isLocked && <span style={{ color: "#818cf8", fontSize: "10px", marginLeft: "10px", border: "1px solid #818cf8", padding: "1px 4px", borderRadius: "4px" }}>PREMIUM</span>}
                    </h3>
                    <p className={styles.dayDesc}>
                      {isLocked ? "Unlock with Premium to continue" : isDayCompleted ? "View your detailed results and analysis" : "Full length JEE Advanced mock test"}
                    </p>
                  </div>
                  <div className={styles.dayAction}>
                    {isLocked ? "Unlock" : isDayCompleted ? "Results" : "Start →"}
                  </div>
                </div>
              );
            })}
          </div>
          {showPurchase && (
            <PurchaseScreen
              config={examConfig}
              user={purchaseUser || authUser}
              onClose={() => setShowPurchase(false)}
              onSuccess={() => {
                setIsPremium(true);
                setShowPurchase(false);
              }}
            />
          )}

          {showLogin && (
            <LoginScreen
              onSuccess={(user) => {
                setPurchaseUser(user);
                setShowLogin(false);
                if (showPurchaseAfterLogin) {
                  setShowPurchaseAfterLogin(false);
                  setShowPurchase(true);
                }
              }}
              onCancel={() => {
                setShowLogin(false);
                setShowPurchaseAfterLogin(false);
              }}
            />
          )}

          {showWelcome && (
            <div className={styles.modalOverlay}>
              <div className={styles.welcomeCard}>
                <h1 className={styles.welcomeTitle}>
                  Prepare for the <span className={styles.accent}>Ultimate Battle</span>
                </h1>
                <p className={styles.welcomeSub}>
                  Choose your access level for the most authentic JEE Advanced simulation experience.
                </p>

                <div className={styles.accessGrid}>
                  {/* Free Card */}
                  <div className={styles.accessCard} onClick={() => setShowWelcome(false)}>
                    <div style={{ fontSize: "40px", marginBottom: "20px" }}>🛡️</div>
                    <h3 style={{ fontSize: "20px", color: "#fff", marginBottom: "12px", fontWeight: 800 }}>Basic Access</h3>
                    <ul style={{ padding: 0, listStyle: "none", fontSize: "14px", color: "#94a3b8", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <li style={{ display: "flex", gap: "8px" }}><span>✓</span> 1 Full Mock Test (Day 1)</li>
                      <li style={{ display: "flex", gap: "8px" }}><span>✓</span> Performance Scorecard</li>
                      <li style={{ display: "flex", gap: "8px", color: "#f87171" }}><span>✕</span> Paper 2 is Locked</li>
                      <li style={{ display: "flex", gap: "8px", color: "#f87171" }}><span>✕</span> No Rank Estimation</li>
                    </ul>
                    <button className={styles.cardBtn} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>Continue Free</button>
                  </div>

                  {/* Premium Card */}
                  <div className={`${styles.accessCard} ${styles.accessCardPremium}`} onClick={() => { setShowWelcome(false); requestPremiumAccess(); }}>
                    <div style={{ fontSize: "40px", marginBottom: "20px" }}>👑</div>
                    <h3 style={{ fontSize: "20px", color: "#fff", marginBottom: "12px", fontWeight: 800 }}>Premium Elite</h3>
                    <ul style={{ padding: 0, listStyle: "none", fontSize: "14px", color: "#e2e8f0", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <li style={{ display: "flex", gap: "8px" }}><span>✓</span> All 10 Days (20 Papers)</li>
                      <li style={{ display: "flex", gap: "8px" }}><span>✓</span> Paper 1 & 2 Fully Unlocked</li>
                      <li style={{ display: "flex", gap: "8px" }}><span>✓</span> Advanced AIR Estimation</li>
                      <li style={{ display: "flex", gap: "8px" }}><span>✓</span> Subject-wise Deep Analysis</li>
                    </ul>
                    <button className={styles.cardBtn} style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)" }}>Get Full Access</button>
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={() => { setShowWelcome(false); requestPremiumAccess(); }}
                    style={{ background: "none", border: "none", color: "#818cf8", fontSize: "14px", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                  >
                    Already have a Lifetime Access Code? Activate Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === "dayView") {
    return (
      <div className={styles.wrapper}>
        {renderBackground()}{renderSettings()}
        <div className={styles.selectionOverlay}>
          <header className={styles.header}>
            <button className={styles.backButton} onClick={handleBackToDays}>← Back to Days</button>
            <h1 className={styles.title}>Day {selectedDay} <span className={styles.accent}>Mock Papers</span></h1>
            <p className={styles.subtitle}>Both papers must be completed to unlock next day</p>
          </header>
          <div className={styles.paperGrid}>
            <div className={styles.paperCard}>
              <div className={styles.paperBadge}>PAPER 1</div>
              <h2 className={styles.paperTitle}>JEE Advanced Paper 1</h2>
              <div className={styles.paperMeta}>
                <div className={styles.metaItem}><span>⏱️ Duration</span><strong>3 Hours</strong></div>
                <div className={styles.metaItem}><span>🎯 Marks</span><strong>180 Marks</strong></div>
                <div className={styles.metaItem}><span>📊 Status</span><strong style={{ color: (p1Done || (selectedDay && completedDaysMap[selectedDay])) ? "#10b981" : "#f59e0b" }}>{(p1Done || (selectedDay && completedDaysMap[selectedDay])) ? "COMPLETED" : "PENDING"}</strong></div>
              </div>
              <button className={styles.startButton} onClick={() => startExam(1)} disabled={p1Done || (selectedDay !== null && completedDaysMap[selectedDay])}>{(p1Done || (selectedDay !== null && completedDaysMap[selectedDay])) ? "Paper Completed" : "Start Exam"} </button>
            </div>
            <div className={styles.paperCard}>
              <div className={styles.paperBadge}>PAPER 2</div>
              <h2 className={styles.paperTitle}>JEE Advanced Paper 2</h2>
              <div className={styles.paperMeta}>
                <div className={styles.metaItem}><span>⏱️ Duration</span><strong>3 Hours</strong></div>
                <div className={styles.metaItem}><span>🎯 Marks</span><strong>180 Marks</strong></div>
                <div className={styles.metaItem}><span>📊 Status</span><strong style={{ color: (p2Done || (selectedDay && completedDaysMap[selectedDay])) ? "#10b981" : "#f59e0b" }}>{(p2Done || (selectedDay && completedDaysMap[selectedDay])) ? "COMPLETED" : "PENDING"}</strong></div>
              </div>
              <button className={styles.startButton} onClick={() => startExam(2)} disabled={p2Done || !p1Done || (selectedDay !== null && completedDaysMap[selectedDay])}>{(selectedDay !== null && completedDaysMap[selectedDay]) || p2Done ? "Paper Completed" : !p1Done ? "Complete Paper 1 First" : "Start Exam"}</button>
            </div>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressHeader}>
              <span>EXAM PROGRESS</span>
              <span>{(p1Done && p2Done) || (selectedDay && completedDaysMap[selectedDay]) ? '100%' : p1Done ? '50%' : '0%'}</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: (p1Done && p2Done) || (selectedDay && completedDaysMap[selectedDay]) ? '100%' : p1Done ? '50%' : '5%' }} />
            </div>
            <p className={styles.progressDesc}>
              This is real exam calculation. Complete both papers to view your detailed analytics and rank estimation.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {((p1Done && p2Done) || (selectedDay && completedDaysMap[selectedDay])) && (
                <button className={styles.viewResultsBtn} style={{ flex: 1 }} onClick={() => viewSavedResult(selectedDay!)}>
                  📊 VIEW RESULTS
                </button>
              )}
              <button
                className={styles.viewResultsBtn}
                style={{ flex: 1, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444" }}
                onClick={() => {
                  if (confirm("Reset all progress for Day " + selectedDay + "? This will clear your saved results.")) {
                    const dayNum = selectedDay || 1;
                    localStorage.removeItem(`sc_jee_result_day_${dayNum}`);
                    localStorage.removeItem(`sc_day_p1_done`);
                    localStorage.removeItem(`sc_day_p2_done`);
                    localStorage.removeItem("sc_active_day");
                    setP1Done(false);
                    setP2Done(false);
                    const newMap = { ...completedDaysMap };
                    delete newMap[dayNum];
                    setCompletedDaysMap(newMap);
                    localStorage.setItem("sc_jee_completed_days", JSON.stringify(newMap));
                    window.location.reload(); // Refresh to ensure fresh state
                  }
                }}
              >
                🔄 RESET DAY
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "examMode") {
    const answered = Object.values(responses).filter(r => r.status === 2 || r.status === 4).length;
    const notAns = Object.values(responses).filter(r => r.status === 1).length;
    const marked = Object.values(responses).filter(r => r.status === 3).length;
    const ansMarked = Object.values(responses).filter(r => r.status === 4).length;
    const notVisit = examData.length - Object.keys(responses).length;

    return (
      <div className={styles.examConsole}>
        {showSubmitConfirm && (
          <div className={styles.submitOverlay}>
            <div className={styles.submitDialog}>
              <p style={{ fontSize: "18px", marginBottom: "10px", fontWeight: "bold" }}>Submit Examination?</p>
              <p style={{ marginBottom: "20px" }}>Answered: {answered} | Not Answered: {notAns} | Not Visited: {notVisit}</p>
              <div className={styles.submitDialogBtns}>
                <button className={styles.fBtnWhite} onClick={() => setShowSubmitConfirm(false)}>Cancel</button>
                <button className={styles.fBtnRed} onClick={handleSubmitExam}>Submit</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.topBarHeader}>
          <div className={styles.headerLeftSection}>
            <div className={styles.topBarTier1}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>
                <div style={{ background: "#337ab7", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>i</div> Instructions
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>
                <div style={{ background: "#5cb85c", borderRadius: "2px", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>▦</div> Question Paper
              </div>
            </div>

            <div style={{ padding: "8px 15px", background: "#e8f4fb", borderBottom: "1px solid #c8d9e6" }}>
              <div style={{ background: "#337ab7", color: "#fff", padding: "4px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                JEE Advanced 2026 Paper {activePaperNum} Mock <div style={{ background: "#fff", color: "#337ab7", borderRadius: "50%", width: "12px", height: "12px", fontSize: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>i</div>
              </div>
            </div>

            <div className={styles.subjectTimerRow}>
              <div className={styles.subjectTabs}>
                {(["Math", "Phy", "Chem"] as Subject[]).map(sub => (
                  <button
                    key={sub}
                    className={`${styles.subBtn} ${activeSub === sub ? styles.subBtnActive : ""}`}
                    onClick={() => { setActiveSub(sub); setActiveSec(1); setActiveQIdx(0); }}
                  >
                    {sub === "Math" ? "MATHEMATICS" : sub === "Phy" ? "PHYSICS" : "CHEMISTRY"}
                  </button>
                ))}
              </div>
              <div className={styles.timerText}>
                Time Left : {formatTime(timeLeft)}
              </div>
            </div>

            <div className={styles.sectionBarRow}>
              <div className={styles.secLabel}>Sections</div>
              {Array.from(new Set(subjectQuestions.map(q => q.section)))
                .sort((a, b) => a - b)
                .map(sNum => (
                <div
                  key={sNum}
                  className={`${styles.secBtn} ${activeSec === sNum ? styles.secBtnActive : ""}`}
                  onClick={() => { setActiveSec(sNum); setActiveQIdx(0); }}
                >
                  {activeSub} Sec {sNum} <div className={styles.secInfoIcon}>i</div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.candidateBox} style={{ height: "152px" }}>
            <div className={styles.candPhoto}><img src={avatarSrc} alt="Candidate" /></div>
            <div className={styles.candName}>{displayName || "John Smith"}</div>
          </div>
        </div>

        <div className={styles.assessmentMarkingBlock}>
          <div className={styles.qTypeLabel}>Question Type: {currentQ?.type === "MCQ" ? "Single Correct Option" : currentQ?.type === "MSQ" ? "Multiple Correct Options" : currentQ?.type === "MATCH" ? "Match List (Single Correct)" : currentQ?.type === "SA_DECIMAL" ? "Numerical (Decimal)" : "Numerical (Integer)"}</div>
          <div className={styles.marksLabel}>
            Marks for correct answer: <span className={styles.posMark}>{(currentQ?.marks || "3, 0").split(',')[0].replace('+', '').trim()}</span> |
            Negative Marks: <span className={styles.negMark}>{(currentQ?.marks || "3, 0").split(',')[1]?.replace('-', '').trim() || "0"}</span>
          </div>
        </div>

        <div className={styles.assessmentMain}>
          <div className={styles.assessmentQuestionArea}>
            {currentQ && (
              <div style={{ position: "absolute", top: "5px", right: "5px", fontSize: "10px", color: "rgba(0,0,0,0.3)", pointerEvents: "none" }}>
                ID: {currentQ.id} | SUB: {currentQ.subject} | IMG: {currentQ.image}
              </div>
            )}
            <h3 className={styles.qNumber}>Question No. {activeQIdx + 1}</h3>
            <div className={styles.qSeparator} />

            {currentQ && (
              <div className={styles.questionScrollBody}>
                <div className={styles.qText}>
                  {/* Show passage for SA_DECIMAL questions */}
                  {currentQ.passage && (
                    <div style={{ background: "rgba(0,100,200,0.06)", border: "1px solid #c8d9e6", borderRadius: "6px", padding: "12px", marginBottom: "12px", fontSize: "14px", color: "#333", lineHeight: "1.6" }}>
                      <strong>Passage:</strong> <MathText text={currentQ.passage} />
                    </div>
                  )}
                  {/* Question text (if any) */}
                  {(currentQ.text || currentQ.question) && (
                    <p className={styles.enQ}><MathText text={currentQ.text || currentQ.question || ""} /></p>
                  )}
                  {/* Question image — primary source from paper.json */}
                  {currentQ.image && (
                    <div style={{ marginTop: "10px" }}>
                      <img src={currentQ.image} alt={`Q${currentQ.number}`} style={{ width: "100%", maxWidth: "800px" }} />
                    </div>
                  )}
                  {/* Legacy images array fallback */}
                  {!currentQ.image && currentQ.images && currentQ.images.map((imgUrl: string, i: number) => (
                    <div key={i} style={{ marginTop: "10px" }}><img src={imgUrl} alt="diagram" style={{ width: "100%", maxWidth: "800px" }} /></div>
                  ))}
                </div>

                {(currentQ.type === "SA" || currentQ.type === "SA_DECIMAL") ? (
                  <div className={styles.numericalContainer}>
                    <input type="text" className={styles.numInput} placeholder="Numerical Value" value={numAns} readOnly />
                    {renderNumericalKeypad()}
                  </div>
                ) : (
                  <div className={styles.optionList}>
                    {currentQ.options?.map((optContent, idx) => {
                      const displayKey = (idx + 1).toString();
                      const isChecked = currentQ.type === "MSQ"
                        ? (Array.isArray(responses[currentQ.id]?.option) ? (responses[currentQ.id]?.option as string[]).includes(displayKey) : false)
                        : responses[currentQ.id]?.option === displayKey;

                      return (
                        <label key={idx} className={styles.optRow}>
                          <div className={styles.optEnRow}>
                            <input
                              type={currentQ.type === "MSQ" ? "checkbox" : "radio"}
                              className={styles.optRadio}
                              checked={isChecked}
                              onChange={() => selectOption(displayKey)}
                            />
                            <span className={styles.optText}><MathText text={optContent} /></span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <div className={styles.questionFooter}>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className={styles.btnSecondary} onClick={() => saveAndMove(4)}>Mark for Review &amp; Next</button>
                <button className={styles.btnSecondary} onClick={clearResponse}>Clear Response</button>
              </div>
              <button className={styles.btnSave} onClick={() => saveAndMove(2)}>Save &amp; Next</button>
            </div>
          </div>

          <aside className={`${styles.assessmentSidebar} ${showPalette ? styles.paletteOpen : ""}`}>
            <div className={styles.sidebarContentArea}>
              <div className={styles.mobilePaletteClose} onClick={() => setShowPalette(false)}>✕</div>
              <div className={styles.statsBox}>
                <div className={styles.statRow}>
                  <QBadge status={2} label={answered} /> <span className={styles.statLabel}>Answered</span>
                </div>
                <div className={styles.statRow}>
                  <QBadge status={1} label={notAns} /> <span className={styles.statLabel}>Not Answered</span>
                </div>
                <div className={styles.statRow}>
                  <QBadge status={0} label={notVisit} /> <span className={styles.statLabel}>Not Visited</span>
                </div>
                <div className={styles.statRow}>
                  <QBadge status={3} label={marked} /> <span className={styles.statLabel}>Marked for Review</span>
                </div>
                <div className={styles.statRow} style={{ gridColumn: "span 2" }}>
                  <QBadge status={4} label={ansMarked} /> <span className={styles.statLabel}>Answered & Marked for Review (will also be evaluated)</span>
                </div>
              </div>

              <div style={{ flex: 1, padding: "0", background: "#fff", display: "flex", flexDirection: "column" }}>
                <div className={styles.paletteTitleHeader}>{activeSub} Sec {activeSec}</div>
                <div style={{ padding: "8px 15px", fontSize: "12px", background: "#f8f8f8", borderBottom: "1px solid #ddd" }}>Choose a Question</div>
                <div className={styles.paletteScroll}>
                  <div className={styles.paletteGridAssessment}>
                    {activeQuestions.map((q, idx) => (
                      <QBadge
                        key={q.id}
                        status={responses[q.id]?.status ?? 0}
                        label={q.number}
                        active={activeQIdx === idx}
                        onClick={() => setActiveQIdx(idx)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.sidebarFooter}>
              <button className={styles.btnSubmit} onClick={() => setShowSubmitConfirm(true)}>Submit</button>
            </div>
          </aside>

          {/* Floating Questions Button for Mobile (EAMCET Style) */}
          <button className={styles.mobilePaletteBtn} onClick={() => setShowPalette(true)}>
            <span style={{ marginRight: "8px" }}>⠿</span> Questions
          </button>
        </div>
      </div>
    );
  }

  if (view === "submit_summary") {
    return (
      <div className={styles.wrapper}>
        {renderBackground()}
        <div className={styles.selectionOverlay} style={{ justifyContent: "center" }}>
          <div style={{ background: "rgba(15, 15, 20, 0.95)", padding: "40px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center", color: "#fff", maxWidth: "600px", width: "100%", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", backdropFilter: "blur(20px)" }}>
            <div style={{ fontSize: "50px", marginBottom: "20px" }}>⚔️</div>
            <h1 style={{ color: "#10b981", marginBottom: "8px", fontSize: "32px", fontWeight: 800 }}>Paper {activePaperNum} Submitted!</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "30px" }}>You've successfully completed the first half of the battle.</p>

            {lastPaperResult && (
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "24px", marginBottom: "30px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Paper 1 Score</div>
                <div style={{ fontSize: "48px", fontWeight: 900, color: "#fff", marginBottom: "20px" }}>
                  {lastPaperResult.total}<span style={{ fontSize: "20px", color: "rgba(255,255,255,0.3)" }}>/180</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <div style={{ color: "#10b981", fontWeight: 700 }}>{lastPaperResult.correct}</div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>CORRECT</div>
                  </div>
                  <div style={{ background: "rgba(239, 68, 68, 0.1)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    <div style={{ color: "#ef4444", fontWeight: 700 }}>{lastPaperResult.wrong}</div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>WRONG</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))", padding: "20px", borderRadius: "16px", border: "1px solid rgba(99, 102, 241, 0.2)", marginBottom: "30px" }}>
              <p style={{ color: "#a5b4fc", fontSize: "15px", fontWeight: 600, lineHeight: "1.5" }}>
                🎯 Complete Paper 2 now to unlock your All India Rank (AIR), Percentile, and Subject-wise Analytics!
              </p>
            </div>

            <button className={styles.startButton} onClick={() => setView("dayView")} style={{ width: "100%", height: "56px", fontSize: "18px" }}>
              Continue to Paper 2 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "jee_login") {
    return (
      <div className={styles.tcsContainer}>
        <div className={styles.tcsHeader}>
          <div className={styles.tcsHeaderTop}>
            <div className={styles.tcsSystemName}>
              System Name : <span className={styles.tcsYellow}>C001</span>
              <div className={styles.tcsSystemDesc}>Kindly contact the invigilator if there are any discrepancies in the Name and Photograph displayed on the screen...</div>
            </div>
            <div className={styles.tcsCandidateInfo}>
              <div className={styles.tcsCandText}>
                Candidate Name : <span className={styles.tcsYellow}>{displayName}</span><br />
                Subject : <span className={styles.tcsYellow}>JEE Advanced Paper {activePaperNum}</span>
              </div>
              <div className={styles.tcsCandPhoto}><img src={avatarSrc} alt="candidate" /></div>
            </div>
          </div>
        </div>

        <div className={styles.tcsLoginBody}>
          <div className={styles.tcsLoginBox}>
            <div className={styles.tcsLoginTitle}>Login</div>
            <div className={styles.tcsInputGroup}>
              <div className={styles.tcsInputIcon}>👤</div>
              <input type="text" value="11111" readOnly className={styles.tcsInput} />
            </div>
            <div className={styles.tcsInputGroup}>
              <div className={styles.tcsInputIcon}>🔒</div>
              <input type="password" value="*****" readOnly className={styles.tcsInput} />
              <div className={styles.tcsKeyboardIcon}>⌨️</div>
            </div>
            <button className={styles.tcsSignInBtn} onClick={() => setView("jee_inst1")}>Sign In</button>
          </div>
        </div>
        <div className={styles.tcsFooter}>© 2026 JEE Advanced. All rights reserved.</div>
      </div>
    );
  }

  if (view === "jee_inst1") {
    return (
      <div className={styles.tcsInstContainer}>
        <div className={styles.tcsInstHeader}>Instructions</div>
        <div className={styles.tcsInstBody}>
          <div className={styles.tcsInstContent}>
            <h3 style={{ color: "#333", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>General Instructions:</h3>
            <ol className={styles.tcsInstList}>
              <li>Total duration of examination is 180 minutes.</li>
              <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination.</li>
              <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
                <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}><QBadge status={0} label="1" /> Not Visited</div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}><QBadge status={1} label="2" /> Not Answered</div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}><QBadge status={2} label="3" /> Answered</div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}><QBadge status={3} label="4" /> Marked for Review</div>
                </div>
              </li>
              <li>You can click on the "&gt;" arrow which appears to the left of question palette to collapse the question palette...</li>
            </ol>
          </div>
          <div className={styles.tcsInstSidebar}>
            <div className={styles.tcsCandPhotoLarge}><img src={avatarSrc} alt="candidate" /></div>
            <div style={{ textAlign: "center", fontWeight: "bold", marginTop: "10px" }}>{displayName}</div>
          </div>
        </div>
        <div className={styles.tcsInstFooter}>
          <button className={styles.tcsWhiteBtn} onClick={() => setView("dayView")}>Exit</button>
          <button className={styles.tcsBlueBtn} onClick={() => setView("jee_inst2")}>Next &gt;</button>
        </div>
      </div>
    );
  }

  if (view === "jee_inst2") {
    return (
      <div className={styles.tcsInstContainer}>
        <div className={styles.tcsInstHeader}>Other Important Instructions</div>
        <div className={styles.tcsInstBody}>
          <div className={styles.tcsInstContent}>
            <h3 style={{ color: "#333" }}>Paper Pattern & Marking Scheme:</h3>
            <p>This paper contains 51 questions in total (17 per subject).</p>
            <table className={styles.tcsTable}>
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Question Type</th>
                  <th>Correct</th>
                  <th>Negative</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Section 1</td><td>Single Correct MCQ</td><td>+3</td><td>-1</td></tr>
                <tr><td>Section 2</td><td>Multiple Correct MSQ</td><td>+4</td><td>-2</td></tr>
                <tr><td>Section 3</td><td>Numerical Integer</td><td>+4</td><td>0</td></tr>
                <tr><td>Section 4</td><td>Numerical Decimal</td><td>+3</td><td>0</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tcsInstFooter}>
          <button className={styles.tcsWhiteBtn} onClick={() => setView("jee_inst1")}>&lt; Previous</button>
          <button className={styles.tcsBlueBtn} onClick={() => setView("jee_decl")}>Next &gt;</button>
        </div>
      </div>
    );
  }

  if (view === "jee_decl") {
    return (
      <div className={styles.tcsInstContainer}>
        <div className={styles.tcsInstHeader}>Declaration</div>
        <div className={styles.tcsInstBody} style={{ flexDirection: "column" }}>
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", background: "#fff", border: "1px solid #ddd" }}>
            <p style={{ fontWeight: "bold" }}>I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc...</p>
            <div style={{ marginTop: "30px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <input type="checkbox" checked={declChecked} onChange={(e) => setDeclChecked(e.target.checked)} style={{ marginTop: "4px" }} />
              <label>I have read and understood the instructions. All computer hardware allotted to me are in proper working condition...</label>
            </div>
          </div>
        </div>
        <div className={styles.tcsInstFooter}>
          <button className={styles.tcsWhiteBtn} onClick={() => setView("jee_inst2")}>&lt; Previous</button>
          <button
            className={styles.tcsBlueBtn}
            disabled={!declChecked}
            style={{ background: declChecked ? "#5cb85c" : "#ccc", border: declChecked ? "1px solid #4cae4c" : "1px solid #ccc" }}
            onClick={() => setView("examMode")}
          >
            I am ready to begin
          </button>
        </div>
      </div>
    );
  }

  if (view === "results" && fullResult) {
    return (
      <JEEResultsPage
        result={fullResult}
        dayNumber={selectedDay || 1}
        userId={userId || authUser?.uid}
        isPremium={isPremium}
        onBack={() => {
          setView("daySelection");
          setSelectedDay(null);
        }}
        onViewDayResult={(d) => {
          // Load saved result for that day
          const saved = localStorage.getItem(`sc_jee_result_day_${d}`);
          if (saved) {
            try {
              const savedResult = JSON.parse(saved);
              // Reconstruct FullResult from saved JEEResult
              const reconstructed: FullResult = {
                paper1: {
                  physics: savedResult.paper1_physics || 0,
                  chemistry: savedResult.paper1_chemistry || 0,
                  maths: savedResult.paper1_maths || 0,
                  total: savedResult.paper1_total || 0,
                  correct: 0, wrong: 0, unattempted: 0,
                },
                paper2: {
                  physics: savedResult.paper2_physics || 0,
                  chemistry: savedResult.paper2_chemistry || 0,
                  maths: savedResult.paper2_maths || 0,
                  total: savedResult.paper2_total || 0,
                  correct: 0, wrong: 0, unattempted: 0,
                },
                combined: {
                  physics: savedResult.physics_total || 0,
                  chemistry: savedResult.chemistry_total || 0,
                  maths: savedResult.maths_total || 0,
                  grandTotal: savedResult.grand_total || 0,
                  totalCorrect: savedResult.total_correct || 0,
                  totalWrong: savedResult.total_wrong || 0,
                  totalUnattempted: savedResult.total_unattempted || 0,
                  accuracyPercent: savedResult.accuracy_percent || 0,
                  timeEfficiencyTag: "—",
                },
              };
              setFullResult(reconstructed);
              setSelectedDay(d);
            } catch { }
          }
        }}
      />
    );
  }

  return null;
}
