"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./IntroPage.module.css";

interface Props {
  onStart: () => void;
}

export default function IntroPage({ onStart }: Props) {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scaleCard = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div className={styles.wrapper}>
      {/* Parallax Background */}
      <motion.div 
        className={styles.background} 
        style={{ y: yBg }} 
      />

      {/* Header with Pen Icon */}
      <header className={styles.header}>
        <div className={styles.logoRow}>
          <div className={styles.logoRing}>
            <img src="/logo.png" alt="SeatCracker Logo" className={styles.logoIcon} />
          </div>
          <h1 className={styles.logoTitle}>
            seatcracker.com
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.container}>
        <motion.div 
          className={styles.glassCard}
          style={{ opacity: opacityText, scale: scaleCard }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className={styles.headline}>
            SeatCracker - <span className={styles.accent}>Competitive Exam</span> Practice Platform
          </h2>
          <p className={styles.subheadline}>
            Smart Practice for EAMCET, JEE, NEET and more. Topic-wise questions, mock tests, and performance analytics.
          </p>


          <button
            id="intro-get-started-btn"
            className={styles.ctaBtn}
            onClick={onStart}
          >
            <span>Get Started Now</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

        </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className={styles.scrollDown}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>Scroll down to explore</span>
        <div className={styles.scrollLine} />
      </motion.div>
    </div>
  );
}
