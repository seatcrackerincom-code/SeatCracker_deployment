"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BattleCinema.module.css";

/* ── Scene types ─────────────────────────────────────────── */
type Scene = "study_end" | "walk" | "robo" | "battle_decl" | "glitch";

const SCENES: Scene[] = ["study_end", "walk", "robo", "battle_decl", "glitch"];

const DURATIONS: Record<Scene, number> = {
  study_end: 3800,
  walk: 4200,
  robo: 3600,
  battle_decl: 3500,
  glitch: 1800,
};

interface Props {
  onComplete: () => void;
}

/* ═══════════════════════════════════════════════════════════
   MAIN ORCHESTRATOR
   ═══════════════════════════════════════════════════════════ */
export default function BattleCinema({ onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const scene = SCENES[idx];

  const skip = useCallback(() => onComplete(), [onComplete]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (idx < SCENES.length - 1) {
        setIdx((i) => i + 1);
      } else {
        onComplete();
      }
    }, DURATIONS[scene]);
    return () => clearTimeout(t);
  }, [idx, scene, onComplete]);

  return (
    <div className={styles.root}>
      <button className={styles.skipBtn} onClick={skip}>
        Skip Intro ›
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className={styles.scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
        >
          {scene === "study_end" && <StudyEndScene />}
          {scene === "walk" && <WalkScene />}
          {scene === "robo" && <RoboScene />}
          {scene === "battle_decl" && <BattleDeclScene />}
          {scene === "glitch" && <GlitchScene />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE 1 — STUDY END
   Dark room · student closes book · "Preparation Complete."
   ═══════════════════════════════════════════════════════════ */
function StudyEndScene() {
  return (
    <div className={styles.studyRoot}>
      <div className={styles.lampGlow} />

      {/* Desk + lamp */}
      <div className={styles.deskWrap}>
        <div className={styles.lamp}>
          <div className={styles.lampBase} />
          <div className={styles.lampPole} />
          <div className={styles.lampArm} />
          <div className={styles.lampShade} />
          <div className={styles.lampBeam} />
        </div>
        <div className={styles.bookGroup}>
          <div className={styles.bookLeft} />
          <div className={styles.bookRight} />
          <div className={styles.bookSpine} />
        </div>
        <div className={styles.desk} />
      </div>

      {/* Avatar sitting */}
      <div className={styles.studentSitWrap}>
        <StudyAvatar />
      </div>

      <motion.p
        className={styles.caption}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.9 }}
      >
        Preparation Complete.
      </motion.p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE 2 — WALKING
   Fog path · particles · avatar walks forward
   ═══════════════════════════════════════════════════════════ */
function WalkScene() {
  return (
    <div className={styles.walkRoot}>
      <div className={styles.starField} />
      <div className={styles.fogLower} />
      <div className={styles.fogMid} />
      <div className={styles.groundPath} />
      <div className={styles.pathGlow} />

      {/* Walking avatar animates across screen */}
      <motion.div
        className={styles.walkAvatarWrap}
        animate={{ x: ["0vw", "30vw"] }}
        transition={{ duration: 4.2, ease: "linear" }}
      >
        <WalkAvatar />
      </motion.div>

      {/* Floating particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${(i * 4.9 + 3) % 94}%`,
            bottom: `${26 + (i * 11) % 22}%`,
            animationDelay: `${(i * 0.18) % 2.8}s`,
            "--pdur": `${2.4 + (i * 0.28) % 1.6}s`,
            "--pdrift": `${((i % 7) - 3) * 13}px`,
            width: `${1.5 + (i % 3)}px`,
            height: `${1.5 + (i % 3)}px`,
          } as React.CSSProperties}
        />
      ))}

      <motion.p
        className={styles.caption}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.0 }}
      >
        The path forward has no shortcuts.
      </motion.p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE 3 — ROBO ENTRY
   Screen shakes · Robo slides in from right · red glow
   ═══════════════════════════════════════════════════════════ */
function RoboScene() {
  return (
    <motion.div
      className={styles.roboRoot}
      animate={{ x: [0, -10, 10, -8, 8, -5, 5, -2, 2, 0] }}
      transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
    >
      <div className={styles.roboRedAtm} />
      <div className={styles.groundLines} />

      {/* Robo enters from right */}
      <motion.div
        className={styles.roboCenterWrap}
        initial={{ x: "115vw" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 85, damping: 15, delay: 0.55 }}
      >
        <RoboCharacter />
      </motion.div>

      {/* Ground impact crack */}
      <motion.div
        className={styles.groundCrack}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.45, ease: "easeOut" }}
      />

      <motion.p
        className={styles.captionRed}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3, duration: 0.7 }}
      >
        Your Opponent Has Arrived.
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE 4 — BATTLE DECLARATION
   "A Battle Against Time Begins" · Robo steps forward
   ═══════════════════════════════════════════════════════════ */
function BattleDeclScene() {
  return (
    <div className={styles.declRoot}>
      <div className={styles.declAtm} />

      {/* Robo silhouette — right background */}
      <motion.div
        className={styles.declRoboWrap}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          animate={{ x: [0, -14] }}
          transition={{ delay: 1.9, duration: 0.6, ease: "easeOut" }}
        >
          <RoboCharacter />
        </motion.div>
      </motion.div>

      {/* Center text block */}
      <div className={styles.declCenter}>
        <motion.h2
          className={styles.battleTitle}
          initial={{ opacity: 0, letterSpacing: "20px", scale: 0.87 }}
          animate={{ opacity: 1, letterSpacing: "5px", scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          A Battle Against Time Begins
        </motion.h2>

        <motion.div
          className={styles.titleDivider}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.95, duration: 0.65 }}
        />

        <motion.p
          className={styles.battleSub}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.75 }}
        >
          Defeat Time… or be defeated.
        </motion.p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE 5 — GLITCH TRANSITION
   Scanlines · chromatic aberration · fade to black
   ═══════════════════════════════════════════════════════════ */
function GlitchScene() {
  return (
    <div className={styles.glitchRoot}>
      <motion.div
        className={styles.glitchContainer}
        animate={{
          filter: [
            "hue-rotate(0deg)   brightness(1)",
            "hue-rotate(88deg)  brightness(1.6)",
            "hue-rotate(0deg)   brightness(0.3)",
            "hue-rotate(200deg) brightness(2.2)",
            "hue-rotate(0deg)   brightness(0.1)",
            "hue-rotate(300deg) brightness(1.9)",
            "hue-rotate(0deg)   brightness(0)",
          ],
        }}
        transition={{ duration: 1.8, times: [0, 0.14, 0.3, 0.5, 0.65, 0.82, 1] }}
      >
        <div className={styles.glitchBg} />
      </motion.div>

      <div className={styles.scan1} />
      <div className={styles.scan2} />
      <div className={styles.scan3} />
      <div className={styles.chromaR} />
      <div className={styles.chromaB} />

      <motion.div
        className={styles.blackout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.05, duration: 0.75 }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AVATAR: Sitting / Study pose
   ═══════════════════════════════════════════════════════════ */
function StudyAvatar() {
  return (
    <svg
      viewBox="0 0 110 180"
      width="110"
      height="180"
      className={styles.avatarSvg}
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="55" cy="28" r="22" fill="#d4956a" />
      {/* Hair */}
      <ellipse cx="55" cy="12" rx="20" ry="10" fill="#221108" />
      <ellipse cx="36" cy="22" rx="7" ry="12" fill="#221108" />
      {/* Eyes */}
      <circle cx="47" cy="27" r="2.5" fill="#1a0a00" />
      <circle cx="63" cy="27" r="2.5" fill="#1a0a00" />
      {/* Smile */}
      <path d="M48 36 Q55 42 62 36" stroke="#1a0a00" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Neck */}
      <rect x="49" y="48" width="12" height="10" rx="3" fill="#d4956a" />
      {/* Torso */}
      <rect x="30" y="56" width="50" height="56" rx="9" fill="#1e40af" />
      <line x1="55" y1="56" x2="55" y2="112" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
      <rect x="34" y="59" width="8" height="5" rx="2" fill="#3b82f6" />
      {/* Arms – resting on desk */}
      <rect x="8" y="62" width="24" height="10" rx="5" fill="#1e40af" transform="rotate(-10,8,62)" />
      <rect x="78" y="62" width="24" height="10" rx="5" fill="#1e40af" transform="rotate(10,102,62)" />
      {/* Hands */}
      <circle cx="10" cy="74" r="7" fill="#d4956a" />
      <circle cx="100" cy="74" r="7" fill="#d4956a" />
      {/* Legs – sitting */}
      <rect x="35" y="112" width="15" height="44" rx="7" fill="#1e1b4b" />
      <rect x="60" y="112" width="15" height="44" rx="7" fill="#1e1b4b" />
      {/* Shoes */}
      <ellipse cx="42" cy="158" rx="13" ry="7" fill="#111" />
      <ellipse cx="68" cy="158" rx="13" ry="7" fill="#111" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   AVATAR: Walking (CSS-animated limbs)
   ═══════════════════════════════════════════════════════════ */
function WalkAvatar() {
  return (
    <svg viewBox="0 0 90 170" width="90" height="170" overflow="visible" aria-hidden="true">
      {/* Bobbing body group */}
      <g className={styles.walkBodyGroup}>
        {/* Head */}
        <circle cx="45" cy="24" r="18" fill="#d4956a" />
        <ellipse cx="45" cy="10" rx="16" ry="8" fill="#221108" />
        <circle cx="38" cy="23" r="2" fill="#1a0a00" />
        <circle cx="52" cy="23" r="2" fill="#1a0a00" />
        {/* Neck */}
        <rect x="40" y="40" width="10" height="8" rx="3" fill="#d4956a" />
        {/* Torso */}
        <rect x="24" y="46" width="42" height="44" rx="7" fill="#1e40af" />
        <line x1="45" y1="46" x2="45" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </g>

      {/* Left arm */}
      <rect
        x="8" y="52" width="18" height="9" rx="4" fill="#1e40af"
        className={styles.armL}
        style={{ transformOrigin: "26px 56px" }}
      />
      {/* Right arm */}
      <rect
        x="64" y="52" width="18" height="9" rx="4" fill="#1e40af"
        className={styles.armR}
        style={{ transformOrigin: "64px 56px" }}
      />

      {/* Left leg */}
      <rect
        x="29" y="90" width="14" height="44" rx="7" fill="#1e1b4b"
        className={styles.legL}
        style={{ transformOrigin: "36px 90px" }}
      />
      {/* Right leg */}
      <rect
        x="47" y="90" width="14" height="44" rx="7" fill="#1e1b4b"
        className={styles.legR}
        style={{ transformOrigin: "54px 90px" }}
      />

      {/* Shoes */}
      <ellipse
        cx="36" cy="136" rx="11" ry="6" fill="#111"
        className={styles.legL}
        style={{ transformOrigin: "36px 90px" }}
      />
      <ellipse
        cx="54" cy="136" rx="11" ry="6" fill="#111"
        className={styles.legR}
        style={{ transformOrigin: "54px 90px" }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROBO CHARACTER — CSS+SVG robot
   Chest shows DECORATIVE "03:00:00" (NOT the real timer)
   ═══════════════════════════════════════════════════════════ */
export function RoboCharacter() {
  return (
    <div className={styles.roboFigure}>
      <svg
        viewBox="-28 0 236 300"
        width="180"
        height="280"
        className={styles.roboSvg}
        overflow="visible"
        aria-hidden="true"
      >
        {/* ── Antennas ── */}
        <rect x="70" y="0" width="6" height="22" rx="3" fill="#dc2626" />
        <circle cx="73" cy="0" r="5" fill="#ef4444" />
        <rect x="102" y="4" width="5" height="16" rx="2.5" fill="#b91c1c" />
        <circle cx="104" cy="3" r="4" fill="#dc2626" />

        {/* ── Head ── */}
        <rect x="20" y="18" width="140" height="90" rx="10" fill="#111827" stroke="#dc2626" strokeWidth="2" />
        <rect x="20" y="18" width="140" height="15" rx="10" fill="#1f2937" />
        <rect x="20" y="26" width="140" height="7" fill="#1f2937" />

        {/* ── Eyes (LED) ── */}
        <rect x="30" y="36" width="50" height="28" rx="5" fill="#0f0000" />
        <rect x="100" y="36" width="50" height="28" rx="5" fill="#0f0000" />
        {/* Glowing fills */}
        <rect x="32" y="38" width="46" height="24" rx="4" fill="#dc2626" className={styles.roboEye} />
        <rect x="102" y="38" width="46" height="24" rx="4" fill="#dc2626" className={styles.roboEye} />
        {/* Gleam highlights */}
        <rect x="34" y="40" width="13" height="8" rx="2" fill="rgba(255,190,190,0.5)" />
        <rect x="104" y="40" width="13" height="8" rx="2" fill="rgba(255,190,190,0.5)" />

        {/* ── Nose sensor ── */}
        <circle cx="90" cy="74" r="4" fill="#374151" stroke="#dc2626" strokeWidth="1" />
        <circle cx="90" cy="74" r="2" fill="#dc2626" opacity="0.6" />

        {/* ── Mouth grill ── */}
        <rect x="36" y="82" width="108" height="20" rx="5" fill="#0f0000" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={40 + i * 16} y="86" width="10" height="12" rx="2" fill="#dc2626" opacity="0.65" />
        ))}

        {/* ── Neck ── */}
        <rect x="70" y="108" width="40" height="18" rx="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={80 + i * 10} cy="117" r="3" fill="#374151" />
        ))}

        {/* ── Body ── */}
        <rect x="12" y="124" width="156" height="112" rx="12" fill="#111827" stroke="#dc2626" strokeWidth="1.5" />
        <rect x="12" y="124" width="156" height="17" rx="12" fill="#1f2937" />
        <rect x="12" y="134" width="156" height="7" fill="#1f2937" />

        {/* ── Chest panel (DECORATIVE TIMER) ── */}
        <rect x="28" y="148" width="124" height="50" rx="6" fill="#0a0000" stroke="#dc2626" strokeWidth="1.5" />
        <rect x="32" y="152" width="116" height="42" rx="4" fill="#0f0000" />
        {/* Decorative LED timer — purely cinematic, NOT the real exam timer */}
        <text
          x="90" y="179"
          textAnchor="middle"
          fill="#ef4444"
          fontSize="24"
          fontFamily="'Courier New', Courier, monospace"
          fontWeight="700"
          className={styles.chestTimer}
        >
          03:00:00
        </text>
        <text
          x="90" y="191"
          textAnchor="middle"
          fill="#7f1d1d"
          fontSize="7"
          fontFamily="monospace"
          letterSpacing="2"
        >
          TIME REMAINING
        </text>

        {/* ── Side vents ── */}
        <rect x="16" y="204" width="28" height="24" rx="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="18" y1={208 + i * 7} x2="42" y2={208 + i * 7} stroke="#374151" strokeWidth="1.5" />
        ))}
        <rect x="136" y="204" width="28" height="24" rx="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="138" y1={208 + i * 7} x2="162" y2={208 + i * 7} stroke="#374151" strokeWidth="1.5" />
        ))}

        {/* ── Core reactor ── */}
        <circle cx="90" cy="214" r="17" fill="#0f0000" stroke="#dc2626" strokeWidth="1.5" />
        <circle cx="90" cy="214" r="10" fill="#dc2626" className={styles.reactorCore} />
        <circle cx="90" cy="214" r="5" fill="#fca5a5" />

        {/* ── Arms ── */}
        <rect x="-16" y="128" width="30" height="18" rx="7" fill="#1f2937" stroke="#374151" strokeWidth="1" />
        <rect x="-20" y="144" width="22" height="40" rx="7" fill="#111827" stroke="#374151" strokeWidth="1" />
        <rect x="-22" y="182" width="26" height="12" rx="4" fill="#dc2626" opacity="0.4" />
        <rect x="166" y="128" width="30" height="18" rx="7" fill="#1f2937" stroke="#374151" strokeWidth="1" />
        <rect x="178" y="144" width="22" height="40" rx="7" fill="#111827" stroke="#374151" strokeWidth="1" />
        <rect x="176" y="182" width="26" height="12" rx="4" fill="#dc2626" opacity="0.4" />

        {/* ── Legs ── */}
        <rect x="26" y="234" width="52" height="44" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="1" />
        <rect x="102" y="234" width="52" height="44" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="1" />

        {/* ── Feet ── */}
        <rect x="18" y="270" width="68" height="18" rx="6" fill="#111827" stroke="#dc2626" strokeWidth="1" />
        <rect x="94" y="270" width="68" height="18" rx="6" fill="#111827" stroke="#dc2626" strokeWidth="1" />
      </svg>
    </div>
  );
}
