"use client";

import { useState, useEffect } from "react";
import styles from "./FloatingGear.module.css";
import ThemeToggle from "./ThemeToggle";
import ProfileModal from "./ProfileModal";
import type { User } from "../lib/firebase";
import type { AccessState } from "../lib/access";

interface Props {
  onHome: () => void;
  authUser: User | null;
  access: AccessState | null;
}

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function FloatingGear({ onHome, authUser, access }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const pos = "top-right";

  return (
    <>
      <div className={`${styles.wrapper} ${styles[pos]}`}>
        {/* Backdrop to close menu */}
        {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
        
        {/* The Gear Button */}
        <button 
          className={`${styles.gearBtn} ${isOpen ? styles.gearOpen : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          title="Settings & Navigation"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2 2 2 0 0 1-2 2 2 2 0 0 0-2 2l-.31.31a2 2 0 0 0 0 2.83 2 2 0 0 1 0 2.83l.31.31a2 2 0 0 0 2.83 0 2 2 0 0 1 2.83 0l.31.31a2 2 0 0 0 2.83 0 2 2 0 0 1 2.83 0l.31-.31a2 2 0 0 0 0-2.83 2 2 0 0 1 0-2.83l-.31-.31a2 2 0 0 0-2-2 2 2 0 0 1-2-2 2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        {/* The Menu */}
        {isOpen && (
          <div className={`${styles.menu} ${styles["menu-" + pos]}`}>
            <button className={styles.menuItem} onClick={() => { setIsOpen(false); onHome(); }}>
              🏠 <span>Home</span>
            </button>
            <button className={styles.menuItem} onClick={() => { setIsOpen(false); setShowProfile(true); }}>
              👤 <span>Profile</span>
            </button>
            <div className={styles.menuItem}>
              🎨 <ThemeToggle />
            </div>
          </div>
        )}
      </div>

      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
        authUser={authUser}
        access={access}
        accuracy={0} // Default or fetched from state
        pace="2.5"   // Default
      />
    </>
  );
}
