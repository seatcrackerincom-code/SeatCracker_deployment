"use client";

import { useState, useEffect, useRef } from "react";
import MotivationScreen from "../components/MotivationScreen";
import EntranceTestSelect from "../components/EntranceTestSelect";
import ExamSelect from "../components/EAMCET/ExamSelect"; // This is now 'State Select'
import CourseSelect from "../components/EAMCET/CourseSelect";
import SyllabusPage from "../components/EAMCET/SyllabusPage";
import RoadmapPage from "../components/EAMCET/RoadmapPage";
import ModeSelect from "../components/ModeSelect";
import PracticeArena from "../components/EAMCET/PracticeArena";
import RoadmapMode from "../components/EAMCET/RoadmapMode";
import RealBattleMode from "../components/EAMCET/RealBattleMode";
import CheatCodeMode from "../components/EAMCET/CheatCodeMode"; // Force TS update

import LoginScreen from "../components/LoginScreen";
import AccessGate from "../components/AccessGate";
import IntroPage from "../components/IntroPage";
import { onAuthChange, signOut, type User } from "../lib/firebase";
import {
  getAccessStateSync,
  getAccessState,
  type AccessState,
} from "../lib/access";
import {
  trackAppOpen,
  trackLogin,
} from "../lib/analytics";

/**
 * Step Sequence:
 * 0: LoginScreen
 * 1: MotivationScreen
 * 2: EntranceTestSelect (New: Choose EAMCET, GATE, etc.)
 * 3: StateSelection (was ExamSelect)
 * 4: CourseSelect
 * 5: AccessGate (Unlock Full Access / Start Trial)
 * 6: ModeSelect (Choose Practice vs Roadmap)
 * 7: SyllabusPage (Practice Branch)
 * 8: RoadmapPage (Roadmap Config Branch)
 * 9: PracticeArena (Practice Test Flow)
 * 10: RoadmapMode (Roadmap Execution Flow)
 * 11: RealBattleMode (Mock Exam Engine)
 * 12: CheatCodeMode (Last 10 Days Preparation)
 */
type Step = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export default function Home() {
  const [step, setStep] = useState<Step>(0); // Default to Home (Login). Only move to -1 if confirmed new user.
  const [testCategory, setTestCategory] = useState(""); // e.g., "EAMCET"
  const [exam, setExam] = useState("");                  // e.g., "AP" or "TS"
  const [course, setCourse] = useState("");              // e.g., "Engineering"
  const [mode, setMode] = useState<"practice" | "roadmap" | "battle" | "cheatcode" | "">("");
  const [mounted, setMounted] = useState(false);
  const [roadmapData, setRoadmapData] = useState<
    { day: number; tasks: { subject: string; topic: string; priority: string; time: string }[] }[]
  >([]);

  // Auth state
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Helper for keyed storage
  const getPK = (key: string) => authUser?.uid ? `${key}_${authUser.uid}` : key;

  // Access state
  const [access, setAccess] = useState<AccessState | null>(null);
  // Ref to skip history push when popstate is firing (avoid loops)
  const isHandlingPopState = useRef(false);

  // ── Init (Once on mount) ──────────────────────────────────
  useEffect(() => {
    setMounted(true);
    trackAppOpen(); // Firebase: app_open

    // Seed history with current state
    history.replaceState({ step: 0 }, "");

    // 1. Immediate persistence check
    const savedStep = localStorage.getItem("sc_step");
    const hasAnyData = Object.keys(localStorage).some(key => key.startsWith("sc_"));

    if (savedStep) {
      setStep(parseInt(savedStep) as Step);
      setInitialLoad(false);
    } else if (!hasAnyData) {
      // BRAND NEW USER
      setStep(-1);
      setInitialLoad(false);
    }

    // Handle back button
    const handlePopState = (e: PopStateEvent) => {
      const prevStep = (e.state?.step ?? -1) as Step;
      isHandlingPopState.current = true;
      if (prevStep >= 0) {
        setStep(prevStep);
      } else {
        history.pushState({ step: 0 }, "");
        setStep(0);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ── Push history on every step change ──────────────────────
  useEffect(() => {
    if (step === -1) return; 
    if (isHandlingPopState.current) {
      isHandlingPopState.current = false;
      return;
    }
    history.pushState({ step }, "");
    
    // Universal persistence
    localStorage.setItem("sc_step", step.toString());
    if (authUser?.uid) {
      localStorage.setItem(getPK("sc_step"), step.toString());
    }
  }, [step, authUser?.uid]);

  // ── Auth Listener (Once) ──────────────────────────────────
  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      setAuthUser(user);
      setAuthChecked(true);

      const uid = user?.uid;
      const state = await getAccessState(uid);
      setAccess(state);

      // Reload local state variables for this specific user
      const pk = (k: string) => uid ? `${k}_${uid}` : k;
      const savedTest = localStorage.getItem(pk("sc_test_category")) || "EAMCET";
      const savedExam = localStorage.getItem(pk("sc_exam")) || "";
      const savedCourse = localStorage.getItem(pk("sc_course")) || "";
      const savedMode = localStorage.getItem(pk("sc_mode")) as "practice" | "roadmap" | "battle" | "cheatcode" | null;
      const savedRoadmap = localStorage.getItem(pk("sc_roadmap"));

      setTestCategory(savedTest);
      setExam(savedExam);
      setCourse(savedCourse);
      if (savedMode) setMode(savedMode);
      if (savedRoadmap) {
        try { 
          const parsed = JSON.parse(savedRoadmap);
          if (Array.isArray(parsed)) setRoadmapData(parsed);
        } catch (err) {
          console.error("Roadmap parse error:", err);
          localStorage.removeItem(pk("sc_roadmap"));
        }
      }

      // ── Persistent Resume Logic (Immediate) ──
      const sStep = localStorage.getItem(pk("sc_step")) || localStorage.getItem("sc_step");
      if (sStep) {
        setStep(parseInt(sStep) as Step);
      } else if (user) {
        // Logged in but no saved step -> Start at Dashboard
        setStep(6);
      }
      setInitialLoad(false);
    });

    return () => unsub();
  }, [step]); // Only needs to check step to see if we've initialized yet

  // ── Handlers ─────────────────────────────────────────────

  const handleLoginSuccess = async (user: User | null) => {
    if (!user) return;
    setAuthUser(user);

    // Firebase Analytics — login event
    trackLogin("google");

    // Register/Restore user in Supabase analytics table
    const res = await fetch("/api/admin/register-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid }),
    });
    
    const json = await res.json().catch(() => ({}));
    const { ok, state } = json;
    
    // Cloud Restore: Use database state if available, else fallback to localStorage
    if (ok && state) {
      if (state.exam) {
        setExam(state.exam);
        localStorage.setItem(getPK("sc_exam"), state.exam);
      }
      if (state.course) {
        setCourse(state.course);
        localStorage.setItem(getPK("sc_course"), state.course);
      }

      if (state.last_step !== undefined && state.last_step >= 1 && state.last_step <= 11) {
        const uid = user?.uid;
        const accessState = await getAccessState(uid);
        setAccess(accessState);

        if (accessState.status === "premium" || accessState.status === "trial") {
          const resumable = state.last_step >= 1 && !!state.exam && !!state.course;
          setStep(resumable ? state.last_step as Step : 1);
        } else if (accessState.status === "expired") {
          setStep(5);
        } else {
          setStep(1);
        }
        return;
      }
    }

    // Fallback to existing logic if cloud state missing
    const uid = user?.uid;
    const accessState = await getAccessState(uid);
    setAccess(accessState);

    if (accessState.status === "premium" || accessState.status === "trial") {
      const savedStepStr = localStorage.getItem(getPK("sc_step"));
      const savedStep = savedStepStr ? parseInt(savedStepStr) as Step : 1;
      const resumable = savedStep >= 1 && savedStep <= 10 
        && !!localStorage.getItem(getPK("sc_exam")) && !!localStorage.getItem(getPK("sc_course"));
      setStep(resumable ? savedStep : 1);
    } else if (accessState.status === "expired") {
      setStep(5);
    } else {
      setStep(1); 
    }
  };

  const saveCloudProgress = (data: { last_step?: number; exam?: string; course?: string }) => {
    if (!authUser || authUser.uid === "sc_user") return;
    fetch("/api/admin/register-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: authUser.uid, ...data }),
    }).catch(() => {}); // fire-and-forget
  };

  const go = (s: Step) => {
    setStep(s);
    localStorage.setItem(getPK("sc_step"), String(s));
    saveCloudProgress({ last_step: s });
    // Note: history.pushState is handled by the step useEffect above
  };

  useEffect(() => {
    const handleForceNav = (e: any) => {
      if (typeof e.detail?.step === "number") {
        go(e.detail.step);
      }
    };
    window.addEventListener("sc_navigate", handleForceNav);
    return () => window.removeEventListener("sc_navigate", handleForceNav);
  }, []);


  const handleTestCategoryNext = (selected: string) => {
    setTestCategory(selected);
    localStorage.setItem(getPK("sc_test_category"), selected);
    go(3);
  };

  const handleExamNext = (selected: string) => {
    setExam(selected);
    localStorage.setItem(getPK("sc_exam"), selected);
    saveCloudProgress({ exam: selected, last_step: 4 });
    go(4);
  };

  const handleCourseNext = async (selected: string) => {
    setCourse(selected);
    localStorage.setItem(getPK("sc_course"), selected);

    // Check access before letting them proceed
    const uid = authUser?.uid;
    const state = await getAccessState(uid);
    setAccess(state);

    if (state.status === "premium" || state.status === "trial") {
      saveCloudProgress({ course: selected, last_step: 6 });
      go(6); // ModeSelect
    } else {
      saveCloudProgress({ course: selected, last_step: 5 });
      go(5); // AccessGate
    }
  };

  const handleAccessGranted = async () => {
    const uid = authUser?.uid;
    const state = await getAccessState(uid);
    setAccess(state);
    go(6); // ModeSelect
  };

  const handleLogout = async () => {
    await signOut();
    setAuthUser(null);
    setAccess(null);
    setExam(""); 
    setCourse("");
    go(-1); // Back to Intro
  };

  const handleRestart = () => {
    ["sc_test_category", "sc_exam", "sc_course", "sc_step", "sc_roadmap", "sc_mode"].forEach(k =>
      localStorage.removeItem(getPK(k))
    );
    setTestCategory("EAMCET"); setExam(""); setCourse(""); setMode(""); setRoadmapData([]);
    go(1);
  };

  const handleModeNext = (selectedMode: "practice" | "roadmap" | "battle" | "cheatcode") => {
    setMode(selectedMode);
    localStorage.setItem(getPK("sc_mode"), selectedMode);
    if (selectedMode === "roadmap") go(8);
    else if (selectedMode === "battle") go(11);
    else if (selectedMode === "cheatcode") go(12);
    else go(7);
  };

  const handleStartRoadmapMode = (roadmap: typeof roadmapData) => {
    setRoadmapData(roadmap);
    go(10);
  };

  const effectiveUserId = authUser?.uid || "sc_user";

  if (!mounted || (initialLoad && step === 0)) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', gap: '20px' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '60px', height: '60px', opacity: 0.8, animation: 'pulse 2s infinite ease-in-out' }} />
        <div className="loader" style={{ width: '30px', height: '30px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 0.5; transform: scale(0.95); } 50% { opacity: 0.9; transform: scale(1.05); } }
        `}</style>
      </div>
    );
  }



  return (
    <>
      {/* SEO Optimized Hidden Headings for Crawlers */}
      <div style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}>
        <h1>SeatCracker - Competitive Exam Practice Platform</h1>
        <h2>Practice for EAMCET, JEE, NEET and more</h2>
        <h3>Mock Tests | Performance Tracking | Smart Practice</h3>
      </div>



      {/* Step -1: Intro Page */}
      {step === -1 && (
        <IntroPage 
          onStart={() => {
            localStorage.setItem("sc_visited", "true");
            go(0);
          }} 
        />
      )}

      {/* Step 0: Login */}
      {step === 0 && <LoginScreen onSuccess={handleLoginSuccess} />}

      {/* Step 1: Motivation */}
      {step === 1 && <MotivationScreen onNext={() => go(2)} />}

      {/* Step 2: Entrance Test Selection */}
      {step === 2 && (
        <EntranceTestSelect 
          currentTest={testCategory} 
          onNext={handleTestCategoryNext} 
          onBack={() => go(1)} 
        />
      )}

      {/* Step 3: State Selection (AP / TS) */}
      {step === 3 && (
        <ExamSelect 
          currentExam={exam} 
          onNext={handleExamNext} 
          onBack={() => go(2)} 
        />
      )}

      {/* Step 4: Course Selection */}
      {step === 4 && (
        <CourseSelect 
          currentCourse={course} 
          onNext={handleCourseNext} 
          onBack={() => go(3)} 
        />
      )}

      {/* Step 5: Access Gate */}
      {step === 5 && (
        <AccessGate
          userId={effectiveUserId}
          onAccessGranted={handleAccessGranted}
          onBack={() => go(4)}
        />
      )}

      {/* Step 6: Mode Select */}
      {step === 6 && <ModeSelect onNext={handleModeNext} onBack={() => go(4)} />}

      {/* Step 7: Syllabus Page */}
      {step === 7 && (
        <SyllabusPage
          userId={effectiveUserId}
          exam={exam}
          course={course}
          onBack={() => go(6)}
          onRestart={handleRestart}
          onStartPractice={() => go(9)}
        />
      )}

      {/* Step 8: Roadmap Config Page */}
      {step === 8 && (
        <RoadmapPage
          userId={effectiveUserId}
          exam={exam}
          course={course}
          onBack={() => go(6)}
          onStartRoadmapMode={handleStartRoadmapMode}
        />
      )}

      {/* Step 9: Practice Arena */}
      {step === 9 && (
        <PracticeArena
          userId={effectiveUserId}
          exam={exam}
          course={course}
          onBack={() => go(6)}
          onGoToRoadmap={() => go(8)}
          authUser={authUser}
          access={access}
        />
      )}

      {/* Step 10: Roadmap Execution Mode */}
      {step === 10 && (
        <RoadmapMode
          userId={effectiveUserId}
          exam={exam}
          course={course}
          roadmap={roadmapData}
          onBack={() => go(8)}
        />
      )}

      {step === 11 && (
        <RealBattleMode
          userId={effectiveUserId}
          exam={exam}
          course={course}
          onBack={() => go(6)}
          onRestart={handleRestart}
          authUser={authUser}
        />
      )}

      {/* Step 12: CheatCode Mode */}
      {step === 12 && (
        <CheatCodeMode
          userId={effectiveUserId}
          exam={exam}
          course={course}
          onBack={() => go(6)}
        />
      )}
    </>
  );
}
