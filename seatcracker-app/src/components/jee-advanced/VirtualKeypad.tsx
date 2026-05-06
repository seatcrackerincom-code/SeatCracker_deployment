"use client";

import React, { useState, useEffect } from "react";
import styles from "./VirtualKeypad.module.css";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function VirtualKeypad({ value, onChange }: Props) {
  const [cursorPos, setCursorPos] = useState(value.length);

  useEffect(() => {
    setCursorPos(value.length);
  }, [value]);

  const handleChar = (char: string) => {
    const newVal = value + char;
    onChange(newVal);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange("");
  };

  const handleLeft = () => {
    // Simplified: just for UI appearance for now
  };

  const handleRight = () => {
    // Simplified
  };

  return (
    <div className={styles.keypad}>
      <div className={styles.inputWrap}>
        <div className={styles.display}>
          {value}
          <span style={{ borderLeft: "2px solid #3b82f6", height: "20px", marginLeft: "2px", animation: "blink 1s infinite" }} />
        </div>
      </div>

      <button className={`${styles.btn} ${styles.wideBtn}`} onClick={handleBackspace}>
        Backspace
      </button>

      <div className={styles.grid}>
        {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
          <button key={num} className={styles.btn} onClick={() => handleChar(String(num))}>
            {num}
          </button>
        ))}
        <button className={styles.btn} onClick={() => handleChar(".")}>.</button>
        <button className={styles.btn} onClick={() => handleChar("-")}>-</button>
      </div>

      <div className={styles.navRow}>
        <button className={styles.btn} onClick={handleLeft}>←</button>
        <button className={styles.btn} onClick={handleRight}>→</button>
      </div>

      <button className={`${styles.btn} ${styles.wideBtn} ${styles.clearBtn}`} onClick={handleClear}>
        Clear All
      </button>

      <style jsx>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
