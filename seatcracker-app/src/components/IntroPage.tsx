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
          <div className={styles.penIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m14.5 3 7.5 7.5-12 12H2.5v-7.5L14.5 3Z" />
              <path d="m16.5 5 2.5 2.5" />
              <path d="m5 14.5 4.5 4.5" />
            </svg>
          </div>
          <h1 className={styles.logoTitle}>SEATCRACKER</h1>
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
            Crack your seat with <span className={styles.accent}>SeatCracker</span>
          </h2>
          <p className={styles.subheadline}>
            The beast mocktest giver
          </p>

          <div className={styles.pricingTag}>
            <span className={styles.fire}>🔥</span>
            <span>₹199 — Apply **cracker_code** coupons to get discounts.</span>
          </div>

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
