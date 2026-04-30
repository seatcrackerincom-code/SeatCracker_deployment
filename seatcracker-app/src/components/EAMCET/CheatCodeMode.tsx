"use client";

import React, { useState } from "react";
import styles from "./CheatCodeMode.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  userId: string;
  exam: string;
  course: string;
  onBack: () => void;
}

type ViewState = 'dashboard' | 'topics' | 'questions' | 'strategies';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry'];

const PLACEHOLDER_TOPICS = {
  Mathematics: [
    { id: 'm1', name: 'Coordinate Geometry', questions: 30, level: 'Hard' },
    { id: 'm2', name: 'Calculus & Integration', questions: 25, level: 'Hard' },
    { id: 'm3', name: 'Probability & Statistics', questions: 20, level: 'Intermediate' },
  ],
  Physics: [
    { id: 'p1', name: 'Thermodynamics', questions: 15, level: 'Intermediate' },
    { id: 'p2', name: 'Optics & Waves', questions: 22, level: 'Hard' },
    { id: 'p3', name: 'Electromagnetism', questions: 30, level: 'Hard' },
  ],
  Chemistry: [
    { id: 'c1', name: 'Organic Chemistry Basics', questions: 40, level: 'Hard' },
    { id: 'c2', name: 'Chemical Bonding', questions: 18, level: 'Intermediate' },
    { id: 'c3', name: 'Atomic Structure', questions: 20, level: 'Intermediate' },
  ]
};

const STRATEGIES = [
  { 
    id: 's1', 
    title: 'The Column Guessing Strategy', 
    desc: 'Master the art of identifying patterns in option columns to narrow down choices.',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  { 
    id: 's2', 
    title: 'Blind Guessing Masterclass', 
    desc: 'Scientific approach to guessing when you have absolutely no idea about the question.',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  { 
    id: 's3', 
    title: 'Elimination Techniques', 
    desc: 'Learn how to quickly eliminate 2 out of 4 options using logic and dimensional analysis.',
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  }
];

export default function CheatCodeMode({ userId, exam, course, onBack }: Props) {
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<string>(SUBJECTS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Initialize countdown (4 hours from first visit)
  React.useEffect(() => {
    let target = parseInt(localStorage.getItem("sc_cheat_unlock_time") || "0");
    if (!target) {
      target = Date.now() + 4 * 60 * 60 * 1000;
      localStorage.setItem("sc_cheat_unlock_time", target.toString());
    }

    const timer = setInterval(() => {
      const remaining = Math.max(0, target - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const isLocked = timeLeft > 0;

  const handleBack = () => {
    if (view === 'dashboard') {
      onBack();
    } else {
      setView('dashboard');
    }
  };

  const handleCardClick = (targetView: ViewState) => {
    if (isLocked) return;
    setView(targetView);
  };

  const renderDashboard = () => (
    <motion.div 
      className={styles.grid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div 
        className={`${styles.card} ${isLocked ? styles.lockedCard : ''}`} 
        onClick={() => handleCardClick('topics')}
      >
        <div className={styles.cardIcon}>📊</div>
        <h2 className={styles.cardTitle}>Topics & Formulas</h2>
        <p className={styles.cardDesc}>
          Focus on high-yield topics and master essential formulas appearing every year.
          <br />
          <strong style={{ color: isLocked ? '#fbbf24' : '#34d399' }}>
            {isLocked ? `🚀 Unlocking in ${formatTime(timeLeft)}` : '✅ Unlocked! Go Practice'}
          </strong>
        </p>
      </div>

      <div 
        className={`${styles.card} ${isLocked ? styles.lockedCard : ''}`} 
        onClick={() => handleCardClick('questions')}
      >
        <div className={styles.cardIcon}>🔄</div>
        <h2 className={styles.cardTitle}>Repeated Questions</h2>
        <p className={styles.cardDesc}>
          Master the exact questions that have recurred over the last 10 years.
          <br />
          <strong style={{ color: isLocked ? '#fbbf24' : '#34d399' }}>
            {isLocked ? `⏳ Unlocking in ${formatTime(timeLeft)}` : '✅ Unlocked! Go Practice'}
          </strong>
        </p>
      </div>

      <div 
        className={`${styles.card} ${isLocked ? styles.lockedCard : ''}`} 
        onClick={() => handleCardClick('strategies')}
      >
        <div className={styles.cardIcon}>📺</div>
        <h2 className={styles.cardTitle}>Cheat Strategies</h2>
        <p className={styles.cardDesc}>
          Watch expert videos on blind guessing and column patterns.
          <br />
          <strong style={{ color: isLocked ? '#fbbf24' : '#34d399' }}>
            {isLocked ? `✨ Unlocking in ${formatTime(timeLeft)}` : '✅ Unlocked! Watch Now'}
          </strong>
        </p>
      </div>
    </motion.div>
  );

  const renderTopics = () => (
    <motion.div 
      className={styles.detailView}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className={styles.tabs}>
        {SUBJECTS.map(sub => (
          <button 
            key={sub}
            className={`${styles.tab} ${selectedSubject === sub ? styles.active : ''}`}
            onClick={() => setSelectedSubject(sub)}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className={styles.contentList}>
        {(PLACEHOLDER_TOPICS as any)[selectedSubject].map((topic: any) => (
          <div key={topic.id} className={styles.listItem}>
            <div className={styles.itemInfo}>
              <h3>{topic.name}</h3>
              <div className={styles.itemMeta}>
                <span>{topic.questions} Questions</span>
                <span className={`${styles.badge} ${topic.level === 'Hard' ? styles.hard : styles.medium}`}>
                  {topic.level}
                </span>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderStrategies = () => (
    <motion.div 
      className={styles.strategyGrid}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {STRATEGIES.map(strategy => (
        <div key={strategy.id} className={styles.videoCard}>
          <div className={styles.thumbnail}>
            <img src={strategy.thumbnail} alt={strategy.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
            <div className={styles.playIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
          <div className={styles.videoInfo}>
            <h3>{strategy.title}</h3>
            <p>{strategy.desc}</p>
            <a href={`https://youtube.com/watch?v=${strategy.videoId}`} target="_blank" rel="noreferrer" className={styles.videoLink}>
              Watch Video
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.ambientGlow} />
      
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          {view === 'dashboard' ? 'Back to Modes' : 'Back to Cheat Codes'}
        </button>

        <header className={styles.header}>
          <h1 className={styles.title}>
            {view === 'dashboard' && "Cheat Code Mode"}
            {view === 'topics' && "Repeated Topics"}
            {view === 'questions' && "Recurring Questions"}
            {view === 'strategies' && "Strategic Guessing"}
          </h1>
          <p className={styles.subtitle}>
            {view === 'dashboard' && "Strategic preparation for the final 10 days"}
            {view === 'topics' && `High-yield topics for ${selectedSubject}`}
            {view === 'questions' && `Most repeated questions from past 10 years`}
            {view === 'strategies' && "Master the art of scientific guessing"}
          </p>
        </header>

        <AnimatePresence mode="wait">
          {view === 'dashboard' && renderDashboard()}
          {view === 'topics' && renderTopics()}
          {view === 'questions' && renderTopics()} {/* Reusing topic view for now as they share structure */}
          {view === 'strategies' && renderStrategies()}
        </AnimatePresence>
      </div>
    </div>
  );
}
