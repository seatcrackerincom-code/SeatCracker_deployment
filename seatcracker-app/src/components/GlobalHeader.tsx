"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import ProfileModal from "./ProfileModal";
import Link from "next/link";
import ShareButton from "./ShareButton";
import { onAuthChange, signOut, type User } from "../lib/firebase";
import { getAccessStateSync, type AccessState } from "../lib/access";
import { useLivePresence } from "../lib/presence";

export default function GlobalHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [access, setAccess] = useState<AccessState | null>(null);
  const liveCount = useLivePresence();

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setAuthUser(user);
      setAccess(getAccessStateSync(user?.uid));
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("sc_guest_active");
    window.location.reload();
  };

  // Trial days left label for avatar badge
  const trialBadge =
    access?.status === "trial" && access.daysLeft <= 2
      ? `${access.daysLeft}d`
      : null;
  const isPremium = access?.status === "premium";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        id="sc-global-header"
        style={{
          position: "fixed", top: "0", left: "0", right: "0", zIndex: 20000,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 24px",
          background: "var(--glass-bg)",
          backdropFilter: "var(--glass-blur)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Hamburger Toggle (3 Lines) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: "none", border: "none", color: "var(--text)", cursor: "pointer",
              padding: "8px", display: "flex", flexDirection: "column", gap: "4px",
              marginRight: "8px"
            }}
            aria-label="Toggle Menu"
          >
            <div style={{ width: "24px", height: "2px", background: "var(--text)", borderRadius: "2px" }} />
            <div style={{ width: "24px", height: "2px", background: "var(--text)", borderRadius: "2px" }} />
            <div style={{ width: "24px", height: "2px", background: "var(--text)", borderRadius: "2px" }} />
          </button>

          <div 
            onClick={() => {
              if (window.location.pathname === "/") {
                window.dispatchEvent(new CustomEvent("sc_navigate", { detail: { step: 6 } }));
              } else {
                window.location.href = "/";
              }
            }}
            style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
          >
            {/* Glassmorphic Logo Ring */}
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.03)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(4px)", overflow: "hidden", padding: "4px",
              boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.2)",
            }}>
              <img src="/logo.png" style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="Logo" />
            </div>
            <span style={{
              fontSize: "16px", fontWeight: "700", letterSpacing: "0.05em",
              color: "var(--text)", textTransform: "lowercase", opacity: 0.9,
            }}>
              seatcracker.com
            </span>
          </div>

          {/* Live CCU Social Proof (Temporarily disabled until launch)
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "4px 10px", borderRadius: "100px",
            background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)",
            marginLeft: "8px", fontSize: "11px", fontWeight: 700, color: "#ef4444"
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444",
              boxShadow: "0 0 6px #ef4444", animation: "ping 2s infinite"
            }} />
            <span>{liveCount} Students Practicing</span>
          </div>
          */}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Right side empty: Logout moved to Sidebar */}
          <ShareButton />
          <ThemeToggle />
        </div>
      </header>

      {/* Slide-out Sidebar Menu */}
      {isMenuOpen && (
        <div 
          onClick={closeMenu}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)", zIndex: 1001, backdropFilter: "blur(4px)"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed", top: 0, left: 0, bottom: 0, width: "280px",
              background: "rgba(10, 10, 15, 0.95)", borderRight: "1px solid rgba(255,255,255,0.1)",
              padding: "80px 24px 24px", display: "flex", flexDirection: "column", gap: "12px",
              boxShadow: "20px 0 50px rgba(0,0,0,0.5)",
              overflowY: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch"
            }}
          >
            <h3 style={{ fontSize: "14px", color: "var(--text-muted, #64748b)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Menu</h3>
            
            <button 
              onClick={async () => {
                try {
                  const uid = authUser?.uid;
                  const pk = uid ? `sc_step_${uid}` : "sc_step";
                  localStorage.setItem(pk, "6");
                  localStorage.setItem("sc_step", "6");
                  
                  if (uid && uid !== "sc_user") {
                    await fetch("/api/admin/register-user", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: uid, last_step: 6 })
                    });
                  }
                } catch(e) {}
                
                if (window.location.pathname === "/") {
                  window.dispatchEvent(new CustomEvent("sc_navigate", { detail: { step: 6 } }));
                  setIsMenuOpen(false);
                } else {
                  window.location.href = "/";
                }
              }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                width: "100%", padding: "16px", borderRadius: "12px", color: "#fff",
                border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.03)",
                fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                textAlign: "left"
              }}
            >
              <span>🏠</span> Home
            </button>

            <button 
              onClick={() => { setProfileOpen(true); closeMenu(); }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "16px", borderRadius: "12px", color: "#fff",
                border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.03)",
                fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                textAlign: "left"
              }}
            >
              <span>👤</span> My Profile
            </button>

            <Link 
              href="/performance" 
              onClick={closeMenu}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "16px", borderRadius: "12px", color: "#fff",
                textDecoration: "none", fontSize: "16px", fontWeight: 600,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                transition: "all 0.2s"
              }}
            >
              <span>📊</span> Analytics
            </Link>

            <Link 
              href="/contact" 
              onClick={closeMenu}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "16px", borderRadius: "12px", color: "#fff",
                textDecoration: "none", fontSize: "16px", fontWeight: 600,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                transition: "all 0.2s"
              }}
            >
              <span>💬</span> Contact Us
            </Link>

            <button 
              onClick={() => { setProfileOpen(true); closeMenu(); }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "16px", borderRadius: "12px", color: "#fbbf24",
                border: "1px solid rgba(251,191,36,0.15)", background: "rgba(251,191,36,0.05)",
                fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                textAlign: "left", marginTop: "8px"
              }}
            >
              <span>🎁</span> Redeem Reward Code
            </button>

            {/* New Updates Section */}
            <div style={{ marginTop: "16px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", marginBottom: "12px" }}>
                Stay Connected
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <a href="https://seatcracker.com.in" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#a5b4fc", textDecoration: "none", fontWeight: 600 }}>
                  🌐 seatcracker.com.in
                </a>
                <a href="https://instagram.com/seat_cracker" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#f9a8d4", textDecoration: "none", fontWeight: 600 }}>
                  📸 Instagram ID
                </a>
              </div>
            </div>

            {/* User Membership & Status */}
            <div style={{ 
              marginTop: "auto", paddingTop: "24px",
              display: "flex", flexDirection: "column", gap: "12px" 
            }}>
              <div style={{
                padding: "16px", borderRadius: "12px",
                background: "rgba(56, 189, 248, 0.05)",
                border: "1px solid rgba(56, 189, 248, 0.15)",
                textAlign: "center"
              }}>
                <span style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Membership Status
                </span>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#38bdf8" }}>
                  Free Access 🚀
                </span>
              </div>

              {authUser ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{
                    padding: "10px 14px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                    fontSize: "13px", color: "var(--text-muted, #64748b)",
                    display: "flex", alignItems: "center", gap: "8px", overflow: "hidden"
                  }}>
                    <span>📧</span>
                    <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {authUser.email}
                    </span>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    style={{
                      width: "100%", padding: "14px", borderRadius: "12px",
                      background: "rgba(239, 68, 68, 0.1)", color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.2)", cursor: "pointer",
                      fontWeight: 700, fontSize: "14px"
                    }}
                  >
                    Logout Account
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: "12px", color: "var(--text-muted, #64748b)", textAlign: "center" }}>
                  Not signed in
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render Profile Modal */}
      <ProfileModal 
        isOpen={profileOpen} 
        onClose={() => setProfileOpen(false)} 
        authUser={authUser}
        access={access}
      />
    </>
  );
}
