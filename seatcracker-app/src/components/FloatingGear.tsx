"use client";

import { useState, useEffect } from "react";
import styles from "./FloatingGear.module.css";
import ThemeToggle from "./ThemeToggle";
import ProfileModal from "./ProfileModal";
import type { User } from "../lib/firebase";
import type { AccessState } from "../lib/access";

interface Props {
  onHome: () => void;
  onLogout: () => void;
  authUser: User | null;
  access: AccessState | null;
}

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function FloatingGear({ onHome, onLogout, authUser, access }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const pos = "top-left";

  return (
    <>
      <div className={`${styles.wrapper} ${styles[pos]}`}>
        {/* Note: Original backdrop removed as we use full screen takeover now */}
        
        {/* The Gear Button */}
        <button 
          className={`${styles.gearBtn} ${isOpen ? styles.gearOpen : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          title="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Full Page Settings Overlay */}
        {isOpen && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            {/* Background Accent */}
            <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
                pointerEvents: "none"
            }} />
            
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "38px",
                left: "32px",
                background: "transparent",
                border: "none",
                color: "var(--text)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: 600,
                zIndex: 10000,
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text)"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            <button 
              onClick={() => setIsOpen(false)}
              title="Close Settings"
              style={{
                position: "absolute",
                top: "32px",
                right: "32px",
                width: "50px",
                height: "50px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                color: "var(--text)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                zIndex: 10000
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1) rotate(90deg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1) rotate(0deg)"; }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h1 style={{ 
              fontSize: "3.5rem", 
              fontWeight: 800, 
              marginBottom: "48px", 
              color: "var(--text)",
              letterSpacing: "-0.02em"
            }}>
              Settings
            </h1>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              width: "100%",
              maxWidth: "460px",
              padding: "0 24px",
              zIndex: 10
            }}>
              <button 
                onClick={() => { setIsOpen(false); onHome(); }}
                style={{
                  padding: "24px 32px",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  color: "var(--text)",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.08)"; }}
              >
                <span style={{ fontSize: "1.8rem" }}>🏠</span> Home
              </button>

              <button 
                onClick={() => { setIsOpen(false); setShowProfile(true); }}
                style={{
                  padding: "24px 32px",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  color: "var(--text)",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.08)"; }}
              >
                <span style={{ fontSize: "1.8rem" }}>👤</span> Profile Account
              </button>

              <button 
                onClick={() => { setIsOpen(false); onLogout(); }}
                style={{
                  padding: "24px 32px",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: "20px",
                  color: "#ef4444",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 10px 40px rgba(239, 68, 68, 0.1)"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"; }}
              >
                <span style={{ fontSize: "1.8rem" }}>🚪</span> Sign Out
              </button>

              <div style={{
                  padding: "24px 32px",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", fontWeight: 700, fontSize: "1.3rem" }}>
                  <span style={{ fontSize: "1.8rem" }}>🎨</span> Theme Appearance
                </div>
                <div style={{ transform: "scale(1.2)", transformOrigin: "right" }}>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
        authUser={authUser}
        access={access}
        onSignOut={onLogout}
      />
    </>
  );
}
