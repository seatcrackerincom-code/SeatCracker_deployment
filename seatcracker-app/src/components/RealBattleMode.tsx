"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import styles from "./RealBattleMode.module.css";
import BattleCinema from "./BattleCinema";
import BattleFailureCinema from "./BattleFailureCinema";
import BattleEgoMode from "./BattleEgoMode";

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
  options: { A: string; B: string; C: string; D: string };
  optionsTe?: { A: string; B: string; C: string; D: string }; // Optional Telugu options
  subject: Subject;
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

// ── Generate mock questions ────────────────────────────────────────────────
function buildQuestions(course: string): Question[] {
  const sections = COURSE_SECTIONS[course] || COURSE_SECTIONS.Engineering;
  const list: Question[] = [];
  let globalId = 1;

  const teMap: Record<Subject, string> = {
    Mathematics: "గణిత శాస్త్రం",
    Physics: "భౌతిక శాస్త్రం",
    Chemistry: "రసాయన శాస్త్రం",
    Botany: "వృక్షశాస్త్రం",
    Zoology: "జంతుశాస్త్రం",
  };

  for (const sec of sections) {
    for (let i = 1; i <= sec.count; i++) {
      list.push({
        id: globalId++,
        subject: sec.subject,
        question: `${sec.subject} — Question ${i}: This is a placeholder for an EAMCET-level question on ${sec.subject}. The real question will appear here once the question bank is loaded.`,
        questionTe: `${teMap[sec.subject]} — ప్రశ్న ${i}: ఇది EAMCET స్థాయి ${teMap[sec.subject]} ప్రశ్నకు స్థానభర్తి.`,
        options: {
          A: `Option A for Q${i}`,
          B: `Option B for Q${i}`,
          C: `Option C for Q${i}`,
          D: `Option D for Q${i}`,
        },
      });
    }
  }
  return list;
}

// ── Info Icon component ────────────────────────────────────────────────────
const InfoIcon = ({ className }: { className?: string }) => (
  <span className={`${styles.infoIcon} ${className || ""}`}>i</span>
);

// ── Component ──────────────────────────────────────────────────────────────
export default function RealBattleMode({ userId, exam, course, onBack }: Props) {
  const sections = COURSE_SECTIONS[course] || COURSE_SECTIONS.Engineering;
  
  // ── States ──
  const [allQ, setAllQ] = useState<Question[]>([]);
  const [isLoadingMock, setIsLoadingMock] = useState(false);
  const [phase, setPhase] = useState<
    | "cinema"
    | "selection"
    | "login"
    | "instr1"
    | "instr2"
    | "instr3"
    | "exam"
    | "failure_cinema"
    | "ego_mode"
    | "terminated"
  >("cinema");
  const [warningCount, setWarningCount] = useState(0);
  const [selectedMock, setSelectedMock] = useState<string | null>(null);
  const [instrPage, setInstrPage] = useState(1); // 1-3
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<Subject>(sections[0].subject);
  const [curIdx, setCurIdx] = useState(0);
  const [responses, setResponses] = useState<Record<number, Response>>({});
  const [secs, setSecs] = useState(180 * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // ── Memos ──
  const defaultQuestions = useMemo(() => buildQuestions(course), [course]);
  const displayName = "John Smith";
  const examLabel = getExamLabel(exam, course);

  // ── Effects ──
  // Handle mock selection and loading
  useEffect(() => {
    if (phase === "selection") {
      setAllQ([]);
      return;
    }

    if (selectedMock && selectedMock.startsWith("Session:")) {
      const sessionFile = selectedMock.split(":")[1];
      setIsLoadingMock(true);
      fetch(`/data/mocks/${sessionFile}.json`)
        .then(res => res.json())
        .then(data => {
          setAllQ(data);
          setIsLoadingMock(false);
        })
        .catch(err => {
          console.error("Failed to load session mock:", err);
          setAllQ(defaultQuestions);
          setIsLoadingMock(false);
        });
    } else {
      setAllQ(defaultQuestions);
    }
  }, [selectedMock, phase, defaultQuestions]);

  // Timer — counts down only during exam phase
  useEffect(() => {
    if (phase !== "exam") return;
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // When time hits 0, show failure cinematic instead of just stopping
  useEffect(() => {
    if (phase === "exam" && secs === 0) {
      setPhase("failure_cinema");
    }
  }, [secs, phase]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sc).padStart(2, "0")}`;
  };

  // ── Security: Fullscreen + Tab-switch detection ──────────────────────────
  useEffect(() => {
    if (phase !== "exam") return;

    const terminateExam = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.warn(err));
      }
      setPhase("terminated");
    };

    const handleViolation = (msg: string) => {
      setWarningCount(prev => {
        const next = prev + 1;
        if (next >= 3) {
          terminateExam();
        } else {
          alert(`⚠️ SECURITY WARNING (${next}/3):\n${msg}\n\nYour exam will be AUTOMATICALLY TERMINATED on the next violation.`);
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

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [phase]);

  // Questions for active section (moved up to fix 'used before declaration' error)
  const secQ = allQ.filter(q => q.subject === activeTab);
  const curQ = secQ[curIdx];

  // Mark current question as 'Not Answered' (Visited) upon viewing
  useEffect(() => {
    if (phase !== "exam" || !curQ) return;
    if (!responses[curQ.id]) {
      setResponses(prev => ({
        ...prev,
        [curQ.id]: { option: null, status: 1 }
      }));
    }
  }, [curQ?.id, phase]);

  const startExam = useCallback(() => {
    // Enter fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.warn("Fullscreen request failed:", err);
      });
    }
    setPhase("exam");
  }, []);

  const handleBack = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.warn(err));
    }
    onBack();
  }, [onBack]);

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

  // ── MAINTENANCE / COMING SOON ─────────────────────────────────────────────
  // Returns early to hide experimental cinematic features while they are being polished.
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0a0c',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '500px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '48px 32px',
        borderRadius: '24px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛠️</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Almost Done!</h1>
        <p style={{ opacity: 0.7, lineHeight: 1.6, marginBottom: '32px' }}>
          We are currently polishing the Real Battle Mode experience to ensure pixel-perfect simulation.
        </p>
        <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '18px', marginBottom: '32px' }}>
          Publishing soon... maybe in 48 hours.
        </div>
        <button 
          onClick={onBack}
          style={{
            padding: '12px 32px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );

  /*
  // ── CINEMATIC INTRO ───────────────────────────────────────────────────────
  // Plays on every Battle Mode entry. Skip button always visible.
  // Chest timer on Robo is DECORATIVE — the real exam timer starts on "I am ready to begin".
  if (phase === "cinema") {
    return (
      <AnimatePresence>
        <BattleCinema
          key="battle-cinema"
          onComplete={() => setPhase("selection")}
        />
      </AnimatePresence>
    );
  }

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

  // ── EXAM TERMINATED ──────────────────────────────────────────────────────
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

  // ── TEST SELECTION ────────────────────────────────────────────────────────
  if (phase === "selection") {
    const mockOptions = [
      {
        id: "m1",
        title: "Grand Mock Test - 1",
        desc: "Full length simulation following the latest EAPCET/EAMCET pattern (160 Questions).",
        icon: "🏆",
        color: "#4facfe",
      },
      {
        id: "m2",
        title: "2024 Practice Paper",
        desc: "Real historical question distribution from last year's official session papers.",
        icon: "📅",
        color: "#00f2fe",
      },
      {
        id: "session_1",
        title: "Session:2024_01",
        desc: "Load historical session papers directly from Python pipeline JSON exports.",
        icon: "📂",
        color: "#f97316",
      },
      {
        id: "m3",
        title: "Advanced Battle Arena",
        desc: "High-difficulty curated set covering critical syllabus topics for top rankers.",
        icon: "⚔️",
        color: "#7028e4",
      },
    ];

    return (
      <div className={styles.selectionOverlay}>
        <div className={styles.selectionContainer}>
          <h1 className={styles.selectionTitle}>Select Your Mock Test</h1>
          <p className={styles.selectionSubTitle}>Choose a challenge to unlock the Real Battle Mode simulation</p>
          
          <div className={styles.selectionGrid}>
            {mockOptions.map((mock) => (
              <div
                key={mock.id}
                className={styles.selectionCard}
                onClick={() => {
                  setSelectedMock(mock.title);
                  setPhase("login");
                }}
              >
                <div className={styles.cardIcon} style={{ background: mock.color }}>{mock.icon}</div>
                <h3 className={styles.cardTitle}>{mock.title}</h3>
                <p className={styles.cardDesc}>{mock.desc}</p>
                <div className={styles.cardAction}>Start Simulation →</div>
              </div>
            ))}
          </div>

          <button className={styles.selectionBackBtn} onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
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
              <img src="/avatar.png" alt="photo" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <svg viewBox="0 0 80 80" width="70" height="70"><circle cx="40" cy="30" r="18" fill="#9ab" /><ellipse cx="40" cy="70" rx="28" ry="20" fill="#9ab" /></svg>
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
            <button className={styles.signInBtn} onClick={() => setPhase("instr1")}>Sign In</button>
          </div>
        </div>

        <div className={styles.loginBottomBar}>Version : 17.07.00</div>
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
          <button className={styles.instrNextBtn} onClick={() => setPhase("instr2")}>Next &gt;</button>
        </div>
        <div className={styles.instrVersion}>Version : 17.07.00</div>
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
        <div className={styles.instrVersion}>Version : 17.07.00</div>
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
              <label className={styles.agreeLabel}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <span style={{ fontSize: "12px", marginLeft: "8px" }}>I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.</span>
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
        <div className={styles.instrVersion}>Version : 17.07.00</div>
      </div>
    );
  }

  // ── EXAM CONSOLE ─────────────────────────────────────────────────────────
  const allStats = getAllStats();

  return (
    <div className={styles.examConsole}>
      {/* Submit confirmation dialog */}
      {showSubmitConfirm && (
        <div className={styles.submitOverlay}>
          <div className={styles.submitDialog}>
            <p><strong>Are you sure you want to submit the exam?</strong></p>
            <p>Answered: {answered} | Not Answered: {notAns} | Not Visited: {notVisit}</p>
            <div className={styles.submitDialogBtns}>
              <button className={styles.fBtnWhite} onClick={() => setShowSubmitConfirm(false)}>Cancel</button>
              <button className={styles.fBtnRed} onClick={handleBack}>Yes, Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOP HEADER ─────────────────────────────────────── */}
      <div className={styles.examHeader}>
        <span className={styles.examTitle}>{examLabel}</span>
        <div className={styles.examHeaderRight}>
          <button className={styles.hBtn}><span className={styles.hBtnIcon}>ℹ</span> Instructions</button>
          <button className={styles.hBtn}><span className={styles.hBtnIcon}>📄</span> Question Paper</button>
        </div>
        {/* Candidate name + avatar — in header, no overlap */}
        <div className={styles.examCandCorner}>
          <span className={styles.examCandName}>{displayName}</span>
          <div className={styles.examCandPhoto}>
            <svg viewBox="0 0 80 80" width="44" height="44"><circle cx="40" cy="30" r="18" fill="#9ab" /><ellipse cx="40" cy="70" rx="28" ry="20" fill="#9ab" /></svg>
          </div>
        </div>
      </div>

      {/* ── COURSE + TIMER ROW ────────────────────────────── */}
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
        <div className={styles.timerRow}>
          <span className={styles.timerLabel}>Time Left : </span>
          <span className={styles.timerVal}>{fmt(secs)}</span>
        </div>
      </div>

      {/* ── SECTIONS TAB BAR ──────────────────────────────── */}
      <div className={styles.sectionsBar}>
        <span className={styles.sectionsLabel}>Sections</span>
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

      {/* ── MAIN BODY ─────────────────────────────────────── */}
      <div className={styles.examBody}>
        {isLoadingMock ? (
          <div className={styles.mockLoading}>
            <div className={styles.loaderPulse} />
            <p>Syncing Session Question Bank...</p>
          </div>
        ) : (
          <>
            {/* ── QUESTION AREA ─── */}
        <div className={styles.qArea}>
          <div className={styles.qLabel}>Question No. {curIdx + 1}</div>

          {curQ && (
            <div className={styles.qScroll}>
              {/* Watermark */}
              <div className={styles.watermark} aria-hidden>
                {Array.from({ length: 20 }).map((_, i) => <span key={i}>4658708054163&nbsp;&nbsp;&nbsp;&nbsp;</span>)}
              </div>

              <div className={styles.qText}>
                <p className={styles.enQ}>{curQ.question}</p>
                <p className={styles.teQ}>{curQ.questionTe}</p>
              </div>

              <div className={styles.optionList}>
                {(["A", "B", "C", "D"] as const).map(key => (
                  <label key={key} className={styles.optRow}>
                    <div className={styles.optEnRow}>
                      <input
                        type="radio"
                        name="ans"
                        className={styles.optRadio}
                        checked={selOption === key}
                        onChange={() => selectOption(key)}
                      />
                      <span className={styles.optText}>{curQ.options[key]}</span>
                    </div>
                    {curQ.optionsTe?.[key] && (
                      <span className={styles.optTeText}>{curQ.optionsTe[key]}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── FOOTER ─── */}
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

        {/* ── SIDEBAR ─── */}
        <div className={styles.sidebar}>
          {/* Status legend — fixed at top */}
          <div className={styles.statsBox}>
            <div className={styles.statRow}>
              <span className={`${styles.statBadge} ${styles.s2}`}>{answered}</span>
              <span className={styles.statLabel}>Answered</span>
              <span className={`${styles.statBadge} ${styles.s1}`}>{notAns}</span>
              <span className={styles.statLabel}>Not Answered</span>
            </div>
            <div className={styles.statRow}>
              <span className={`${styles.statBadge} ${styles.s0}`}>{notVisit}</span>
              <span className={styles.statLabel}>Not Visited</span>
              <span className={`${styles.statBadge} ${styles.s3}`}>{marked}</span>
              <span className={styles.statLabel}>Marked for Review</span>
            </div>
            <div className={styles.statRow}>
              <span className={`${styles.statBadge} ${styles.s4}`}>{ansMarked}</span>
              <span className={styles.statLabel}>Answered &amp; Marked for Review (will also be evaluated)</span>
            </div>
          </div>

          {/* Palette section — scrollable independently */}
          <div className={styles.paletteSection}>
            <div className={styles.paletteHeader}>{activeTab}</div>
            <div className={styles.paletteSubHeader}>Choose a Question</div>

            {/* Question palette */}
            <div className={styles.palette}>
              {secQ.map((q, idx) => {
                const st: QStatus = responses[q.id]?.status ?? 0;
                const cls = [
                  styles.palBtn,
                  st === 0 ? styles.s0 : "",
                  st === 1 ? styles.s1 : "",
                  st === 2 ? styles.s2 : "",
                  st === 3 ? styles.s3 : "",
                  st === 4 ? styles.s4 : "",
                  curIdx === idx ? styles.palActive : "",
                ].filter(Boolean).join(" ");
                return (
                  <div key={q.id} className={cls} onClick={() => jumpTo(q.subject, idx)}>
                    {idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit pinned at bottom of sidebar */}
          <div className={styles.sidebarFooter}>
            {secs > 0 ? (
              <button className={styles.sidebarSubmitDisabled} disabled title="Submit will be available when the timer reaches 0">Submit</button>
            ) : (
              <button className={styles.sidebarSubmit} onClick={() => setShowSubmitConfirm(true)}>Submit</button>
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
  */
}
