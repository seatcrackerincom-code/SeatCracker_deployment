---
name: battle-mode-engine
description: >
  Cinematic interactive "Battle Mode" exam engine for SeatCracker where the
  user fights against time (Timer Robo) while solving real exam questions.
  Covers intro cinema, scene state machine, timer sync, exam navigation,
  Framer Motion animation pipeline, and game logic.
tech_stack:
  - Next.js (App Router)
  - React
  - Tailwind CSS
  - Framer Motion
  - requestAnimationFrame
scope:
  - Intro cinematic engine
  - Scene state machine
  - Timer system (03:00:00 countdown)
  - 160-question exam engine
  - Animation pipeline
  - Game-over / success logic
---

# SeatCracker — Battle Mode Engine Skill

## Overview

Battle Mode is SeatCracker's flagship cinematic exam simulation.  
When a user clicks **"Real Battle Mode"**, a dramatic intro sequence plays before the exam starts. Timer Robo appears as the antagonist; the user must complete 160 questions before time (3 hours) runs out.

---

## 1. Intro Engine

### Trigger
- Activated on `"Real Battle Mode"` button click from the main dashboard.
- Replays on every entry (no "already seen" skip in state — always fresh).

### Behavior
- Full-screen takeover with cinematic black fade-in.
- Scene plays in defined order (see Scene System below).
- **Skip Intro** button always visible in the top-right corner.
- On skip: jump directly to `exam_mode` state.

### Implementation Pattern
```tsx
// hooks/useBattleIntro.ts
import { useState, useCallback } from "react";
import { BattleScene } from "@/types/battle";

export function useBattleIntro() {
  const [scene, setScene] = useState<BattleScene>("intro_start");

  const skipIntro = useCallback(() => setScene("exam_mode"), []);
  const advance = useCallback((next: BattleScene) => setScene(next), []);

  return { scene, skipIntro, advance };
}
```

---

## 2. Scene State Machine

### States

| State         | Description                                              | Next State      |
|---------------|----------------------------------------------------------|-----------------|
| `intro_start` | Black screen → SeatCracker logo fade-in                  | `walking_scene` |
| `walking_scene` | Animated character walks toward exam arena             | `robo_entry`    |
| `robo_entry`  | Timer Robo appears with dramatic entrance animation      | `battle_start`  |
| `battle_start`| "Battle Start!" text with countdown 3-2-1               | `exam_mode`     |
| `exam_mode`   | Full exam UI with live timer                             | `failure` / success |
| `failure`     | Time ran out — failure animation + Game Over screen      | (terminal)      |
| `ego_mode`    | Ego comeback animation — triggered on near-failure rally | `exam_mode`     |

### State Flow Diagram
```
intro_start
    │
    ▼
walking_scene
    │
    ▼
robo_entry
    │
    ▼
battle_start
    │
    ▼
exam_mode ──────────────────► failure (time = 0)
    │                              │
    │  [ego_mode trigger]          ▼
    └──── ego_mode ──────► exam_mode (continue)
    │
    ▼ (all 160 answered)
  success
```

### Implementation Pattern
```tsx
// components/BattleSceneController.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useBattleIntro } from "@/hooks/useBattleIntro";
import { IntroScene, WalkingScene, RoboEntry, BattleStart } from "./scenes";
import ExamEngine from "./ExamEngine";
import FailureScreen from "./FailureScreen";
import EgoModeScreen from "./EgoModeScreen";

export default function BattleSceneController() {
  const { scene, skipIntro, advance } = useBattleIntro();

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Always-visible skip button during intro */}
      {["intro_start","walking_scene","robo_entry","battle_start"].includes(scene) && (
        <button
          onClick={skipIntro}
          className="absolute top-4 right-4 z-50 text-white/60 hover:text-white
                     text-sm border border-white/20 px-3 py-1 rounded-full
                     backdrop-blur-sm transition-all"
        >
          Skip Intro ›
        </button>
      )}

      <AnimatePresence mode="wait">
        {scene === "intro_start" && (
          <IntroScene key="intro" onComplete={() => advance("walking_scene")} />
        )}
        {scene === "walking_scene" && (
          <WalkingScene key="walk" onComplete={() => advance("robo_entry")} />
        )}
        {scene === "robo_entry" && (
          <RoboEntry key="robo" onComplete={() => advance("battle_start")} />
        )}
        {scene === "battle_start" && (
          <BattleStart key="start" onComplete={() => advance("exam_mode")} />
        )}
        {scene === "exam_mode" && (
          <ExamEngine key="exam"
            onFailure={() => advance("failure")}
            onEgoMode={() => advance("ego_mode")}
          />
        )}
        {scene === "failure" && <FailureScreen key="fail" />}
        {scene === "ego_mode" && (
          <EgoModeScreen key="ego" onComplete={() => advance("exam_mode")} />
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## 3. Timer System

### Spec
- **Start**: `03:00:00` (10,800 seconds)
- **Sync**: Uses `requestAnimationFrame` for frame-accurate countdown (no drift).
- **UI Sync**: Timer value broadcast via React context so Robo animation can react.
- **Thresholds**:
  - `< 30 min` → tension color shift (amber → red)
  - `< 10 min` → Robo shaking animation starts
  - `= 00:00:00` → trigger `failure` state

### Implementation Pattern
```tsx
// hooks/useBattleTimer.ts
import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_SECONDS = 3 * 60 * 60; // 10800

export function useBattleTimer(onExpire: () => void) {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setRunning(true);
    lastTickRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (!running) return;

    const tick = (now: number) => {
      const elapsed = (now - (lastTickRef.current ?? now)) / 1000;
      lastTickRef.current = now;

      setRemaining((prev) => {
        const next = Math.max(0, prev - elapsed);
        if (next === 0) onExpire();
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, onExpire]);

  const formatted = new Date(remaining * 1000).toISOString().slice(11, 19);

  return { remaining, formatted, start };
}
```

### Timer Display Component
```tsx
// components/BattleTimer.tsx
import { motion } from "framer-motion";

interface Props { formatted: string; remaining: number; }

export default function BattleTimer({ formatted, remaining }: Props) {
  const isWarning = remaining < 30 * 60;
  const isDanger  = remaining < 10 * 60;

  return (
    <motion.div
      animate={isDanger ? { x: [-2, 2, -2, 2, 0] } : {}}
      transition={{ repeat: Infinity, duration: 0.4 }}
      className={`font-mono text-4xl font-bold tabular-nums
        ${isDanger  ? "text-red-400 drop-shadow-[0_0_12px_#f87171]" :
          isWarning ? "text-amber-400 drop-shadow-[0_0_8px_#fbbf24]"  :
                      "text-emerald-400 drop-shadow-[0_0_6px_#34d399]"}`}
    >
      {formatted}
    </motion.div>
  );
}
```

---

## 4. Exam Engine

### Spec
- **160 questions** loaded from the question bank (JSON or Supabase).
- Navigation grid with question numbers (color-coded: unanswered / answered / flagged).
- Actions per question: **Save & Next** | **Mark for Review** | **Clear Response**.
- Submit locked until timer expires (anti-skip security).

### Data Shape
```ts
// types/battle.ts
export type BattleScene =
  | "intro_start" | "walking_scene" | "robo_entry"
  | "battle_start" | "exam_mode" | "failure" | "ego_mode";

export interface Question {
  id: number;
  subject: "physics" | "chemistry" | "mathematics" | "biology";
  text: string;
  options: [string, string, string, string];
  correctIndex: number;
  difficulty: "easy" | "medium" | "hard";
}

export type AnswerMap = Record<number, number | null>;  // questionId → selectedIndex
export type FlagMap   = Record<number, boolean>;
```

### Exam State Hook
```tsx
// hooks/useExamEngine.ts
import { useState, useCallback } from "react";
import { Question, AnswerMap, FlagMap } from "@/types/battle";

export function useExamEngine(questions: Question[]) {
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState<AnswerMap>({});
  const [flagged, setFlagged]   = useState<FlagMap>({});

  const answer = useCallback((qId: number, idx: number) =>
    setAnswers((a) => ({ ...a, [qId]: idx })), []);

  const clearAnswer = useCallback((qId: number) =>
    setAnswers((a) => ({ ...a, [qId]: null })), []);

  const toggleFlag = useCallback((qId: number) =>
    setFlagged((f) => ({ ...f, [qId]: !f[qId] })), []);

  const goTo = useCallback((idx: number) =>
    setCurrent(Math.max(0, Math.min(idx, questions.length - 1))), [questions]);

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;

  return { current, answers, flagged, answeredCount, answer, clearAnswer, toggleFlag, goTo };
}
```

### Navigation Grid
```tsx
// components/QuestionGrid.tsx
import clsx from "clsx";

interface Props {
  total: number;
  current: number;
  answers: Record<number, number | null>;
  flagged: Record<number, boolean>;
  onSelect: (i: number) => void;
}

export default function QuestionGrid({ total, current, answers, flagged, onSelect }: Props) {
  return (
    <div className="grid grid-cols-10 gap-1 p-2">
      {Array.from({ length: total }, (_, i) => {
        const isAnswered = answers[i] !== null && answers[i] !== undefined;
        const isFlagged  = flagged[i];
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={clsx(
              "w-7 h-7 text-xs font-bold rounded transition-all",
              i === current   && "ring-2 ring-white scale-110",
              isFlagged       && "bg-amber-500 text-black",
              isAnswered && !isFlagged && "bg-emerald-600 text-white",
              !isAnswered && !isFlagged && "bg-white/10 text-white/50 hover:bg-white/20"
            )}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
```

---

## 5. Animation Engine (Framer Motion)

### Reusable Variants
```tsx
// lib/battleAnimations.ts
import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
  exit:   { opacity: 0, transition: { duration: 0.4 } },
};

export const scaleUp: Variants = {
  hidden:  { scale: 0.6, opacity: 0 },
  visible: { scale: 1,   opacity: 1, transition: { type: "spring", stiffness: 180, damping: 20 } },
  exit:    { scale: 1.1, opacity: 0 },
};

export const slideInFromBottom: Variants = {
  hidden:  { y: 80,  opacity: 0 },
  visible: { y: 0,   opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit:    { y: -40, opacity: 0 },
};

export const shake: Variants = {
  idle:   { x: 0 },
  shaking:{ x: [-6, 6, -6, 6, -3, 3, 0], transition: { duration: 0.5 } },
};

export const glow: Variants = {
  off: { filter: "drop-shadow(0 0 0px transparent)" },
  on:  { filter: "drop-shadow(0 0 24px #a855f7)", transition: { duration: 0.4 } },
};

export const roboEntry: Variants = {
  hidden:  { x: "100vw", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 18, duration: 1.2 } },
  exit:    { scale: 0.8, opacity: 0 },
};
```

---

## 6. Performance Rules

| Rule | What To Do |
|---|---|
| No 3D transforms | Use `translateX/Y`, `scale`, `opacity` only |
| No canvas/WebGL | Use CSS + SVG animations |
| Framer Motion lazy | Use `LazyMotion` + `domAnimation` feature bundle |
| Mobile first | All breakpoints start at 320px |
| Reduced motion | Wrap all animations in `useReducedMotion()` check |
| Memoization | `React.memo` for QuestionGrid, BattleTimer |
| No blocking renders | All question data fetched before `battle_start` triggers |

### Reduced Motion Guard
```tsx
import { useReducedMotion } from "framer-motion";

function SafeAnimate({ children, variants, ...props }: any) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? {} : variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

---

## 7. UI Layout

```
┌────────────────────────────────────────────────────────┐
│  OVERLAY LAYER (AnimatePresence — scene transitions)   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  CINEMATIC BACKGROUND (CSS gradient + SVG scene) │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │         CENTER: QUESTION UI                      │  │
│  │  ┌───────────────────────────────────────────┐   │  │
│  │  │ Subject Tag | Q 42 / 160                  │   │  │
│  │  │                                           │   │  │
│  │  │  Question text block                      │   │  │
│  │  │                                           │   │  │
│  │  │  (A) ○  (B) ○  (C) ○  (D) ○              │   │  │
│  │  │                                           │   │  │
│  │  │  [Clear] [Mark Review]  [Save & Next →]   │   │  │
│  │  └───────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  TOP BAR: [Logo]  [Timer: 02:47:33]  [Robo Icon]       │
│  BOTTOM:  Navigation grid (160 slots)                  │
│  TOP-RIGHT: Skip Intro button (during intro only)      │
└────────────────────────────────────────────────────────┘
```

---

## 8. Game Logic Rules

| Condition | Effect |
|---|---|
| User selects answer | `AnswerMap` updated; grid slot turns green |
| User marks for review | Grid slot turns amber |
| `remaining < 30 min` | Timer color → amber; background darkens |
| `remaining < 10 min` | Timer color → red; Robo shake animation loops |
| `remaining === 0` | Force `failure` state; block all input |
| All 160 answered | Show submit; on confirm → success screen |
| Tab switch detected (≥3) | Exam terminated (existing security logic) |
| Ego Mode trigger | At 3+ consecutive correct answers when `< 15 min` remaining |

---

## 9. Special Features

### Skip Intro
- Always rendered on top of the intro scenes.
- One click → `setScene("exam_mode")`.
- Hidden during `exam_mode`, `failure`, `ego_mode`.

### Replay Intro
- Battle Mode entry always resets scene to `intro_start`.
- No `localStorage` persistence of "seen" state.

### Ego Comeback Animation
- Triggered when: `remaining < 15*60` && streak of 3 consecutive correct answers.
- Plays a full-screen `ego_mode` scene (motivational animation).
- Auto-advances back to `exam_mode` after ~4 seconds.

```tsx
// Inside useExamEngine — streak tracking
const [streak, setStreak] = useState(0);

const answerAndCheck = (qId: number, idx: number, correct: number) => {
  answer(qId, idx);
  if (idx === correct) {
    setStreak((s) => s + 1);
    if (streak + 1 >= 3 && remaining < 15 * 60) {
      onEgoMode(); // callback from BattleSceneController
      setStreak(0);
    }
  } else {
    setStreak(0);
  }
};
```

---

## 10. File & Folder Structure

```
src/
├── app/
│   └── battle/
│       └── page.tsx                  ← Entry point; renders BattleSceneController
│
├── components/
│   └── battle/
│       ├── BattleSceneController.tsx ← Top-level scene router
│       ├── BattleTimer.tsx           ← Timer display + color logic
│       ├── QuestionGrid.tsx          ← 160-slot nav grid
│       ├── ExamEngine.tsx            ← Full exam UI
│       ├── FailureScreen.tsx         ← Game over UI
│       ├── EgoModeScreen.tsx         ← Ego comeback UI
│       └── scenes/
│           ├── IntroScene.tsx
│           ├── WalkingScene.tsx
│           ├── RoboEntry.tsx
│           └── BattleStart.tsx
│
├── hooks/
│   ├── useBattleIntro.ts             ← Scene state machine
│   ├── useBattleTimer.ts             ← rAF-based countdown
│   └── useExamEngine.ts              ← Answer/flag/nav logic
│
├── lib/
│   └── battleAnimations.ts           ← Shared Framer Motion variants
│
└── types/
    └── battle.ts                     ← BattleScene, Question, AnswerMap types
```

---

## 11. Verification Checklist

- [ ] Intro plays on every "Real Battle Mode" click
- [ ] Skip Intro jumps immediately to exam UI
- [ ] Timer counts down from 03:00:00 with no drift (rAF-based)
- [ ] Timer color shifts at 30 min and 10 min marks
- [ ] Robo shakes continuously when < 10 min remain
- [ ] At `00:00:00` → failure screen renders, all input blocked
- [ ] 160 questions display with subject tags
- [ ] Grid accurately reflects answered / flagged / current states
- [ ] Tab-switch security terminates exam after 3 violations
- [ ] Ego Mode animates after 3 correct in a row with < 15 min left
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Mobile layout tested at 320px width

---

## 12. Integration Notes

- **Data Source**: Load questions from `public/questions/` JSON or Supabase `questions` table.
- **Auth Guard**: Battle Mode page is protected — must be authenticated to access.
- **Existing Security**: Reuse `warningCount` + tab-blur detection from `887efc72` implementation.
- **Routing**: Navigate to `/battle` on click; `back` navigation during exam is blocked.
