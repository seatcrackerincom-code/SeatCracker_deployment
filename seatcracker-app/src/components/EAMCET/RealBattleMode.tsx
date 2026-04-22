"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import styles from "./RealBattleMode.module.css";
import BattleCinema from "./BattleCinema";
import BattleFailureCinema from "./BattleFailureCinema";
import BattleEgoMode from "./BattleEgoMode";
import { type User } from "../../lib/firebase";
import { type AccessState } from "../../lib/access";
import { saveMockAttempt, updateUserProfile } from "../../lib/supabase";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const AVATAR_LS_KEY = "sc_profile_avatar";

// ── Types ──────────────────────────────────────────────────────────────────
type Subject = "Mathematics" | "Physics" | "Chemistry" | "Botany" | "Zoology";

// ── Exam label helper ─────────────────────────────────────────────────────
function getExamLabel(exam: string, course: string): string {
  const isTS = exam === "TS";
  if (isTS) {
    // TS EAMCET
    if (course === "Engineering") return "TS EAMCET Mock (Engineering)";
    if (course === "Agriculture") return "TS EAMCET Mock (Agriculture)";
    if (course === "Pharmacy") return "TS EAMCET Mock (Pharmacy)";
    return "TS EAMCET Mock";
  }
  // AP EAPCET
  if (course === "Engineering") return "AP EAPCET Mock (Engineering)";
  if (course === "Agriculture") return "AP EAPCET Mock (Agriculture)";
  if (course === "Pharmacy") return "AP EAPCET Mock (Pharmacy)";
  return "AP EAPCET Mock";
}

interface Question {
  id: number;
  question: string;
  questionTe?: string; // Optional Telugu question
  options: string[]; // Options array ["(1) ...", ...]
  optionsTe?: string[]; // Optional Telugu options
  subject: Subject;
  images: string[]; // Single unified array for all images
  answer: string; // Enforced required answer
}

// 0=not visited, 1=not answered (red), 2=answered (green), 3=marked-not-answered (purple), 4=answered+marked (purple+green badge)
type QStatus = 0 | 1 | 2 | 3 | 4;

interface Response {
  option: string | null;
  status: QStatus;
}

interface Props {
  userId: string;
  exam: string;
  course: string;
  onBack: () => void;
  authUser?: User | null;
}

// ── Course subject maps ────────────────────────────────────────────────────
const COURSE_SECTIONS: Record<string, { subject: Subject; count: number }[]> = {
  Engineering: [
    { subject: "Mathematics", count: 80 },
    { subject: "Physics", count: 40 },
    { subject: "Chemistry", count: 40 },
  ],
  Agriculture: [
    { subject: "Botany", count: 40 },
    { subject: "Zoology", count: 40 },
    { subject: "Physics", count: 40 },
    { subject: "Chemistry", count: 40 },
  ],
  Pharmacy: [
    { subject: "Botany", count: 40 },
    { subject: "Zoology", count: 40 },
    { subject: "Physics", count: 40 },
    { subject: "Chemistry", count: 40 },
  ],
};

// ── Math Rendering Helper ──────────────────────────────────────────────────
const MathText = ({ text }: { text: string }) => {
  if (!text) return null;
  // Simple regex to split by $...$ (inline math)
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

// ── Info Icon component ────────────────────────────────────────────────────
const InfoIcon = ({ className }: { className?: string }) => (
  <span className={`${styles.infoIcon} ${className || ""}`}>i</span>
);

// ── Status Badge Component (Custom Shapes) ──────────────────────────────────
const QBadge = ({ status, label, active, onClick }: { status: QStatus, label: string | number, active?: boolean, onClick?: () => void }) => {
  const getShape = () => {
    switch (status) {
      case 2: // Answered (House UP)
        return (
          <svg viewBox="0 0 100 100" className={styles.qSvg}>
            <defs>
              <linearGradient id="gradS2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#89d33b" }} />
                <stop offset="100%" style={{ stopColor: "#5fa023" }} />
              </linearGradient>
            </defs>
            <path d="M50 2 L98 40 L98 98 L2 98 L2 40 Z" fill="url(#gradS2)" stroke="#4a7d1a" strokeWidth="2" />
            <text x="50" y="70" textAnchor="middle" fill="#fff" fontSize="42" fontWeight="800">{label}</text>
          </svg>
        );
      case 1: // Not Answered (Shield DOWN)
        return (
          <svg viewBox="0 0 100 100" className={styles.qSvg}>
            <defs>
              <linearGradient id="gradS1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#ff7442" }} />
                <stop offset="100%" style={{ stopColor: "#d44a1b" }} />
              </linearGradient>
            </defs>
            <path d="M2 2 L98 2 L98 65 L50 98 L2 65 Z" fill="url(#gradS1)" stroke="#a53814" strokeWidth="2" />
            <text x="50" y="52" textAnchor="middle" fill="#fff" fontSize="42" fontWeight="800">{label}</text>
          </svg>
        );
      case 3: // Marked (Circle)
        return (
          <svg viewBox="0 0 100 100" className={styles.qSvg}>
            <circle cx="50" cy="50" r="48" fill="#7d54b2" stroke="#6a4598" strokeWidth="2" />
            <text x="50" y="65" textAnchor="middle" fill="#fff" fontSize="42" fontWeight="800">{label}</text>
          </svg>
        );
      case 4: // Answered & Marked (Circle + Badge)
        return (
          <svg viewBox="0 0 100 100" className={styles.qSvg}>
            <circle cx="50" cy="50" r="48" fill="#7d54b2" stroke="#6a4598" strokeWidth="2" />
            <rect x="58" y="58" width="40" height="40" rx="4" fill="#71b92c" stroke="#fff" strokeWidth="3" />
            <path d="M68 78 L76 86 L88 74" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
            <text x="50" y="65" textAnchor="middle" fill="#fff" fontSize="42" fontWeight="800">{label}</text>
          </svg>
        );
      default: // Not Visited (Rounded Rect)
        return (
          <svg viewBox="0 0 100 100" className={styles.qSvg}>
            <defs>
              <linearGradient id="gradS0" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#ffffff" }} />
                <stop offset="100%" style={{ stopColor: "#e5e7eb" }} />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="92" height="92" rx="8" fill="url(#gradS0)" stroke="#bbb" strokeWidth="2" />
            <text x="50" y="65" textAnchor="middle" fill="#333" fontSize="42" fontWeight="800">{label}</text>
          </svg>
        );
    }
  };

  return (
    <div
      className={`${styles.qBadgeBox} ${active ? styles.qActive : ""}`}
      onClick={onClick}
    >
      {getShape()}
    </div>
  );
};

// ── Component ──────────────────────────────────────────────────────────────
export default function RealBattleMode({ userId, exam, course, onBack, authUser }: Props) {
  // Real Battle Mode - High Fidelity Exam Simulation
  const sections = COURSE_SECTIONS[course] || COURSE_SECTIONS.Engineering;

  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AVATAR_LS_KEY);
      if (saved) setProfileImage(saved);
    } catch {}
  }, []);

  const avatarSrc = profileImage || authUser?.photoURL || "/avatar.png";
  const displayName = authUser?.displayName || (authUser?.email ? authUser.email.split('@')[0] : "Learner");
  const examLabel = getExamLabel(exam, course);

  // ── States ──
  const [allQ, setAllQ] = useState<Question[]>([]);
  const [isLoadingMock, setIsLoadingMock] = useState(false);
  const [phase, setPhase] = useState<
    | "cinema"
    | "submodeSelection"
    | "selection"
    | "login"
    | "instr1"
    | "instr2"
    | "instr3"
    | "exam"
    | "failure_cinema"
    | "ego_mode"
    | "terminated"
    | "comingSoon"
    | "submit_summary"
    | "results"
  >("submodeSelection");
  const [hasSeenRules, setHasSeenRules] = useState(false);
  const [nowTime, setNowTime] = useState(Date.now());
  const [warningCount, setWarningCount] = useState(0);
  const [selectedMock, setSelectedMock] = useState<string | null>(null);
  const [instrPage, setInstrPage] = useState(1); // 1-3
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<Subject>(sections[0].subject);
  const [curIdx, setCurIdx] = useState(0);
  const [responses, setResponses] = useState<Record<number, Response>>({});
  const [secs, setSecs] = useState(180 * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [alertModal, setAlertModal] = useState<{ show: boolean, title: string, message: string } | null>(null);
  const [theme, setTheme] = useState<"video" | "image" | "plain">("video");
  const [showSettings, setShowSettings] = useState(false);
  // ── Mobile / Orientation States ──
  const [isPortrait, setIsPortrait] = useState(false);
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [isFullScreenLost, setIsFullScreenLost] = useState(false);

  // ── Persistence Init ──
  useEffect(() => {
    const savedTheme = localStorage.getItem("sc_battle_theme");
    if (savedTheme) setTheme(savedTheme as any);

    const savedPhase = localStorage.getItem("sc_battle_phase");
    // Only restore phase if the user was actively taking the exam
    if (savedPhase === "exam") {
      setPhase(savedPhase as any);
    }

    // Timer always starts fresh — never restore from storage
    // const savedSecs = localStorage.getItem("sc_battle_secs");
    // if (savedSecs) setSecs(parseInt(savedSecs));

    const savedMock = localStorage.getItem("sc_battle_mock");
    if (savedMock) {
      console.log("Restoring mock from storage:", savedMock);
      setSelectedMock(savedMock);
    }

    const savedRules = localStorage.getItem("sc_battle_rules_seen");
    if (savedRules) setHasSeenRules(true);


    // Detect orientation
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 1024);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // Update nowTime every second to keep countdowns live
  useEffect(() => {
    if (phase !== "selection") return;
    const t = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const hasInitialized = useRef(false);

  // ── Persistence Save ──
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }
    
    // Only persist the phase if the exam has officially started
    if (phase === "exam") {
      localStorage.setItem("sc_battle_phase", phase);
      localStorage.setItem("sc_battle_secs", secs.toString());
      if (selectedMock) localStorage.setItem("sc_battle_mock", selectedMock);
    } else {
      // Clear them if we leave the exam unexpectedly (excluding submit)
      if (phase === "selection" || phase === "submodeSelection") {
        localStorage.removeItem("sc_battle_phase");
        localStorage.removeItem("sc_battle_secs");
        localStorage.removeItem("sc_battle_mock");
      }
    }
    
    localStorage.setItem("sc_battle_theme", theme);
  }, [phase, secs, theme, selectedMock]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.25; // SLOW MOTION (quarter speed)
    }
  }, [theme, phase]);

  // ── Background Engine ──
  const renderBackground = () => {
    if (theme === "plain") return <div className={styles.bgImageGoal} />;
    if (theme === "image") return <div className={styles.bgImageBattle} />;
    if (theme === "video") {
      return (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          className={styles.bgVideo}
        >
          <source src="/assets/videos/Red_and_Blue_Video_Generated.mp4" type="video/mp4" />
        </video>
      );
    }
    return <div className={styles.bgImageGoal} />;
  };

  const renderSettings = () => (
    <>
      <button className={styles.settingsGear} onClick={() => setShowSettings(!showSettings)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
      {showSettings && (
        <div className={styles.settingsPanel}>
          <div className={styles.settingsHeader}>UI SETTINGS</div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", padding: "0 4px" }}>
            <span style={{ color: "white", fontSize: "13px", fontWeight: "500" }}>Live Animations</span>
            <div
              onClick={() => setTheme(theme === "video" ? "image" : "video")}
              style={{
                width: "40px",
                height: "20px",
                background: theme === "video" ? "#10b981" : "#334155",
                borderRadius: "20px",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              <div style={{
                position: "absolute",
                top: "2px",
                left: theme === "video" ? "22px" : "2px",
                width: "16px",
                height: "16px",
                background: "white",
                borderRadius: "50%",
                transition: "all 0.3s"
              }} />
            </div>
          </div>

          <button
            onClick={() => { setTheme("plain"); setShowSettings(false); }}
            className={theme === "plain" ? styles.activeSetting : ""}
            style={{ fontSize: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Use Goal Background
          </button>

          <button
            onClick={() => { setTheme("image"); setShowSettings(false); }}
            className={theme === "image" ? styles.activeSetting : ""}
            style={{ fontSize: "12px", textAlign: "center", marginTop: "8px", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Use Battle Background
          </button>
        </div>
      )}
    </>
  );

  // ── Derived values ──

  const handleSubmitExam = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.warn(err));
    }
    // Save submission data for results & cooldown
    if (selectedMock) {
      const mockId = selectedMock.toLowerCase().replace(/\s+/g, "_");
      const submitNow = Date.now();
      localStorage.setItem(`sc_submit_time_${mockId}`, submitNow.toString());
      localStorage.setItem(`sc_responses_${mockId}`, JSON.stringify(responses));
      localStorage.setItem(`sc_questions_${mockId}`, JSON.stringify(allQ));
      localStorage.setItem(`sc_mock_completed_${mockId}`, "true");

      const prevSubmits = JSON.parse(localStorage.getItem("sc_daily_submits") || "[]");
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const todaySubmits = prevSubmits.filter((t: number) => t > todayStart.getTime());
      todaySubmits.push(submitNow);
      localStorage.setItem("sc_daily_submits", JSON.stringify(todaySubmits));
      localStorage.setItem("sc_last_submit_time", submitNow.toString());

      // ── Supabase Sync ──
      const totalCount = allQ.length;
      let correctCount = 0;
      allQ.forEach(q => {
        if (responses[q.id]?.option === q.answer) correctCount++;
      });
      const accuracyPct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

      saveMockAttempt({
        user_id: userId,
        mock_id: mockId,
        responses: responses,
        questions_snapshot: allQ,
        score: correctCount,
        total: totalCount,
        accuracy: accuracyPct,
        submitted_at: new Date(submitNow).toISOString()
      });

      updateUserProfile(userId, {
        last_submit_time: new Date(submitNow).toISOString(),
        daily_submits: todaySubmits
      });
    }
    // Clear persisted exam state
    localStorage.removeItem("sc_battle_phase");
    localStorage.removeItem("sc_battle_secs");
    localStorage.removeItem("sc_battle_mock");
    setShowSubmitConfirm(false);
    setPhase("submit_summary");
  }, [selectedMock, responses, allQ, userId]);

  // ── Effects ──
  // Handle mock selection and loading
  useEffect(() => {
    if (!selectedMock) {
      return;
    }

    // Only run fetch on client side — prevents SSR TypeError
    if (typeof window === "undefined") return;

    const mockMatch = selectedMock?.match(/Mock Test (\d+)/i);
    const mockNumber = mockMatch ? mockMatch[1] : null;

    if (mockNumber && course) {
      const controller = new AbortController();
      setIsLoadingMock(true);
      setResponses({}); // reset responses for fresh mock start

      const folderName = course; // Engineering, Agriculture, or Pharmacy
      const url = `${window.location.origin}/EAMCET/real_mocks/${folderName}/mock_test_${mockNumber}/realMock${mockNumber}.json`;
      console.log("[RealBattleMode] Fetching real mock questions from:", url);

      fetch(url, { signal: controller.signal })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then((data: any) => {
          let rawQuestions: any[] = [];
          if (Array.isArray(data)) {
            rawQuestions = data;
          } else if (data && Array.isArray(data.questions)) {
            rawQuestions = data.questions;
          }

          const mapped: Question[] = rawQuestions.map((q: any) => {
            // ── Subject normalization (handles both upper and mixed case) ──
            const rawSubject = (q.subject || "").toLowerCase().trim();
            let subject: Subject;
            if (rawSubject === "mathematics" || rawSubject === "maths" || rawSubject === "math") subject = "Mathematics";
            else if (rawSubject === "physics") subject = "Physics";
            else if (rawSubject === "chemistry") subject = "Chemistry";
            else if (rawSubject === "botany") subject = "Botany";
            else if (rawSubject === "zoology") subject = "Zoology";
            else subject = "Mathematics"; // default

            // ── Options: handle both array and {A,B,C,D} object ──
            let options: string[] = [];
            if (Array.isArray(q.options)) {
              options = q.options;
            } else if (q.options && typeof q.options === 'object') {
              options = [
                `(1) ${q.options.A || ""}`,
                `(2) ${q.options.B || ""}`,
                `(3) ${q.options.C || ""}`,
                `(4) ${q.options.D || ""}`
              ];
            }

            // ── Answer: normalize A/B/C/D → 1/2/3/4 ──
            let answer = q.answer || q.correct_answer || "1";
            if (answer === "A") answer = "1";
            else if (answer === "B") answer = "2";
            else if (answer === "C") answer = "3";
            else if (answer === "D") answer = "4";

            // ── Image path: collapse into images array ──
            const normalizeImgPath = (p: string) => {
              if (!p) return undefined;
              return p.startsWith("/EAMCET") ? p.slice(7) : p;
            };

            const rawImages = Array.isArray(q.images) ? q.images : [q.image];
            const cleanImages = rawImages.filter(Boolean).map((img: any) => normalizeImgPath(String(img)) as string);

            return {
              id: Number(q.id),
              subject,
              question: q.question || "No question text provided.",
              questionTe: q.questionTe || undefined,
              options: options.length > 0 ? options : ["(1) Option A", "(2) Option B", "(3) Option C", "(4) Option D"],
              optionsTe: q.optionsTe || undefined,
              answer: String(answer),
              images: cleanImages
            };
          });

          console.log("[RealBattleMode] Loaded", mapped.length, "real questions.");
          setAllQ(mapped);
        })
        .catch(err => {
          if (err.name === "AbortError") {
            console.log("[RealBattleMode] Fetch aborted (cleanup), ignoring.");
            return;
          }
          console.error("[RealBattleMode] Failed to load mock questions:", err);
          setAllQ([{ 
            id: 1, 
            subject: "Mathematics", 
            question: "❌ Loading Failed: Could not retrieve mock questions. Please refresh the page.", 
            options: ["(1) Connection Error", "(2) Server Timeout", "(3) File Not Found", "(4) Check Internet"], 
            answer: "1",
            images: []
          }]);
        })
        .finally(() => {
          setIsLoadingMock(false);
        });

      // Cleanup: abort in-flight request if selectedMock changes
      return () => controller.abort();
    } else {
      setAllQ([]);
      setIsLoadingMock(false);
    }
  }, [selectedMock, course]); // Re-run when selectedMock or course changes

  // Timer — counts down only during exam phase
  useEffect(() => {
    if (phase !== "exam") return;
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // When time hits 0, auto-submit the exam
  useEffect(() => {
    if (phase === "exam" && secs === 0) {
      handleSubmitExam();
    }
  }, [secs, phase, handleSubmitExam]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sc = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sc).padStart(2, "0")}`;
  };

  // ── Security: Fullscreen + Tab-switch detection ───────────────────────────────
  useEffect(() => {
    if (phase !== "exam") return;

    const handleViolation = (msg: string) => {
      setWarningCount(prev => {
        const next = prev + 1;
        if (next >= 3) {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.warn(err));
          }
          setPhase("terminated");
        } else {
          setAlertModal({
            show: true,
            title: `Security Warning (${next}/3)`,
            message: `${msg}\n\nPlease continue in full screen or else the exam will terminate.`
          });
        }
        return next;
      });
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        handleViolation("Switching tabs or minimizing the browser is NOT allowed!");
      }
    };

    const handleBlur = () => {
      handleViolation("Leaving the exam window or clicking outside is NOT allowed!");
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && phase === "exam") {
        setIsFullScreenLost(true);
      } else {
        setIsFullScreenLost(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [phase, setAlertModal]);
  // ── UI Control: Hide Global Header during exam flow ──
  useEffect(() => {
    const hiddenPhases = ["login", "instr1", "instr2", "instr3", "exam", "terminated", "failure_cinema", "ego_mode", "submodeSelection", "selection"];
    if (hiddenPhases.includes(phase)) {
      document.body.classList.add("exam-writing");
    } else {
      document.body.classList.remove("exam-writing");
    }
    return () => document.body.classList.remove("exam-writing");
  }, [phase]);

  // Questions for active section (moved up to fix 'used before declaration' error)
  const secQ = allQ.filter(q => q.subject.toLowerCase() === activeTab.toLowerCase());
  const curQ = secQ[curIdx];

  // Mark current question as 'Not Answered' (visited=orange) upon viewing
  useEffect(() => {
    if (phase !== "exam") return;
    if (!curQ) return;
    setResponses(prev => {
      // Only update if not already visited (status 0 = not visited, undefined = not visited)
      const existing = prev[curQ.id];
      if (existing) return prev; // already has a status, don't overwrite
      return { ...prev, [curQ.id]: { option: null, status: 1 } };
    });
  }, [curQ?.id, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // When questions finish loading, auto-select the first subject tab that has questions.
  useEffect(() => {
    if (allQ.length === 0) return;
    setCurIdx(0);
    const firstSubjectInData = allQ[0]?.subject;
    if (firstSubjectInData) {
      const currentTabHasQs = allQ.some(q => q.subject === activeTab);
      if (!currentTabHasQs) {
        setActiveTab(firstSubjectInData);
      }
    }
  }, [allQ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preload all images to eliminate latency
  useEffect(() => {
    if (allQ && allQ.length > 0) {
      allQ.forEach((q) => {
        if (q.images && q.images.length > 0) {
          q.images.forEach(imgUrl => {
            const imgPath = imgUrl.startsWith("http") ? imgUrl : `/EAMCET${imgUrl}`;
            const img = new Image();
            img.src = imgPath;
          });
        }
      });
    }
  }, [allQ]);

  const startExam = useCallback(() => {
    // Enter fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.warn("Fullscreen request failed:", err);
      });
    }
    // Attempt portrait lock for mobile
    if (screen.orientation && (screen.orientation as any).lock) {
      try {
        (screen.orientation as any).lock("portrait").catch(() => { });
      } catch (e) { }
    }
    // Always reset timer to full 180 minutes on every exam start
    setSecs(180 * 60);
    setPhase("exam");
  }, []);





  const handleBack = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.warn(err));
    }
    // ── Save submission data for results & cooldown ──
    if (selectedMock) {
      const mockId = selectedMock.toLowerCase().replace(/\s+/g, "_");
      const now = Date.now();
      localStorage.setItem(`sc_submit_time_${mockId}`, now.toString());
      localStorage.setItem(`sc_responses_${mockId}`, JSON.stringify(responses));
      localStorage.setItem(`sc_questions_${mockId}`, JSON.stringify(allQ));
      localStorage.setItem(`sc_mock_completed_${mockId}`, "true");

      const prevSubmits = JSON.parse(localStorage.getItem("sc_daily_submits") || "[]");
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const todaySubmits = prevSubmits.filter((t: number) => t > todayStart.getTime());
      todaySubmits.push(now);
      localStorage.setItem("sc_daily_submits", JSON.stringify(todaySubmits));
      localStorage.setItem("sc_last_submit_time", now.toString());

      // ── Supabase Sync ──
      const totalCount = allQ.length;
      let correctCount = 0;
      allQ.forEach(q => {
        if (responses[q.id]?.option === q.answer) correctCount++;
      });
      const accuracyPct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

      saveMockAttempt({
        user_id: userId,
        mock_id: mockId,
        responses: responses,
        questions_snapshot: allQ,
        score: correctCount,
        total: totalCount,
        accuracy: accuracyPct,
        submitted_at: new Date(now).toISOString()
      });

      updateUserProfile(userId, {
        last_submit_time: new Date(now).toISOString(),
        daily_submits: todaySubmits
      });
    }
    // Clear persisted exam state
    localStorage.removeItem("sc_battle_phase");
    localStorage.removeItem("sc_battle_secs");
    localStorage.removeItem("sc_battle_mock");
    onBack();
  }, [onBack, selectedMock, responses, allQ, userId]);

  // Counts
  const answered = Object.values(responses).filter(r => r.status === 2 || r.status === 4).length;
  const notAns = Object.values(responses).filter(r => r.status === 1).length;
  const marked = Object.values(responses).filter(r => r.status === 3).length;
  const ansMarked = Object.values(responses).filter(r => r.status === 4).length;
  const notVisit = allQ.length - Object.keys(responses).length;

  const selOption = curQ ? (responses[curQ.id]?.option ?? null) : null;

  // Section-level stats for tooltip
  const getSectionStats = (sub: Subject) => {
    const qs = allQ.filter(q => q.subject === sub);
    const a = qs.filter(q => responses[q.id]?.status === 2 || responses[q.id]?.status === 4).length;
    const na = qs.filter(q => responses[q.id]?.status === 1).length;
    const nv = qs.filter(q => !responses[q.id] || responses[q.id]?.status === 0).length;
    const mk = qs.filter(q => responses[q.id]?.status === 3).length;
    const am = qs.filter(q => responses[q.id]?.status === 4).length;
    return { a, na, nv, mk, am, total: qs.length };
  };

  // All-course stats for the course-level tooltip
  const getAllStats = () => {
    const a = Object.values(responses).filter(r => r.status === 2 || r.status === 4).length;
    const na = Object.values(responses).filter(r => r.status === 1).length;
    const nv = allQ.length - Object.keys(responses).length;
    const mk = Object.values(responses).filter(r => r.status === 3).length;
    const am = Object.values(responses).filter(r => r.status === 4).length;
    return { a, na, nv, mk, am };
  };

  function saveAndMove(newStatus: QStatus, nextIdx: number | null) {
    if (!curQ) return;
    const opt = responses[curQ.id]?.option ?? null;
    // Determine final status
    let finalStatus: QStatus = newStatus;
    if (newStatus === 2 && !opt) finalStatus = 1; // save without answer → not answered
    if (newStatus === 4 && !opt) finalStatus = 3; // mark without answer → marked only

    setResponses(prev => ({
      ...prev,
      [curQ.id]: { option: opt, status: finalStatus },
    }));

    if (nextIdx !== null) {
      if (nextIdx < secQ.length) {
        setCurIdx(nextIdx);
      }
    }
  }

  function selectOption(o: string) {
    if (!curQ) return;
    setResponses(prev => ({
      ...prev,
      [curQ.id]: { option: o, status: prev[curQ.id]?.status ?? 0 },
    }));
  }

  function clearResponse() {
    if (!curQ) return;
    setResponses(prev => ({
      ...prev,
      [curQ.id]: { option: null, status: 1 },
    }));
  }

  function jumpTo(tab: Subject, idx: number) {
    setActiveTab(tab);
    setCurIdx(idx);
  }

  // ── Tooltip renderer ────────────────────────────────────────────────────
  const renderTooltip = (title: string, stats: { a: number; na: number; nv: number; mk: number; am: number }) => (
    <div className={styles.infoTooltip}>
      <div className={styles.tooltipTitle}>{title}</div>
      <div className={styles.tooltipRow}>
        <span className={`${styles.tooltipBadge} ${styles.s2}`}>{stats.a}</span>
        <span>Answered</span>
      </div>
      <div className={styles.tooltipRow}>
        <span className={`${styles.tooltipBadge} ${styles.s1}`}>{stats.na}</span>
        <span>Not Answered</span>
      </div>
      <div className={styles.tooltipRow}>
        <span className={`${styles.tooltipBadge} ${styles.s0}`}>{stats.nv}</span>
        <span>Not Visited</span>
      </div>
      <div className={styles.tooltipRow}>
        <span className={`${styles.tooltipBadge} ${styles.s3}`}>{stats.mk}</span>
        <span>Marked for Review</span>
      </div>
      <div className={styles.tooltipRow}>
        <span className={`${styles.tooltipBadge} ${styles.s4}`}>{stats.am}</span>
        <span>Answered & Marked for Review (will also be evaluated)</span>
      </div>
    </div>
  );

  const renderSubmitSummary = () => {
    return (
      <div className={styles.selectionOverlay} style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {renderBackground()}
        <div style={{ background: "#1a1b23", border: "1px solid #334155", borderRadius: 16, padding: 40, textAlign: "center", maxWidth: 500, zIndex: 10 }}>
          <h1 style={{ color: "#4ade80", fontSize: 28, marginBottom: 16 }}>Exam Submitted Successfully!</h1>
          <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 24 }}>Your responses have been securely saved.</p>

          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 20, marginBottom: 32, display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#10b981", fontSize: 24, fontWeight: "bold" }}>{answered}</div>
              <div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase" }}>Answered</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#ef4444", fontSize: 24, fontWeight: "bold" }}>{notAns}</div>
              <div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase" }}>Not Answered</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#cbd5e1", fontSize: 24, fontWeight: "bold" }}>{notVisit}</div>
              <div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase" }}>Not Visited</div>
            </div>
          </div>

          <div style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, padding: 16, color: "#93c5fd", fontSize: 14, marginBottom: 24 }}>
            ⏳ Results and detailed analysis will be released in exactly <strong>1 Hour</strong>.
          </div>

          <button
            style={{ width: "100%", background: "#3b82f6", color: "#fff", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 16, fontWeight: "bold", cursor: "pointer" }}
            onClick={() => setPhase("selection")}
          >
            Return to Mock Selection
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!selectedMock) return null;
    const mockId = selectedMock.toLowerCase().replace(/\s+/g, "_");
    const savedResponses: Record<number, Response> = JSON.parse(localStorage.getItem(`sc_responses_${mockId}`) || "{}");
    const savedQuestions: Question[] = JSON.parse(localStorage.getItem(`sc_questions_${mockId}`) || "[]");

    if (!savedQuestions.length) return (
      <div className={styles.resultsOverlay}>
        <div className={styles.resultsCard}>
          <h1 className={styles.resultsTitle}>Results Not Found</h1>
          <p className={styles.resultsSub}>Could not load the saved data for this attempt.</p>
          <button className={styles.returnBtn} onClick={() => setPhase("selection")}>Back to Selection</button>
        </div>
      </div>
    );

    const total = savedQuestions.length;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    const subStats: Record<string, { total: number, correct: number }> = {};

    savedQuestions.forEach(q => {
      const resp = savedResponses[q.id];
      const isAns = !!resp?.option;
      const isCorrect = isAns && resp.option === q.answer;

      if (!subStats[q.subject]) subStats[q.subject] = { total: 0, correct: 0 };
      subStats[q.subject].total++;

      if (!isAns) skipped++;
      else if (isCorrect) {
        correct++;
        subStats[q.subject].correct++;
      } else wrong++;
    });

    const scorePercent = Math.round((correct / total) * 100);
    const userWon = correct >= 135;

    return (
      <div className={styles.resultsOverlay}>
        {renderBackground()}
        <div className={styles.resultsCard}>
          <div className={styles.resultsHeader}>
            <h1 className={styles.resultsTitle}>Detailed Scorecard</h1>
            <p className={styles.resultsSub}>{selectedMock} Performance Analysis</p>
          </div>

          {/* Battle Outcome Cards */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <div style={{
              flex: 1, padding: "16px", borderRadius: "16px", textAlign: "center",
              background: userWon ? "rgba(16, 185, 129, 0.1)" : "rgba(255,255,255,0.03)",
              border: userWon ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: userWon ? "0 0 20px rgba(16, 185, 129, 0.15)" : "none"
            }}>
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>{userWon ? "🏆" : "👤"}</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: userWon ? "#10b981" : "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                {userWon ? "User Won" : "User Result"}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: userWon ? "#34d399" : "#fff" }}>
                {correct} / {total}
              </div>
            </div>

            <div style={{
              flex: 1, padding: "16px", borderRadius: "16px", textAlign: "center",
              background: !userWon ? "rgba(239, 68, 68, 0.1)" : "rgba(255,255,255,0.03)",
              border: !userWon ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: !userWon ? "0 0 20px rgba(239, 68, 68, 0.15)" : "none"
            }}>
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>{userWon ? "🤖" : "💥"}</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: !userWon ? "#ef4444" : "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                {!userWon ? "Timer Won" : "Timer Defeated"}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: !userWon ? "#f87171" : "#fff" }}>
                {userWon ? "0%" : "100%"}
              </div>
            </div>
          </div>

          <div className={styles.scoreSection}>
            <div className={styles.scoreCircle}>
              <svg className={styles.scoreCircleSvg} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={scorePercent >= 60 ? "#10b981" : "#3b82f6"}
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * scorePercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className={styles.scoreValue}>{scorePercent}%</div>
              <div className={styles.scoreLabel}>ACCURACY</div>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue} style={{ color: "#fff" }}>{total}</span>
              <span className={styles.statLabel}>Total Bits</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue} style={{ color: "#10b981" }}>{correct}</span>
              <span className={styles.statLabel}>Correct</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue} style={{ color: "#ef4444" }}>{wrong}</span>
              <span className={styles.statLabel}>Wrong</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue} style={{ color: "#94a3b8" }}>{skipped}</span>
              <span className={styles.statLabel}>Skipped</span>
            </div>
          </div>

          <div className={styles.analysisSection}>
            <h3 className={styles.analysisTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
              Subject Analysis
            </h3>
            {Object.entries(subStats).map(([sub, data]) => {
              const perc = Math.round((data.correct / data.total) * 100);
              return (
                <div key={sub} className={styles.subjectBarWrap}>
                  <div className={styles.subjectBarHeader}>
                    <span className={styles.subjectName}>{sub}</span>
                    <span className={styles.subjectScore}>{data.correct} / {data.total} ({perc}%)</span>
                  </div>
                  <div className={styles.progressBarBase}>
                    <div className={styles.progressBarFill} style={{ width: `${perc}%`, background: perc >= 60 ? "#10b981" : "#3b82f6" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.resultsFooter}>
            <button className={styles.returnBtn} onClick={() => setPhase("selection")}>Back to Mock Dashboard</button>
            <button className={styles.reviewBtn} onClick={() => alert("Detailed response review is coming in the next update!")}>Review Detailed Responses</button>
          </div>
        </div>
      </div>
    );
  };




  // ── FAILURE CINEMATIC ─────────────────────────────────────────────────────
  // Robo dashes in, avatar falls — triggered when secs === 0
  if (phase === "failure_cinema") {
    return (
      <BattleFailureCinema
        onBack={handleBack}
      />
    );
  }

  // ── EGO COMEBACK MODE ─────────────────────────────────────────────────────
  // Triggered externally when 3 consecutive correct answers + time < 15 min
  if (phase === "ego_mode") {
    return (
      <BattleEgoMode
        onComplete={() => setPhase("exam")}
      />
    );
  }

  // ── EXAM TERMINATED (DISABLED) ───────────────────────────────────────────
  /*
  if (phase === "terminated") {
    return (
      <div className={styles.terminatedOverlay}>
        <div className={styles.terminatedContainer}>
          <div className={styles.terminatedIcon}>🚫</div>
          <h1 className={styles.terminatedTitle}>Exam Terminated</h1>
          <p className={styles.terminatedDesc}>
            Multiple security violations (tab switching or leaving the window) were detected.
            For security reasons, your exam session has been invalidated.
          </p>
          <div className={styles.terminatedInfo}>
            <span>Incident ID: <strong>SC-{Math.floor(Math.random() * 900000 + 100000)}</strong></span>
            <span>Reason: <strong>Security Policy Violation (3/3 Warnings)</strong></span>
          </div>
          <button className={styles.terminatedBackBtn} onClick={onBack}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  */

  // ── PHASE: Submode Selection (New) (Refactored to horizontal list) ──────
  if (phase === "submodeSelection") {
    const submodes = [
      {
        id: "time",
        title: "BATTLE WITH TIME",
        desc: "160 bits mock test, real EAMCET UI, and real EAMCET original questions hands on practice.",
        icon: "⏱️",
        color: "rgba(56, 189, 248, 0.2)",
        accent: "#38bdf8",
      },
      {
        id: "others",
        title: "BATTLE WITH OTHERS",
        desc: "Multiplayer Battle Arena. Compete with top rankers in real-time. Coming Soon!",
        icon: "⚔️",
        color: "rgba(244, 114, 182, 0.2)",
        accent: "#f472b6",
      }
    ];

    return (
      <div className={styles.selectionOverlay}>
        {!hasSeenRules && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10,10,15,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#1a1b23", border: "1px solid #334155", borderRadius: 16, width: "100%", maxWidth: 600, padding: "32px" }}>
              <h2 style={{ color: "#fff", fontSize: 24, marginBottom: 16, borderBottom: "1px solid #334155", paddingBottom: 16 }}>Real Battle Mode Rules</h2>
              <ul style={{ color: "#cbd5e1", fontSize: 15, lineHeight: 1.6, paddingLeft: 20, marginBottom: 32 }}>
                <li style={{ marginBottom: 12 }}><strong>Daily Limit:</strong> You can attempt a maximum of <strong>2 mock tests</strong> per day.</li>
                <li style={{ marginBottom: 12 }}><strong>Global Cooldown:</strong> After submitting an exam, there is a strict <strong>3-hour cooldown</strong> before you can unlock the next mock.</li>
                <li style={{ marginBottom: 12 }}><strong>Results Processing:</strong> Results and analysis will be released exactly <strong>1 hour</strong> after you submit.</li>
                <li style={{ marginBottom: 12 }}><strong>Mobile Users:</strong> Landscape mode is <strong>strictly required</strong> for the best experience.</li>
              </ul>
              <button
                style={{ width: "100%", background: "linear-gradient(90deg, #3b82f6, #2563eb)", color: "#fff", padding: "14px 24px", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer", border: "none" }}
                onClick={() => {
                  setHasSeenRules(true);
                  localStorage.setItem("sc_battle_rules_seen", "true");
                  if (userId) updateUserProfile(userId, { rules_seen: true });
                }}
              >
                I Understand. Let's Battle.
              </button>
            </div>
          </div>
        )}
        {renderBackground()}
        {renderSettings()}
        <div className={styles.selectionContainer}>
          <div className={styles.selectionHeader}>
            <button className={styles.backBtnSmall} onClick={onBack}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
            <h1 className={styles.selectionTitle}>Choose Your Battle</h1>
          </div>
          <p className={styles.selectionSubTitle}>Experience the most realistic EAMCET simulation platform.</p>

          <div className={styles.submodeList}>
            {submodes.map(mode => (
              <div
                key={mode.id}
                className={`${styles.submodeCard} ${mode.id === "time" ? styles.glowCard : ""}`}
                onClick={() => {
                  if (mode.id === "time") {
                    const seen = localStorage.getItem("sc_battle_cinema_seen");
                    if (seen) setPhase("selection");
                    else setPhase("cinema");
                  } else {
                    setPhase("comingSoon");
                  }
                }}
              >
                <div className={styles.submodeIcon} style={{
                  background: mode.color,
                  border: `1px solid ${mode.accent}44`,
                  color: mode.accent
                }}>
                  <span style={{ filter: `drop-shadow(0 0 8px ${mode.accent}66)` }}>{mode.icon}</span>
                </div>
                <div className={styles.submodeText}>
                  <div className={styles.submodeLabel}>{mode.title}</div>
                  <div className={styles.submodeDesc}>{mode.desc}</div>
                </div>
                <div className={styles.submodeArrow}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── PHASE: Coming Soon ──────────────────────────────────────────────────
  if (phase === "comingSoon") {
    return (
      <div className={styles.selectionOverlay}>
        {!hasSeenRules && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10,10,15,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#1a1b23", border: "1px solid #334155", borderRadius: 16, width: "100%", maxWidth: 600, padding: "32px" }}>
              <h2 style={{ color: "#fff", fontSize: 24, marginBottom: 16, borderBottom: "1px solid #334155", paddingBottom: 16 }}>Real Battle Mode Rules</h2>
              <ul style={{ color: "#cbd5e1", fontSize: 15, lineHeight: 1.6, paddingLeft: 20, marginBottom: 32 }}>
                <li style={{ marginBottom: 12 }}><strong>Daily Limit:</strong> You can attempt a maximum of <strong>2 mock tests</strong> per day.</li>
                <li style={{ marginBottom: 12 }}><strong>Global Cooldown:</strong> After submitting an exam, there is a strict <strong>3-hour cooldown</strong> before you can unlock the next mock.</li>
                <li style={{ marginBottom: 12 }}><strong>Results Processing:</strong> Just like the real exam, results are not immediate. Results and analysis will be released exactly <strong>1 hour</strong> after you submit.</li>
                <li style={{ marginBottom: 12 }}><strong>Daily Updates:</strong> Question papers will be added daily. Don't panic, we add daily!</li>
              </ul>
              <button
                style={{ width: "100%", background: "linear-gradient(90deg, #3b82f6, #2563eb)", color: "#fff", padding: "14px 24px", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer", border: "none" }}
                onClick={() => {
                  setHasSeenRules(true);
                  localStorage.setItem("sc_battle_rules_seen", "true");
                  if (userId) updateUserProfile(userId, { rules_seen: true });
                }}
              >
                I Understand. Let's Battle.
              </button>
            </div>
          </div>
        )}
        {renderBackground()}
        {renderSettings()}
        <div className={styles.selectionContainer}>
          <div className={styles.terminatedIcon}>🚀</div>
          <h1 className={styles.selectionTitle}>BATTLE WITH OTHERS</h1>
          <p className={styles.selectionSubTitle} style={{ fontSize: "24px", color: "#38bdf8", fontWeight: "bold" }}>
            Coming Soon!
          </p>
          <p className={styles.cardDesc} style={{ maxWidth: "600px", margin: "0 auto 40px" }}>
            We are working hard to bring you the first real-time multiplayer EAMCET battle arena.
            Stay tuned for updates!
          </p>
          <button
            className={styles.selectionBackBtn}
            onClick={() => setPhase("submodeSelection")}
            style={{ borderColor: "#38bdf8", color: "#38bdf8" }}
          >
            ← Back To Selection
          </button>
        </div>
      </div>
    );
  }

  // ── PHASE: Selection (Mock List) ─────────────────────────────────────────
  if (phase === "selection") {
    const statePrefix = exam === "TS" ? "TS " : "";
    const prefix = `${statePrefix}${course}`;

    const now = nowTime;
    const COOLDOWN_MS = 3 * 60 * 60 * 1000;   // 3 hours
    const RESULTS_MS = 1 * 60 * 60 * 1000;   // 1 hour
    const MAX_PER_DAY = 2;

    // Daily submit count
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const dailySubmits: number[] = JSON.parse(localStorage.getItem("sc_daily_submits") || "[]");
    const todayCount = dailySubmits.filter(t => t > todayStart.getTime()).length;
    const dailyLimitReached = todayCount >= MAX_PER_DAY;

    // Global cooldown from last submit
    const lastSubmit = parseInt(localStorage.getItem("sc_last_submit_time") || "0");
    const globalCooldownRemaining = Math.max(0, lastSubmit + COOLDOWN_MS - now);
    const inGlobalCooldown = globalCooldownRemaining > 0;

    const fmtMs = (ms: number) => {
      const totalSecs = Math.ceil(ms / 1000);
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      return h > 0
        ? `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`
        : `${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
    };

    const maxMocks = course === "Engineering" ? 5 : 3;
    const mockOptions = Array.from({ length: 5 }, (_, idx) => idx + 1).map(i => {
      const id = `${prefix.toLowerCase().replace(/\s+/g, "_")}_mock_test_${i}`;
      const submitTime = parseInt(localStorage.getItem(`sc_submit_time_${id}`) || "0");
      const isCompleted = !!submitTime;
      const resultsReadyAt = submitTime + RESULTS_MS;
      const resultsAvailable = isCompleted && now >= resultsReadyAt;
      const resultsCountdown = isCompleted && !resultsAvailable ? resultsReadyAt - now : 0;
      const isComingSoon = i > maxMocks;

      return {
        num: i,
        id,
        title: `${prefix} Mock Test ${i}`,
        desc: i === 1
          ? "Full EAMCET simulation — 160 real questions (Maths 80, Physics 40, Chemistry 40)."
          : "Full length simulation following the latest pattern (160 Questions).",
        icon: i === 1 ? "⚔️" : "🏆",
        isCompleted,
        resultsAvailable,
        resultsCountdown,
        submitTime,
        isComingSoon
      };
    });

    const handleMockClick = (mock: typeof mockOptions[0]) => {
      // Already submitted — show results or waiting screen
      if (mock.isCompleted) {
        if (mock.resultsAvailable) {
          setSelectedMock(mock.title);
          setPhase("results" as any);
        } else {
          setAlertModal({
            show: true,
            title: "Results Pending",
            message: `Results for ${mock.title} are being processed. Please wait for the 1-hour timer to complete.`
          });
        }
        return;
      }

      // Coming Soon check
      if (mock.isComingSoon) {
        setAlertModal({
          show: true,
          title: "Coming Soon",
          message: "This mock test is not yet available. We add new papers daily!"
        });
        return;
      }

      // Daily limit reached
      if (dailyLimitReached) {
        setAlertModal({
          show: true,
          title: "Daily Limit Reached",
          message: "Daily limit reached (2 mocks/day). Please come back tomorrow to take another mock!"
        });
        return;
      }

      // Mock sequential lock (e.g. Mock 2 locked until Mock 1 done)
      if (mock.num > 1 && !mockOptions[mock.num - 2].isCompleted) {
        setAlertModal({
          show: true,
          title: "Mock Locked",
          message: `🔒 Mock Test ${mock.num} is locked! You must complete Mock Test ${mock.num - 1} first to unlock this challenge.`
        });
        return;
      }

      // Global cooldown (3 hours between mocks)
      if (inGlobalCooldown && !mock.isCompleted && mock.num !== 1) {
        setAlertModal({
          show: true,
          title: "Cooldown Active",
          message: `⏳ 3-hour cooldown is active! You must wait until the timer completes before starting your next battle.\n\nNext unlock in: ${fmtMs(globalCooldownRemaining)}`
        });
        return;
      }

      // Start the mock (Restrictions ENFORCED)
      const mockKeyMap: Record<number, string> = {
        1: `${prefix} Mock Test 1`,
        2: `${prefix} Mock Test 2`,
        3: `${prefix} Mock Test 3`,
        4: `${prefix} Mock Test 4`,
        5: `${prefix} Mock Test 5`,
      };
      
      const selected = mockKeyMap[mock.num];
      if (selected) {
        setSelectedMock(selected);
        setPhase("login");
      }
    };

    const handleAcceptRules = () => {
      setHasSeenRules(true);
      localStorage.setItem("sc_battle_rules_seen", "true");
      if (userId) {
        updateUserProfile(userId, { rules_seen: true });
      }
    };

    return (
      <div className={styles.selectionOverlay}>
        {!hasSeenRules && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10,10,15,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#1a1b23", border: "1px solid #334155", borderRadius: 16, width: "100%", maxWidth: 600, padding: "32px" }}>
              <h2 style={{ color: "#fff", fontSize: 24, marginBottom: 16, borderBottom: "1px solid #334155", paddingBottom: 16 }}>Real Battle Mode Rules</h2>
              <ul style={{ color: "#cbd5e1", fontSize: 15, lineHeight: 1.6, paddingLeft: 20, marginBottom: 32 }}>
                <li style={{ marginBottom: 12 }}><strong>Daily Limit:</strong> You can attempt a maximum of <strong>2 mock tests</strong> per day.</li>
                <li style={{ marginBottom: 12 }}><strong>Global Cooldown:</strong> After submitting an exam, there is a strict <strong>3-hour cooldown</strong> before you can unlock the next mock.</li>
                <li style={{ marginBottom: 12 }}><strong>Results Processing:</strong> Results and analysis will be released exactly <strong>1 hour</strong> after you submit.</li>
                <li style={{ marginBottom: 12 }}><strong>Mobile Users:</strong> Landscape mode is <strong>strictly required</strong> for the best experience.</li>
              </ul>
              <button
                style={{ width: "100%", background: "linear-gradient(90deg, #3b82f6, #2563eb)", color: "#fff", padding: "14px 24px", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer", border: "none" }}
                onClick={handleAcceptRules}
              >
                I Understand. Let's Battle.
              </button>
            </div>
          </div>
        )}
        {renderBackground()}
        {renderSettings()}
        <div className={styles.selectionContainer}>
          <div className={styles.selectionHeader}>
            <button className={styles.backBtnSmall} onClick={() => setPhase("submodeSelection")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
            <h1 className={styles.selectionTitle}>Select Your Mock Test</h1>
          </div>
          <p className={styles.selectionSubTitle}>Choose a challenge to unlock the Real Battle Mode simulation</p>

          {/* Daily limit banner */}
          {dailyLimitReached && (
            <div style={{ width: "100%", maxWidth: 520, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 12, padding: "12px 18px", marginBottom: 16, color: "#fca5a5", fontSize: 13, textAlign: "center" }}>
              🚫 Daily limit reached (2 mocks/day). Come back tomorrow to take another mock!
            </div>
          )}
          {inGlobalCooldown && !dailyLimitReached && (
            <div style={{ width: "100%", maxWidth: 520, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "12px 18px", marginBottom: 16, color: "#fde68a", fontSize: 13, textAlign: "center" }}>
              ⏳ 3-hour cooldown active — next mock unlocks in <strong>{fmtMs(globalCooldownRemaining)}</strong>.<br />
              <span style={{ opacity: 0.8, fontSize: 12 }}>Use this time to rest, check your results, and analyse missing topics.</span>
            </div>
          )}

          <div className={styles.submodeList}>
            {mockOptions.map((mock) => {
              const isLocked = mock.num > 1 && !mockOptions[mock.num - 2].isCompleted;
              const isCooldownLocked = inGlobalCooldown && !mock.isCompleted && mock.num !== 1;
              const isDailyLocked = dailyLimitReached && !mock.isCompleted;
              const isClickable = !isLocked && !isCooldownLocked && !isDailyLocked;

              let statusChip: React.ReactNode = null;
              if (mock.isComingSoon) {
                statusChip = <span style={{ fontSize: 11, background: "rgba(255,255,255,0.1)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 99, padding: "2px 10px", fontWeight: 700 }}>🚀 Coming Soon</span>;
              } else if (mock.isCompleted && mock.resultsAvailable) {
                statusChip = <span style={{ fontSize: 11, background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 99, padding: "2px 10px", fontWeight: 700 }}>✅ Results Ready</span>;
              } else if (mock.isCompleted && mock.resultsCountdown > 0) {
                statusChip = <span style={{ fontSize: 11, background: "rgba(251,191,36,0.15)", color: "#fde68a", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 99, padding: "2px 10px", fontWeight: 700 }}>⏳ Results in {fmtMs(mock.resultsCountdown)}</span>;
              } else if (isLocked) {
                statusChip = <span style={{ fontSize: 11, background: "rgba(156,163,175,0.15)", color: "#9ca3af", border: "1px solid rgba(156,163,175,0.3)", borderRadius: 99, padding: "2px 10px", fontWeight: 700 }}>🔒 Complete Mock {mock.num - 1} first</span>;
              } else if (isCooldownLocked) {
                statusChip = <span style={{ fontSize: 11, background: "rgba(251,191,36,0.15)", color: "#fde68a", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 99, padding: "2px 10px", fontWeight: 700 }}>⏳ Cooldown {fmtMs(globalCooldownRemaining)}</span>;
              }

              return (
                <div
                  key={mock.id}
                  className={styles.submodeCard}
                  style={{
                    opacity: (!isClickable && !mock.isCompleted) || mock.isComingSoon ? 0.55 : 1,
                    cursor: isClickable || (mock.isCompleted && mock.resultsAvailable) ? "pointer" : "not-allowed",
                    ...(mock.num === 1 && !mock.isCompleted ? { borderColor: "rgba(56,189,248,0.5)", boxShadow: "0 0 20px rgba(56,189,248,0.2)" } : {})
                  }}
                  onClick={() => handleMockClick(mock)}
                >
                  <div className={styles.submodeIcon} style={{ background: mock.num === 1 ? "rgba(56,189,248,0.15)" : "rgba(79,172,254,0.1)", color: mock.num === 1 ? "#38bdf8" : "#4facfe" }}>
                    <span>{mock.icon}</span>
                  </div>
                  <div className={styles.submodeText}>
                    <div className={styles.submodeLabel} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      {mock.title}
                      {mock.num === 1 && <span style={{ fontSize: 10, background: "rgba(56,189,248,0.2)", color: "#38bdf8", padding: "1px 7px", borderRadius: 99, fontWeight: 700, letterSpacing: "0.05em" }}>REAL QUESTIONS</span>}
                    </div>
                    <div className={styles.submodeDesc}>{mock.desc}</div>
                    {statusChip && <div style={{ marginTop: 6 }}>{statusChip}</div>}
                    {isCooldownLocked && (
                      <div style={{ marginTop: 10, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8, padding: "8px 12px" }}>
                        <div style={{ color: "#fde68a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Unlock Countdown</div>
                        <div style={{ color: "#fbbf24", fontSize: 20, fontWeight: 800, fontFamily: "monospace" }}>
                          {fmtMs(globalCooldownRemaining)}
                        </div>
                      </div>
                    )}
                    {mock.isCompleted && mock.resultsAvailable && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                        💡 Review results · Analyse weak topics · Re-attempt when ready
                      </div>
                    )}
                    {mock.isCompleted && mock.resultsCountdown > 0 && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                        🛏️ Take rest · Results coming soon · Plan your revision
                      </div>
                    )}
                  </div>

                  {mock.isCompleted && mock.resultsAvailable && (
                    <div className={styles.optionCheck}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}

                  {isClickable && !mock.isCompleted && (
                    <div className={styles.submodeArrow}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {alertModal?.show && (
          <div className={styles.submitOverlay} style={{ backdropFilter: "blur(8px)" }}>
            <div className={styles.submitDialog} style={{ textAlign: "center", maxWidth: "450px" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>ℹ️</div>
              <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "12px" }}>{alertModal.title}</p>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5", marginBottom: "24px", whiteSpace: "pre-line" }}>
                {alertModal.message}
              </p>
              <div className={styles.submitDialogBtns}>
                <button className={styles.fBtnBlue} onClick={() => setAlertModal(null)} style={{ flex: 1 }}>OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── LOGIN ────────────────────────────────────────────────────────────────
  if (phase === "login") {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginTopBar}>
          <div className={styles.loginTopLeft}>
            <div className={styles.loginSysLabel}>System Name :</div>
            <div className={styles.loginSysValue}>C001</div>
            <div className={styles.loginDisclaim}>
              Kindly contact the invigilator if there are any discrepancies in the Name and Photograph displayed on the screen or if the photograph is not yours
            </div>
          </div>
          <div className={styles.loginTopRight}>
            <div>
              <div className={styles.loginCandLabel}>Candidate Name :</div>
              <div className={styles.loginCandName}>{displayName}</div>
              <div className={styles.loginSubject}>Subject : <span className={styles.loginSubjectVal}>{examLabel}</span></div>
            </div>
            <div className={styles.loginPhoto}>
              <img src={avatarSrc} alt="photo" onError={e => { (e.target as HTMLImageElement).src = "/avatar.png"; }} />
            </div>
          </div>
        </div>

        <div className={styles.loginCenter}>
          <div className={styles.loginCard}>
            <div className={styles.loginCardTitle}>Login</div>
            <div className={styles.loginRow}>
              <span className={styles.loginIcon}>👤</span>
              <input type="text" className={styles.loginInput} placeholder="11111" readOnly />
              <span className={styles.loginKb}>⌨</span>
            </div>
            <div className={styles.loginRow}>
              <span className={styles.loginIcon}>🔒</span>
              <input type="password" className={styles.loginInput} placeholder="•••••" readOnly />
              <span className={styles.loginKb}>⌨</span>
            </div>
            <div className={styles.loginBtnRow}>
              <button className={styles.loginBackBtn} onClick={() => setPhase("selection")}>Back</button>
              <button className={styles.signInBtn} onClick={() => setPhase("instr1")}>Sign In</button>
            </div>
          </div>
        </div>

        <div className={styles.loginBottomBar}></div>
      </div>
    );
  }

  // ── INSTRUCTIONS PAGE 1 ──────────────────────────────────────────────────
  if (phase === "instr1") {
    return (
      <div className={styles.instrPage}>
        <div className={styles.instrTopBlue} />
        <div className={styles.instrLayout}>
          <div className={styles.instrMain}>
            <div className={styles.instrHeader}>Instructions</div>
            <div className={styles.instrBody}>
              <p><strong>General Instructions:</strong></p>
              <ol>
                <li>Total duration of examination is 180 minutes.<br /><span className={styles.teText}>పరీక్ష మొత్తం వ్యవధి 180 నిమిషాలు.</span></li>
                <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself.<br /><span className={styles.teText}>గడియారం సర్వర్ పై సెట్ చేయబడుతుంది.</span></li>
                <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
                  <div className={styles.instrLegend}>
                    <div className={styles.instrLegendItem}><span className={`${styles.palBtn} ${styles.s0}`}>1</span> You have not visited the question yet.</div>
                    <div className={styles.instrLegendItem}><span className={`${styles.palBtn} ${styles.s1}`}>2</span> You have not answered the question.</div>
                    <div className={styles.instrLegendItem}><span className={`${styles.palBtn} ${styles.s2}`}>3</span> You have answered the question.</div>
                    <div className={styles.instrLegendItem}><span className={`${styles.palBtn} ${styles.s3}`}>4</span> You have NOT answered the question, but have marked the question for review, this will NOT be considered for evaluation.</div>
                    <div className={styles.instrLegendItem}><span className={`${styles.palBtn} ${styles.s4}`}>5</span> You have answered the question, but marked it for review.</div>
                  </div>
                  <div className={styles.teText}>
                    <div>1 మీరు ప్రశ్నను ఇంకా సందర్శించలేదు.</div>
                    <div>2 మీరు ప్రశ్నకు జవాబు ఇంకా ఇవ్వలేదు.</div>
                    <div>3 మీరు ప్రశ్నకు జవాబు ఇచ్చారు.</div>
                    <div>4 మీరు ప్రశ్నకు జవాబు ఇవ్వలేదు, కానీ ప్రశ్నను పునరాలోచన కోసం మార్క్ చేసారు. ఈ ప్రశ్నకు మీ జవాబు మూల్యాంకనం కోసం పరిగణలోనికి తీసుకోబడదు.</div>
                    <div>5 మీరు ప్రశ్నకు జవాబు ఇచ్చారు, కానీ పునరాలోచన కోసం మార్క్ చేసారు.</div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          <div className={styles.instrSidebar}>
            <div className={styles.instrPhoto}>
              <svg viewBox="0 0 80 80" width="60" height="60"><circle cx="40" cy="30" r="18" fill="#6a9" /><ellipse cx="40" cy="70" rx="28" ry="20" fill="#6a9" /></svg>
            </div>
            <div className={styles.instrCandName}>{displayName}</div>
          </div>
        </div>
        <div className={styles.instrFooter}>
          <button className={styles.instrPrevBtn} onClick={() => setPhase("login")}>&lt; Previous</button>
          <button className={styles.instrNextBtn} onClick={() => setPhase("instr2")}>Next &gt;</button>
        </div>
        <div className={styles.instrVersion}></div>
      </div>
    );
  }

  // ── INSTRUCTIONS PAGE 2 ──────────────────────────────────────────────────
  if (phase === "instr2") {
    return (
      <div className={styles.instrPage}>
        <div className={styles.instrTopBlue} />
        <div className={styles.instrLayout}>
          <div className={styles.instrMain}>
            <div className={styles.instrHeader}>Instructions</div>
            <div className={styles.instrBody}>
              <p><strong>Navigating From One Question to Another Question:</strong></p>
              <p><strong>ఒక ప్రశ్న నుండి మరొక ప్రశ్నకు వెళ్ళడం (నావిగేషన్):</strong></p>
              <ol start={6}>
                <li>To answer a question, do the following:<br />
                  <ol type="a">
                    <li>Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly.</li>
                    <li>Click on <strong>Save &amp; Next</strong> to save your answer for the current question and then go to the next question.</li>
                    <li>Click on <strong>Mark for Review &amp; Next</strong> to save your answer for the current question, mark it for review, and then go to the next question.</li>
                  </ol>
                </li>
                <li>Procedure for answering a multiple choice type question:<br />
                  <ol type="a">
                    <li>To answer a question, Click on the button against the chosen option among the given four options.</li>
                    <li>To change your chosen answer, click on the button of another option.</li>
                    <li>To deselect your chosen answer, click on the button of the chosen option again or click the <strong>Clear Response</strong> button.</li>
                    <li>To save your answer, you MUST click the <strong>Save &amp; Next</strong> button.</li>
                  </ol>
                </li>
              </ol>
            </div>
          </div>
          <div className={styles.instrSidebar}>
            <div className={styles.instrPhoto}>
              <svg viewBox="0 0 80 80" width="60" height="60"><circle cx="40" cy="30" r="18" fill="#6a9" /><ellipse cx="40" cy="70" rx="28" ry="20" fill="#6a9" /></svg>
            </div>
            <div className={styles.instrCandName}>{displayName}</div>
          </div>
        </div>
        <div className={styles.instrFooter}>
          <button className={styles.instrPrevBtn} onClick={() => setPhase("instr1")}>&lt; Previous</button>
          <button className={styles.instrNextBtn} onClick={() => setPhase("instr3")}>Next &gt;</button>
        </div>
        <div className={styles.instrVersion}></div>
      </div>
    );
  }

  // ── INSTRUCTIONS PAGE 3 (final — "I am ready to begin") ─────────────────
  if (phase === "instr3") {
    const isEng = course === "Engineering";
    const tableRows = isEng
      ? [["1", "MATHEMATICS", "80", "80", "1"], ["2", "PHYSICS", "40", "40", "1"], ["3", "CHEMISTRY", "40", "40", "1"]]
      : [["1", "BOTANY", "40", "40", "1"], ["2", "ZOOLOGY", "40", "40", "1"], ["3", "PHYSICS", "40", "40", "1"], ["4", "CHEMISTRY", "40", "40", "1"]];

    return (
      <div className={styles.instrPage}>
        <div className={styles.instrTopBlue} />
        <div className={styles.instrLayout}>
          <div className={styles.instrMain}>
            <div className={styles.instrHeader}>Other Important Instructions</div>
            <div className={styles.instrBody}>
              <p style={{ textAlign: "center" }}><strong><u>Other Important Instructions</u></strong></p>
              <p style={{ textAlign: "center" }}><strong><u>ఇతర ముఖ్యమైన సూచనలు</u></strong></p>
              <br />
              <p><strong>1. Details of the Question Paper.</strong><br /><span className={styles.teText}>ప్రశ్న పత్రంలోని వివరాలు</span></p>
              <table className={styles.instrTable}>
                <thead>
                  <tr><th>S.No</th><th>Section(Subject) Name</th><th>No. of objective type Questions</th><th>Marks</th><th>Marks Per Question</th></tr>
                </thead>
                <tbody>
                  {tableRows.map(([sno, sub, q, m, mpq]) => (
                    <tr key={sno}><td>{sno}</td><td>{sub}</td><td>{q}</td><td>{m}</td><td>{mpq}</td></tr>
                  ))}
                  <tr><td></td><td><strong>Total</strong></td><td><strong>160</strong></td><td><strong>160</strong></td><td></td></tr>
                </tbody>
              </table>
              <p>2. You will be given 180 minutes to attempt 160 questions.<br /><span className={styles.teText}>160 ప్రశ్నలకు జవాబు ఇవ్వడానికి మీకు 180 నిమిషాల సమయం ఇవ్వబడుతుంది.</span></p>
              <p>3. The Question Paper consists of objective type questions only.<br /><span className={styles.teText}>ప్రశ్న పత్రంలో కేవలం ఆబ్జెక్టివ్ తరహా ప్రశ్నలు మాత్రమే ఉంటాయి.</span></p>
              <p>4. There will be no negative marks for wrong answers.<br /><span className={styles.teText}>తప్పు గా ఇచ్చిన జవాబులకి నెగిటివ్ మార్కులు ఉండవు.</span></p>
              <p>5. Questions will be available in two languages – English and Telugu.<br /><span className={styles.teText}>ప్రశ్నలు ఇంగ్లీష్ మరియు తెలుగు భాషలలో అందుబాటులో ఉంటాయి.</span></p>
              <br />
              <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
                <h4 style={{ color: "#818cf8", marginTop: 0, marginBottom: "8px" }}>🏆 Battle Win Condition</h4>
                <p style={{ margin: 0, fontSize: "13px" }}>
                  To defeat the <strong>Timer Robo</strong>, you must achieve a score of <strong>135 correct answers or above</strong>. If your score is lower, the Timer claims victory.
                </p>
                <div style={{ marginTop: "12px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                  <p style={{ margin: "4px 0" }}>⏳ <strong>Results release in 1 hour.</strong> Take this time to rest and recharge.</p>
                  <p style={{ margin: "4px 0" }}>🔍 Analyze results later to overcome mistakes in your next mock attempt.</p>
                </div>
              </div>
              <label className={styles.agreeLabel}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <span style={{ fontSize: "12px", marginLeft: "8px" }}>
                  I have read and understood the instructions. I understand that I must <strong>stay in fullscreen mode</strong> and <strong>complete the exam to exit</strong>.
                  I also acknowledge that for mobile devices, <strong>landscape mode is strictly required</strong>. Any attempt to switch tabs or exit fullscreen may lead to exam termination.
                </span>
              </label>
            </div>
          </div>
          <div className={styles.instrSidebar}>
            <div className={styles.instrPhoto}>
              <svg viewBox="0 0 80 80" width="60" height="60"><circle cx="40" cy="30" r="18" fill="#6a9" /><ellipse cx="40" cy="70" rx="28" ry="20" fill="#6a9" /></svg>
            </div>
            <div className={styles.instrCandName}>{displayName}</div>
          </div>
        </div>
        <div className={styles.instrFooter}>
          <button className={styles.instrPrevBtn} onClick={() => setPhase("instr2")}>&lt; Previous</button>
          <button className={styles.readyBtn} disabled={!agreed} onClick={startExam}>I am ready to begin</button>
        </div>
        <div className={styles.instrVersion}></div>
      </div>
    );
  }

  // ── EXAM CONSOLE ─────────────────────────────────────────────────────────
  const allStats = getAllStats();

  if (phase === "cinema") {
    return (
      <BattleCinema
        onComplete={() => {
          localStorage.setItem("sc_battle_cinema_seen", "true");
          setPhase("selection");
        }}
      />
    );
  }

  if (phase === "submit_summary") return renderSubmitSummary();
  if (phase === "results") return renderResults();


  return (
    <div className={styles.examConsole}>
      { /* Fullscreen Enforcement Overlay */}
      {isFullScreenLost && (
        <div className={styles.fullscreenOverlay}>
          <div className={styles.fullscreenDialog}>
            <div className={styles.securityIcon}>🛡️</div>
            <h2>Fullscreen Mode Required</h2>
            <p>Please continue in full screen or else the exam will terminate.</p>
            <div className={styles.securityWarning} style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
              <strong>Strict Requirement:</strong> This simulation must be taken in fullscreen to ensure exam integrity.
            </div>
            <button
              className={styles.resumeBtn}
              onClick={() => {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                  elem.requestFullscreen().catch(err => console.warn(err));
                }
              }}
            >
              Continue Exam (Fullscreen)
            </button>
          </div>
        </div>
      )}

      { /* Submit confirmation dialog */}
      {showSubmitConfirm && (
        <div className={styles.submitOverlay}>
          <div className={styles.submitDialog}>
            <p><strong>Are you sure you want to submit the exam?</strong></p>
            <p>Answered: {answered} | Not Answered: {notAns} | Not Visited: {notVisit}</p>
            <div className={styles.submitDialogBtns}>
              <button className={styles.fBtnWhite} onClick={() => setShowSubmitConfirm(false)}>Cancel</button>
              <button className={styles.fBtnRed} onClick={handleSubmitExam}>Yes, Submit</button>
            </div>
          </div>
        </div>
      )}

      { /* Loading overlay while fetching real questions (Strictly no trash placeholders) */}
      {(isLoadingMock || allQ.length === 0) && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(10,12,22,0.92)", display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 16
        }}>
          {isLoadingMock ? (
            <>
              <div style={{
                width: 52, height: 52, border: "4px solid rgba(56,189,248,0.3)",
                borderTopColor: "#38bdf8", borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
              }} />
              <div style={{ color: "#38bdf8", fontSize: 18, fontWeight: 700, letterSpacing: "0.05em" }}>
                Loading Questions...
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                Fetching real EAMCET questions, please wait.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>⚠️</div>
              <div style={{ color: "#ef4444", fontSize: 20, fontWeight: 700 }}>
                Course Data Lost
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, maxWidth: "400px", textAlign: "center", marginBottom: "16px" }}>
                The exam doesn't know whether to load Engineering or Agriculture questions. This usually happens if your browser cache was cleared.
              </div>
              <button 
                onClick={() => window.location.href = "/"}
                style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
              >
                Return to Home Screen
              </button>
            </>
          )}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      { /* Rotate Device Overlay (Portrait Only) */}
      {isPortrait && (
        <div className={styles.rotateOverlay}>
          <div className={styles.rotateContent}>
            <div className={styles.rotateIcon}>🔄</div>
            <h2 style={{ color: "#ef4444" }}>Landscape Mode Required</h2>
            <p>For security and proctoring integrity, <strong>Landscape Mode</strong> is strictly required for this exam simulation.</p>
            <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "10px" }}>
              Please rotate your device to continue.
            </div>
          </div>
        </div>
      )}

      { /* Palette Toggle Button (Mobile Only) */}
      <button
        className={`${styles.paletteToggle} ${showMobilePalette ? styles.paletteToggleActive : ""}`}
        onClick={() => setShowMobilePalette(!showMobilePalette)}
      >
        <span className={styles.toggleIcon}>{showMobilePalette ? "✕" : "⠿"}</span>
        <span className={styles.toggleText}>{showMobilePalette ? "Close" : "Questions"}</span>
      </button>

      <div className={styles.examHeader}>
        <div className={styles.examHeaderLeft}>
          <span className={styles.examTitle}>{examLabel}</span>
        </div>
        <div className={styles.hBtnGroup}>
          <button className={styles.hBtn}>
            <span className={styles.hBtnIcon}>i</span> Instructions
          </button>
          <button className={styles.hBtn}>
            <span className={`${styles.hBtnIcon} ${styles.qPaperIcon}`}>📄</span> Question Paper
          </button>
          <button className={styles.cancelExamBtn} onClick={() => setShowCancelConfirm(true)}>
            Cancel Exam
          </button>
        </div>
      </div>

      {showCancelConfirm && (
        <div className={styles.submitOverlay} style={{ backdropFilter: "blur(8px)" }}>
          <div className={styles.submitDialog} style={{ textAlign: "center", maxWidth: "450px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "12px" }}>Cancel Mock Test?</p>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5", marginBottom: "24px" }}>
              Are you sure you want to cancel? Your current exam progress will be lost. You can start this mock test again later.
            </p>
            <div className={styles.submitDialogBtns}>
              <button className={styles.fBtnWhite} onClick={() => setShowCancelConfirm(false)} style={{ flex: 1 }}>Go Back</button>
              <button className={styles.fBtnRed} style={{ flex: 1 }} onClick={() => {
                // Determine current mockId to clear its responses specifically
                let currentMockId = "";
                if (selectedMock) {
                  currentMockId = selectedMock.toLowerCase().replace(/\s+/g, "_");
                }

                // Wipe session-related localStorage keys
                localStorage.removeItem("sc_battle_phase");
                localStorage.removeItem("sc_battle_secs");
                localStorage.removeItem("sc_battle_mock");
                if (currentMockId) {
                  localStorage.removeItem(`sc_responses_${currentMockId}`);
                }

                // Reset all React state to fresh defaults
                setResponses({});
                setAllQ([]);
                setSelectedMock(null);
                setSecs(180 * 60);
                setCurIdx(0);
                setActiveTab(sections[0].subject);
                setShowSubmitConfirm(false);
                setShowCancelConfirm(false);

                // Exit fullscreen if active
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch(() => { });
                }

                // Return to mock selection screen
                setPhase("selection");
              }}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {alertModal?.show && (
        <div className={styles.submitOverlay} style={{ backdropFilter: "blur(8px)" }}>
          <div className={styles.submitDialog} style={{ textAlign: "center", maxWidth: "450px" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>ℹ️</div>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "12px" }}>{alertModal.title}</p>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5", marginBottom: "24px", whiteSpace: "pre-line" }}>
              {alertModal.message}
            </p>
            <div className={styles.submitDialogBtns}>
              <button className={styles.fBtnBlue} onClick={() => setAlertModal(null)} style={{ flex: 1 }}>OK</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.mainWrapper}>
        <div className={styles.leftColumn}>
          { /* ── COURSE ROW ────────────────────────────────────── */}
          <div className={styles.courseRow}>
            <div className={styles.courseLeft}>
              <span className={styles.navArrow}>◀</span>
              <div className={styles.courseBtnWrap}>
                <button className={styles.courseBtn}>
                  {course.toUpperCase()} <InfoIcon />
                </button>
                {renderTooltip(course.toUpperCase(), allStats)}
              </div>
              <span className={styles.navArrow}>▶</span>
            </div>
          </div>

          { /* ── SECTIONS INFO ROW ─────────────────────────────── */}
          <div className={styles.sectionsInfoRow}>
            <span className={styles.sectionsLabel}>Sections</span>
            <div className={styles.timerRow}>
              <span className={styles.timerLabel}>Time Left : </span>
              <span className={styles.timerVal}>{fmt(secs)}</span>
            </div>
          </div>

          { /* ── SECTIONS TAB BAR ──────────────────────────────── */}
          <div className={styles.sectionsBar}>
            <span className={styles.sNavArrow}>◀</span>
            <div className={styles.tabsRow}>
              {sections.map(sec => {
                const secStats = getSectionStats(sec.subject);
                return (
                  <div key={sec.subject} className={styles.tabWrap}>
                    <button
                      className={`${styles.tab} ${activeTab === sec.subject ? styles.tabActive : ""}`}
                      onClick={() => { setActiveTab(sec.subject); setCurIdx(0); }}
                    >
                      {sec.subject} <InfoIcon />
                    </button>
                    {renderTooltip(sec.subject, secStats)}
                  </div>
                );
              })}
            </div>
            <span className={styles.sNavArrow}>▶</span>
          </div>

          { /* ── EXAM CONTENT AREA ─────────────────────────────── */}
          <div className={styles.examBody}>
            {isLoadingMock ? (
              <div className={styles.mockLoading}>
                <div className={styles.loaderPulse} />
                <p>Syncing Session Question Bank...</p>
              </div>
            ) : (
              <div className={styles.qArea}>
                <div className={styles.qLabel}>Question No. {curIdx + 1}</div>

                {curQ && (
                  <div className={styles.qScroll}>
                    { /* Watermark */}
                    <div className={styles.watermark} aria-hidden>
                      {Array.from({ length: 20 }).map((_, i) => <span key={i}>4658708054163&nbsp;&nbsp;&nbsp;&nbsp;</span>)}
                    </div>

                    <div className={styles.qText}>
                      {curQ.question && (
                        <p className={styles.enQ}>
                          <MathText text={curQ.question} />
                        </p>
                      )}
                      {curQ.questionTe && (
                        <p className={styles.teQ}>
                          <MathText text={curQ.questionTe} />
                        </p>
                      )}
                      {curQ.images && curQ.images.map((imgUrl, i) => (
                        <div key={i} className={styles.qImageContainer} style={{ marginTop: i > 0 ? "10px" : "0", position: "relative" }}>
                          <img
                            src={imgUrl.startsWith("http") ? imgUrl : `/EAMCET${imgUrl}`}
                            alt={`Question Diagram ${i + 1}`}
                            className={styles.qImage}
                            style={{ mixBlendMode: "multiply", width: "100%", maxWidth: "800px", minHeight: "100px" }}
                            loading="eager"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop if fallback fails
                              target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='200' viewBox='0 0 800 200'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' font-family='sans-serif' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'>Image Not Found / Broken Link</text></svg>";
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className={styles.optionList}>
                      {curQ.options.map((optContent, idx) => {
                        const displayKey = (idx + 1).toString(); // "1", "2", "3", "4"
                        return (
                          <label key={idx} className={styles.optRow}>
                            <div className={styles.optEnRow}>
                              <input
                                type="radio"
                                name="ans"
                                className={styles.optRadio}
                                checked={selOption === displayKey}
                                onChange={() => selectOption(displayKey)}
                              />
                              <span className={styles.optText}>
                                <MathText text={optContent} />
                              </span>
                            </div>
                              {curQ.optionsTe?.[idx] && (
                                <span className={styles.optTeText}>
                                  <MathText text={curQ.optionsTe[idx]} />
                                </span>
                              )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                { /* ── FOOTER ─── */}
                <div className={styles.qFooter}>
                  <div className={styles.qFooterLeft}>
                    <button className={styles.fBtnWhite} onClick={() => saveAndMove(4, curIdx + 1)}>Mark for Review &amp; Next</button>
                    <button className={styles.fBtnWhite} onClick={clearResponse}>Clear Response</button>
                  </div>
                  <div className={styles.qFooterRight}>
                    <button className={styles.fBtnBlue} onClick={() => saveAndMove(2, curIdx + 1)}>Save &amp; Next</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        { /* ── SIDEBAR (FULL HEIGHT) ─── */}
        <div className={`${styles.sidebar} ${showMobilePalette ? styles.sidebarOpen : ""}`}>
          { /* Candidate Information Box */}
          <div className={styles.examCandCornerSidebar}>
            <div className={styles.examCandPhoto}>
              <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <span className={styles.examCandName}>{displayName}</span>
          </div>

          { /* Status legend */}
          <div className={styles.statsBox}>
            <div className={styles.statRow}>
              <QBadge status={2} label={answered} />
              <span className={styles.statLabel}>Answered</span>
              <QBadge status={1} label={notAns} />
              <span className={styles.statLabel}>Not Answered</span>
            </div>
            <div className={styles.statRow}>
              <QBadge status={0} label={notVisit} />
              <span className={styles.statLabel}>Not Visited</span>
              <QBadge status={3} label={marked} />
              <span className={styles.statLabel}>Marked for Review</span>
            </div>
            <div className={styles.statRow}>
              <QBadge status={4} label={ansMarked} />
              <span className={styles.statLabel}>Answered &amp; Marked for Review (will also be evaluated)</span>
            </div>
          </div>

          { /* Palette section */}
          <div className={styles.paletteSection}>
            <div className={styles.paletteHeader}>{activeTab}</div>
            <div className={styles.paletteSubHeader}>Choose a Question</div>

            <div className={styles.palette}>
              {secQ.map((q, idx) => {
                const st: QStatus = responses[q.id]?.status ?? 0;
                return (
                  <QBadge
                    key={q.id}
                    status={st}
                    label={idx + 1}
                    active={curIdx === idx}
                    onClick={() => jumpTo(q.subject, idx)}
                  />
                );
              })}
            </div>
          </div>

          { /* Submit pinned at bottom — DISABLED as per requirements for Auto-Submit only */}
          <div className={styles.sidebarFooter}>
            <button
              className={styles.sidebarSubmit}
              disabled={true}
              style={{ opacity: 0.5, cursor: "not-allowed", filter: "grayscale(1)" }}
              title="Manual submission is disabled. Exam will auto-submit when timer hits 0."
            >
              Submit Locked
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
