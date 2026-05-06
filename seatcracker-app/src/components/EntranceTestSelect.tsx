"use client";

import { useState } from "react";
import styles from "./SelectScreen.module.css";

interface Props {
  currentTest: string;
  onNext: (test: string) => void;
  onBack: () => void;
}

const TESTS = [
  // Engineering / Technology
  { id: "EAMCET", label: "EAMCET", desc: "Engineering, Agriculture & Medical Common Entrance Test (AP & TS)", icon: "🎓", active: true },
  { id: "JEE", label: "JEE Advanced", desc: "Joint Entrance Examination - Advanced (Entrance for IITs)", icon: "📐", active: true },
  { id: "JEE_MAIN", label: "JEE Main", desc: "Entrance for NITs, IIITs, and other engineering colleges", icon: "🏢", active: false },
  { id: "BITSAT", label: "BITSAT", desc: "Entrance for BITS Pilani campuses", icon: "🏫", active: false },
  
  // Medical
  { id: "NEET", label: "NEET", desc: "Entrance for MBBS, BDS, and medical courses", icon: "🩺", active: false },
  { id: "AIIMS", label: "AIIMS Entrance Exam", desc: "Previously for AIIMS (now merged into NEET)", icon: "🏥", active: false },
  
  // Government Jobs
  { id: "UPSC", label: "UPSC Civil Services Exam", desc: "Recruitment for IAS, IPS, IFS", icon: "⚖️", active: false },
  { id: "SSC_CGL", label: "SSC CGL", desc: "Central government jobs", icon: "👔", active: false },
  { id: "IBPS_PO", label: "IBPS PO", desc: "Banking jobs (Probationary Officer)", icon: "💰", active: false },
  { id: "RRB_NTPC", label: "RRB NTPC", desc: "Railway jobs", icon: "🚂", active: false },
  
  // Management / Business
  { id: "CAT", label: "CAT", desc: "MBA entrance for IIMs and top B-schools", icon: "📈", active: false },
  { id: "XAT", label: "XAT", desc: "MBA entrance for XLRI and other institutes", icon: "📝", active: false },
  { id: "GMAT", label: "GMAT", desc: "MBA entrance for international universities", icon: "🌎", active: false },
  
  // Law
  { id: "CLAT", label: "CLAT", desc: "Entrance for National Law Universities", icon: "⚖️", active: false },
  { id: "AILET", label: "AILET", desc: "Entrance for NLU Delhi", icon: "🏛️", active: false },
  
  // Science / Research
  { id: "GATE", label: "GATE", desc: "M.Tech admissions and PSU jobs", icon: "🔬", active: false },
  { id: "CSIR_NET", label: "CSIR NET", desc: "Research fellowship and lectureship", icon: "🧬", active: false },
  { id: "UGC_NET", label: "UGC NET", desc: "Eligibility for Assistant Professor", icon: "🎓", active: false },
  
  // Abroad Studies
  { id: "GRE", label: "GRE", desc: "MS and higher studies abroad", icon: "✈️", active: false },
  { id: "IELTS", label: "IELTS", desc: "English proficiency for study/work abroad", icon: "🗣️", active: false },
  { id: "TOEFL", label: "TOEFL", desc: "English proficiency test for universities", icon: "📝", active: false },
  
  // Defence
  { id: "NDA", label: "NDA Exam", desc: "Entry into Army, Navy, Air Force after 12th", icon: "⚔️", active: false },
  { id: "CDS", label: "CDS Exam", desc: "Entry into defence services after graduation", icon: "🛡️", active: false },
];

export default function EntranceTestSelect({ currentTest, onNext, onBack }: Props) {
  const [selected, setSelected] = useState(currentTest || "EAMCET");
  const [search, setSearch] = useState("");

  const filteredTests = TESTS.filter(test => 
    test.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgOrb} />
      <div className={styles.container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <button className={styles.backBtn} onClick={onBack} id="test-back-btn" style={{ marginBottom: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div style={{ position: "relative", width: "180px" }}>
            <input 
              type="text" 
              placeholder="Search Exam..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                borderRadius: "100px", padding: "8px 12px 8px 32px", fontSize: "13px", color: "var(--text)",
                outline: "none"
              }}
            />
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.5, fontSize: "12px" }}>🔍</span>
          </div>
        </div>

        <div className={styles.stepIndicator}>
          <span className={styles.stepDot} data-active="true" />
          <span className={styles.stepLine} />
          <span className={styles.stepDot} />
          <span className={styles.stepLine} />
          <span className={styles.stepDot} />
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Choose your <span className={styles.accent}>Entrance Test</span></h1>
          <p className={styles.sub}>Select the test you are preparing for to start your journey</p>
        </div>

        <div className={styles.optionsList}>
          {filteredTests.map((test) => (
            <button
              key={test.id}
              id={`test-option-${test.id.toLowerCase()}`}
              className={`${styles.optionCard} ${selected === test.id ? styles.optionSelected : ""} ${!test.active ? styles.optionDisabled : ""}`}
              onClick={() => test.active && setSelected(test.id)}
              aria-pressed={selected === test.id}
              disabled={!test.active}
            >
              <span className={styles.optionIcon}>{test.icon}</span>
              <div className={styles.optionText}>
                <span className={styles.optionLabel}>{test.label}</span>
                <span className={styles.optionDesc}>{test.desc}</span>
              </div>
              <span className={styles.optionCheck}>
                {selected === test.id && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {!test.active && <span style={{ fontSize: "10px", opacity: 0.5 }}>Soon</span>}
              </span>
            </button>
          ))}
          {filteredTests.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              No exams found for "{search}"
            </div>
          )}
        </div>

        <button
          id="test-next-btn"
          className={`${styles.nextBtn} ${!selected ? styles.nextDisabled : ""}`}
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
        >
          Next — Select State
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
