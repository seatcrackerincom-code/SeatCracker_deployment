"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./RealBattleMode.module.css";
import { generateDummyBattleQuestions, type BattleQuestion } from "../lib/battle_logic";
import { saveProgress } from "../lib/supabase";

type BattleState = "LOGIN" | "PROFILE" | "INSTRUCTIONS" | "EXAM" | "RESULT";

interface Props {
  userId: string;
  exam: string;
  course: string;
  onBack: () => void;
}

export default function RealBattleMode({ userId, exam, course, onBack }: Props) {
  const [state, setState] = useState<BattleState>("LOGIN");
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [statuses, setStatuses] = useState<Record<number, { 
    selected: string | null; 
    answered: boolean; 
    marked: boolean;
    visited: boolean;
  }>>({});
  
  // Login fields
  const [hallTicket, setHallTicket] = useState("SC-" + Math.floor(Math.random() * 900000 + 100000));
  const [password, setPassword] = useState("");
  
  // Timer
  const [secondsLeft, setSecondsLeft] = useState(180 * 60); // 3 hours

  // Initialize questions
  useEffect(() => {
    const qs = generateDummyBattleQuestions();
    setQuestions(qs);
    const initialStatuses: Record<number, any> = {};
    qs.forEach(q => {
      initialStatuses[q.id] = { selected: null, answered: false, marked: false, visited: false };
    });
    setStatuses(initialStatuses);
  }, []);

  // Timer Effect
  useEffect(() => {
    if (state !== "EXAM") return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state]);

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  // Handlers
  const handleAnswer = (opt: string) => {
    setStatuses(prev => ({
      ...prev,
      [questions[currentIdx].id]: { ...prev[questions[currentIdx].id], selected: opt }
    }));
  };

  const saveAndNext = () => {
    const qid = questions[currentIdx].id;
    const currentStatus = statuses[qid];
    const isActuallyAnswered = !!currentStatus.selected;
    
    setStatuses(prev => ({
      ...prev,
      [qid]: { ...prev[qid], answered: isActuallyAnswered, visited: true }
    }));
    
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
  };

  const markForReview = () => {
    const qid = questions[currentIdx].id;
    setStatuses(prev => ({
      ...prev,
      [qid]: { ...prev[qid], marked: true, visited: true }
    }));
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
  };

  const clearResponse = () => {
    setStatuses(prev => ({
      ...prev,
      [questions[currentIdx].id]: { ...prev[questions[currentIdx].id], selected: null, answered: false }
    }));
  };

  const handleSubmit = useCallback(() => {
    const correct = questions.filter(q => statuses[q.id].selected === q.answer).length;
    const accuracy = Math.round((correct / questions.length) * 100);
    const timeTaken = (180 * 60) - secondsLeft;

    saveProgress({
      user_id: userId,
      topic: "Full Mock Battle",
      subject: "Mixed",
      accuracy: accuracy,
      avg_time: Number((timeTaken / questions.length).toFixed(1)),
      completed: true,
      last_attempt_at: new Date().toISOString()
    }).catch(console.error);

    setState("RESULT");
  }, [questions, statuses, secondsLeft, userId]);

  // Render Screens
  if (state === "LOGIN") {
    return (
      <div className={styles.battleWrapper}>
        <div className={styles.loginScreen}>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>Candidate Login</div>
            <div className={styles.loginBody}>
              <div className={styles.loginInputGroup}>
                <label className={styles.loginLabel}>Hall Ticket No:</label>
                <input className={styles.loginInput} value={hallTicket} readOnly />
                <span style={{fontSize: '11px', color: '#666'}}>* This is your mock ID for today</span>
              </div>
              <div className={styles.loginInputGroup}>
                <label className={styles.loginLabel}>Password:</label>
                <input 
                  className={styles.loginInput} 
                  type="password" 
                  placeholder="Enter any password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button className={styles.loginBtn} onClick={() => setState("PROFILE")}>Sign In</button>
              <button onClick={onBack} style={{marginTop: '15px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '12px', width: '100%'}}>← Back to SeatCracker</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state === "PROFILE") {
    return (
      <div className={styles.battleWrapper}>
        <div className={styles.examHeader}>
          <div className={styles.candidateInfo}>
            <div className={styles.candidatePhoto}>
              <img src="/character-avatar.png" style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Candidate" />
            </div>
            <div className={styles.candidateDetails}>
              <div><strong>Name:</strong> Learner</div>
              <div><strong>Subject:</strong> {course} {exam}</div>
            </div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: '18px', fontWeight: 'bold'}}>System Node: C001</div>
          </div>
        </div>
        <div className={styles.instructionScreen}>
          <div className={styles.instructionBox}>
             <h2 className={styles.instructionTitle}>Profile Confirmation</h2>
             <p>Welcome, <strong>Learner</strong>!</p>
             <p>Please verify your details before starting the examination. In a real exam, you would see your official photograph and hall ticket number here.</p>
             <div style={{marginTop: '40px'}}>
               <button className={styles.startBtn} onClick={() => setState("INSTRUCTIONS")}>Confirm & View Instructions</button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (state === "INSTRUCTIONS") {
    return (
      <div className={styles.battleWrapper}>
        <div className={styles.examHeader}>
           <div style={{fontSize: '18px', fontWeight: 'bold'}}>EAMCET {exam} Simulation</div>
           <div className={styles.candidateDetails}>Time Left: 180:00</div>
        </div>
        <div className={styles.instructionScreen}>
           <div className={styles.instructionBox}>
              <h2 className={styles.instructionTitle}>General Instructions</h2>
              <div style={{fontSize: '14px', color: '#444', lineHeight: '1.8'}}>
                <p>1. The duration of the examination is 180 minutes.</p>
                <p>2. The clock will be set at the server. The countdown timer in the top right corner of the screen will display the remaining time available for you to complete the examination.</p>
                <p>3. The Question Palette displayed on the right side of the screen will show the status of each question using one of the following symbols:</p>
                <ul style={{listStyle: 'none', paddingLeft: 0, marginTop: '10px'}}>
                  <li>⚪ You have not visited the question yet.</li>
                  <li>🔴 You have not answered the question.</li>
                  <li>🟢 You have answered the question.</li>
                  <li>🟣 You have NOT answered the question but have marked the question for review.</li>
                </ul>
                <p style={{marginTop: '20px', fontWeight: 'bold'}}>Navigating to a Question:</p>
                <p>4. To select your answer, click on the button of one of the options.</p>
                <p>5. To deselect your chosen answer, click on the button of the chosen option again or click the Clear Response button.</p>
              </div>
              <div className={styles.agreeFooter}>
                <input type="checkbox" id="agree" />
                <label htmlFor="agree" style={{fontSize: '13px', fontWeight: 'bold'}}>I have read and understood the instructions. All computer hardware allotted to me are in proper working condition.</label>
                <button className={styles.startBtn} onClick={() => setState("EXAM")}>I am ready to begin</button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (state === "EXAM") {
    const q = questions[currentIdx];
    const status = statuses[q.id];
    const currentSubject = q.subject;
    
    // Group palette by subject
    const maths = questions.filter(q => q.subject === "Mathematics");
    const physics = questions.filter(q => q.subject === "Physics");
    const chemistry = questions.filter(q => q.subject === "Chemistry");

    return (
      <div className={styles.battleWrapper}>
        <div className={styles.examHeader}>
           <div style={{fontSize: '16px', fontWeight: 'bold'}}>EAMCET {exam} {course} (Simulated)</div>
           <div className={styles.timerBox}>{fmtTime(secondsLeft)}</div>
           <div className={styles.candidateInfo}>
              <div className={styles.candidateDetails} style={{textAlign: 'right'}}>
                <div>Learner</div>
                <div style={{fontSize: '11px', opacity: 0.8}}>{hallTicket}</div>
              </div>
              <div className={styles.candidatePhoto} style={{width: '40px', height: '40px'}} />
           </div>
        </div>
        
        <div className={styles.subjectNav}>
           <button className={`${styles.tab} ${currentSubject === "Mathematics" ? styles.tabActive : ""}`} onClick={() => setCurrentIdx(questions.findIndex(q => q.subject === "Mathematics"))}>Mathematics</button>
           <button className={`${styles.tab} ${currentSubject === "Physics" ? styles.tabActive : ""}`} onClick={() => setCurrentIdx(questions.findIndex(q => q.subject === "Physics"))}>Physics</button>
           <button className={`${styles.tab} ${currentSubject === "Chemistry" ? styles.tabActive : ""}`} onClick={() => setCurrentIdx(questions.findIndex(q => q.subject === "Chemistry"))}>Chemistry</button>
        </div>

        <div className={styles.mainContainer}>
           <div className={styles.questionArea}>
              <div className={styles.qHeader}>Question No. {currentIdx + 1}</div>
              <div className={styles.qContent}>{q.question}</div>
              <div className={styles.optionList}>
                 {Object.entries(q.options).map(([key, val]) => (
                   <label key={key} className={styles.optionItem}>
                     <input 
                       type="radio" 
                       name={`q-${q.id}`} 
                       checked={status.selected === key} 
                       onChange={() => handleAnswer(key)}
                     /> 
                     <span>{key}. {val}</span>
                   </label>
                 ))}
              </div>
           </div>
           
           <div className={styles.paletteSide}>
              <div className={styles.paletteTitle}>Question Palette</div>
              <div className={styles.paletteGrid}>
                 {questions.map((pq, idx) => {
                   const s = statuses[pq.id];
                   let shapeClass = styles.status_0;
                   if (s.answered) shapeClass = styles.status_green;
                   else if (s.marked) shapeClass = styles.status_purple;
                   else if (s.visited) shapeClass = styles.status_red;
                   
                   return (
                     <div 
                      key={pq.id} 
                      className={`${styles.palBtn} ${shapeClass} ${currentIdx === idx ? styles.activePal : ""}`}
                      onClick={() => setCurrentIdx(idx)}
                     >
                       {idx + 1}
                     </div>
                   );
                 })}
              </div>
              <div style={{padding: '15px', borderTop: '1px solid #ccc', fontSize: '11px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px'}}>
                 <div style={{display:'flex', gap:'5px'}}><span className={styles.status_green} style={{width:'12px', height:'12px', display:'inline-block'}}/> Answered</div>
                 <div style={{display:'flex', gap:'5px'}}><span className={styles.status_red} style={{width:'12px', height:'12px', display:'inline-block'}}/> Not Answered</div>
                 <div style={{display:'flex', gap:'5px'}}><span className={styles.status_0} style={{width:'12px', height:'12px', display:'inline-block'}}/> Not Visited</div>
                 <div style={{display:'flex', gap:'5px'}}><span className={styles.status_purple} style={{width:'12px', height:'12px', borderRadius: '50%', display:'inline-block'}}/> Marked</div>
              </div>
           </div>
        </div>

        <div className={styles.examFooter}>
           <div className={styles.footerLeft}>
             <button className={styles.navBtn} onClick={markForReview}>Mark for Review & Next</button>
             <button className={styles.navBtn} onClick={clearResponse}>Clear Response</button>
           </div>
           <div className={styles.footerRight}>
             <button className={styles.navBtn} onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)}>Back</button>
             <button className={`${styles.navBtn} ${styles.saveBtn}`} onClick={saveAndNext}>Save & Next</button>
             <button className={styles.navBtn} style={{background: '#1e3a5f', color: '#fff'}} onClick={handleSubmit}>Submit</button>
           </div>
        </div>
      </div>
    );
  }

  if (state === "RESULT") {
    const answeredCount = Object.values(statuses).filter(s => s.answered).length;
    return (
      <div className={styles.battleWrapper}>
        <div className={styles.loginScreen}>
          <div className={styles.loginCard} style={{width: '500px', textAlign: 'center', padding: '40px'}}>
             <h1 style={{color: '#1e3a5f'}}>Exam Submitted</h1>
             <p style={{marginTop: '20px'}}>You have successfully completed the Real Battle simulation.</p>
             <div style={{margin: '30px 0', padding: '20px', background: '#f5f5f5', borderRadius: '8px'}}>
                <div style={{fontSize: '24px', fontWeight: 'bold'}}>{answeredCount} / 160</div>
                <div style={{fontSize: '12px', color: '#666'}}>Questions Answered</div>
             </div>
             <p style={{fontSize: '13px', color: '#666'}}>Detailed analytics will be available once the user-provided question bank is integrated.</p>
             <button className={styles.loginBtn} style={{marginTop: '30px'}} onClick={onBack}>Return to SeatCracker</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
