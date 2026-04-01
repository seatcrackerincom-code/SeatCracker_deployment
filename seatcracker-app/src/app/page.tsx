"use client";

import { useState, useEffect } from "react";
import MotivationScreen from "../components/MotivationScreen";
import EntranceTestSelect from "../components/EntranceTestSelect";
import ExamSelect from "../components/ExamSelect"; // This is now 'State Select'
import CourseSelect from "../components/CourseSelect";
import SyllabusPage from "../components/SyllabusPage";
import RoadmapPage from "../components/RoadmapPage";
import ModeSelect from "../components/ModeSelect";
import PracticeArena from "../components/PracticeArena";
import RoadmapMode from "../components/RoadmapMode";
import LoginScreen from "../components/LoginScreen";
import AccessGate from "../components/AccessGate";
import { onAuthChange, signOut, type User } from "../lib/firebase";
import {
  getAccessStateSync,
  getAccessState,
  type AccessState,
} from "../lib/access";

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
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export default function Home() {
  const [step, setStep] = useState<Step>(0);
  const [testCategory, setTestCategory] = useState(""); // e.g., "EAMCET"
  const [exam, setExam] = useState("");                  // e.g., "AP" or "TS"
  const [course, setCourse] = useState("");              // e.g., "Engineering"
  const [mode, setMode] = useState<"practice" | "roadmap" | "">("");
  const [mounted, setMounted] = useState(false);
  const [roadmapData, setRoadmapData] = useState<
    { day: number; tasks: { subject: string; topic: string; priority: string; time: string }[] }[]
  >([]);

  // Auth state
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Access state
  const [access, setAccess] = useState<AccessState | null>(null);
  const [guestId, setGuestId] = useState<string>("");

  // ── Init ──────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);

    // Restore saved progress
    const savedTest = localStorage.getItem("sc_test_category") || "EAMCET";
    const savedExam = localStorage.getItem("sc_exam") || "";
    const savedCourse = localStorage.getItem("sc_course") || "";
    const savedMode = localStorage.getItem("sc_mode") as "practice" | "roadmap" | null;
    const savedRoadmap = localStorage.getItem("sc_roadmap");

    if (savedTest) setTestCategory(savedTest);
    if (savedExam) setExam(savedExam);
    if (savedCourse) setCourse(savedCourse);
    if (savedMode) setMode(savedMode);
    if (savedRoadmap) {
      try { setRoadmapData(JSON.parse(savedRoadmap)); } catch {}
    }

    // Restore/Gen Guest ID
    let gId = localStorage.getItem("sc_guest_id");
    if (!gId) {
      gId = "guest_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("sc_guest_id", gId);
    }
    setGuestId(gId);

    // Firebase auth listener
    const unsub = onAuthChange(async (user) => {
      setAuthUser(user);
      setAuthChecked(true);

      const uid = user?.uid;
      const state = await getAccessState(uid);
      setAccess(state);

      // If user already logged in and has access, restore their step
      if (user || localStorage.getItem("sc_guest_active")) {
        if (state.status === "premium" || state.status === "trial") {
          const savedStepStr = localStorage.getItem("sc_step");
          const savedStep = savedStepStr ? parseInt(savedStepStr) as Step : 1;
          
          // Only resume if essential data exists
          const resumable = savedStep >= 1 && savedStep <= 10 && savedExam && savedCourse;
          setStep(resumable ? savedStep : 1);
          return;
        }
        if (state.status === "expired") {
          setStep(5); // AccessGate showing expired state
          return;
        }
      }
      // Default: show login (step 0)
    });

    return () => unsub();
  }, [exam, course]);

  // ── Handlers ─────────────────────────────────────────────

  const handleLoginSuccess = async (user: User | null) => {
    setAuthUser(user);
    if (!user) localStorage.setItem("sc_guest_active", "1");
    
    const uid = user?.uid;
    const state = await getAccessState(uid);
    setAccess(state);

    if (state.status === "premium" || state.status === "trial") {
      const savedStepStr = localStorage.getItem("sc_step");
      const savedStep = savedStepStr ? parseInt(savedStepStr) as Step : 1;
      const resumable = savedStep >= 1 && savedStep <= 10 
        && !!localStorage.getItem("sc_exam") && !!localStorage.getItem("sc_course");
      setStep(resumable ? savedStep : 1);
    } else if (state.status === "expired") {
      setStep(5);
    } else {
      setStep(1); // Motivation then through to the entrance test select
    }
  };

  const go = (s: Step) => {
    setStep(s);
    localStorage.setItem("sc_step", String(s));
  };

  const handleTestCategoryNext = (selected: string) => {
    setTestCategory(selected);
    localStorage.setItem("sc_test_category", selected);
    go(3);
  };

  const handleExamNext = (selected: string) => {
    setExam(selected);
    localStorage.setItem("sc_exam", selected);
    go(4);
  };

  const handleCourseNext = async (selected: string) => {
    setCourse(selected);
    localStorage.setItem("sc_course", selected);

    // Check access before letting them proceed
    const uid = authUser?.uid;
    const state = await getAccessState(uid);
    setAccess(state);

    if (state.status === "premium" || state.status === "trial") {
      go(6); // ModeSelect
    } else {
      go(5); // AccessGate
    }
  };

  const handleAccessGranted = async () => {
    const uid = authUser?.uid;
    const state = await getAccessState(uid);
    setAccess(state);
    go(6); // ModeSelect
  };

  const handleRestart = () => {
    ["sc_test_category", "sc_exam", "sc_course", "sc_step", "sc_roadmap", "sc_mode", "sc_guest_active"].forEach(k =>
      localStorage.removeItem(k)
    );
    setTestCategory("EAMCET"); setExam(""); setCourse(""); setMode(""); setRoadmapData([]);
    go(1);
  };

  const handleModeNext = (selectedMode: "practice" | "roadmap") => {
    setMode(selectedMode);
    localStorage.setItem("sc_mode", selectedMode);
    go(selectedMode === "roadmap" ? 8 : 7);
  };

  const handleStartRoadmapMode = (roadmap: typeof roadmapData) => {
    setRoadmapData(roadmap);
    go(10);
  };

  const effectiveUserId = authUser?.email || guestId;

  if (!mounted || !authChecked) return null;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

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
    </main>
  );
}
