"use client";

import { useState, useEffect, useRef } from "react";
import MotivationScreen from "../components/MotivationScreen";
import EntranceTestSelect from "../components/EntranceTestSelect";
import ExamSelect from "../components/ExamSelect"; // This is now 'State Select'
import CourseSelect from "../components/CourseSelect";
import SyllabusPage from "../components/SyllabusPage";
import RoadmapPage from "../components/RoadmapPage";
import ModeSelect from "../components/ModeSelect";
import PracticeArena from "../components/PracticeArena";
import RoadmapMode from "../components/RoadmapMode";
import RealBattleMode from "../components/RealBattleMode";

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
 */
type Step = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export default function Home() {
  const [step, setStep] = useState<Step>(-1);
  const [testCategory, setTestCategory] = useState(""); // e.g., "EAMCET"
  const [exam, setExam] = useState("");                  // e.g., "AP" or "TS"
  const [course, setCourse] = useState("");              // e.g., "Engineering"
  const [mode, setMode] = useState<"practice" | "roadmap" | "battle" | "">("");
  const [mounted, setMounted] = useState(false);
  const [roadmapData, setRoadmapData] = useState<
    { day: number; tasks: { subject: string; topic: string; priority: string; time: string }[] }[]
  >([]);

  // Auth state
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

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
    history.replaceState({ step: -1 }, "");

    // Handle Android/iOS swipe-back & browser back button
    const handlePopState = (e: PopStateEvent) => {
      const prevStep = (e.state?.step ?? -1) as Step;
      isHandlingPopState.current = true;
      if (prevStep >= 0) {
        setStep(prevStep);
      } else {
        // At step 0 already — re-push so they stay in app
        history.pushState({ step: 0 }, "");
        setStep(0);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ── Push history on every step change ──────────────────────
  useEffect(() => {
    if (step === -1) return; // skip initial uninitialised state
    if (isHandlingPopState.current) {
      // This change came FROM popstate — don't push again
      isHandlingPopState.current = false;
      return;
    }
    history.pushState({ step }, "");
  }, [step]);

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
      const savedMode = localStorage.getItem(pk("sc_mode")) as "practice" | "roadmap" | null;
      const savedRoadmap = localStorage.getItem(pk("sc_roadmap"));

      setTestCategory(savedTest);
      setExam(savedExam);
      setCourse(savedCourse);
      if (savedMode) setMode(savedMode);
      if (savedRoadmap) {
        try { setRoadmapData(JSON.parse(savedRoadmap)); } catch {}
      }

      // Only attempt to restore step ONCE during initial boot
      if (user && step === -1) {
        if (state.status === "premium" || state.status === "trial") {
          const sStep = localStorage.getItem(pk("sc_step"));
          const sExam = localStorage.getItem(pk("sc_exam"));
          const sCourse = localStorage.getItem(pk("sc_course"));
          const savedStep = sStep ? (parseInt(sStep) as Step) : 1;
          
          // Only resume if it looks like a finished setup
          const resumable = savedStep >= 1 && savedStep <= 10 && !!sExam && !!sCourse;
          setStep(resumable ? savedStep : 1);
        } else if (state.status === "expired") {
          setStep(5);
        } else {
          setStep(1);
        }
      }
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
    
    const { ok, state } = await res.json();
    
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

      if (state.last_step >= 1 && state.last_step <= 11) {
        const uid = user?.uid;
        const accessState = await getAccessState(uid);
        setAccess(accessState);

        if (accessState.status === "premium" || accessState.status === "trial") {
          const resumable = state.last_step >= 1 && !!state.exam && !!state.course;
          setStep(resumable ? state.last_step : 1);
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

  const handleModeNext = (selectedMode: "practice" | "roadmap" | "battle") => {
    setMode(selectedMode);
    localStorage.setItem(getPK("sc_mode"), selectedMode);
    if (selectedMode === "roadmap") go(8);
    else if (selectedMode === "battle") go(11);
    else go(7);
  };

  const handleStartRoadmapMode = (roadmap: typeof roadmapData) => {
    setRoadmapData(roadmap);
    go(10);
  };

  const effectiveUserId = authUser?.uid || "sc_user";

  if (!mounted || !authChecked) return null;



  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* SEO Optimized Hidden Headings for Crawlers */}
      <div style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}>
        <h1>SeatCracker - Competitive Exam Practice Platform</h1>
        <h2>Practice for EAMCET, JEE, NEET and more</h2>
        <h3>Mock Tests | Performance Tracking | Smart Practice</h3>
      </div>



      {/* Step -1: Intro Page */}
      {step === -1 && <IntroPage onStart={() => go(0)} />}

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
          isExpired={access?.status === "expired"}
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

      {/* Step 11: Real Battle Mode */}
      {step === 11 && (
        <RealBattleMode
          userId={effectiveUserId}
          exam={exam}
          course={course}
          onBack={() => go(6)}
        />
      )}
    </main>
  );
}
