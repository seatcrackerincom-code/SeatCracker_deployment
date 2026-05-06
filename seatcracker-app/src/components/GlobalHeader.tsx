"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import ProfileModal from "./ProfileModal";
import Link from "next/link";
import ShareButton from "./ShareButton";
import { onAuthChange, signOut, type User } from "../lib/firebase";
import { getAccessStateSync, type AccessState } from "../lib/access";
import { useLivePresence } from "../lib/presence";
import { usePathname } from "next/navigation";
import PurchaseScreen from "./premium/PurchaseScreen";
import { getExamConfig } from "@/config/examConfig";

export default function GlobalHeader() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [access, setAccess] = useState<AccessState | null>(null);
  const [liveCount, setLiveCount] = useState<number>(0);
  const [showPurchase, setShowPurchase] = useState(false);

  // Pages where header should be hidden
  const hidePaths = [
    "/jee-advanced/mock-test",
    "/real-battle-mode", // Assuming EAMCET mock test route
  ];

  // We also want to hide it on the intro/exam select steps of the home page.
  // We can check if a data-attribute is set on the body or similar.
  const [hideForStep, setHideForStep] = useState(false);

  useEffect(() => {
    const checkStep = () => {
      const stepStr = localStorage.getItem("sc_step");
      const step = stepStr ? parseInt(stepStr) : -1;
      
      const jeePhase = localStorage.getItem("sc_jee_phase");
      const eamcetPhase = localStorage.getItem("sc_battle_phase");
      
      // 1. Hide ONLY on the very first intro/setup steps (1-4)
      const isIntro = pathname === "/" && (step >= 1 && step <= 4);

      // 2. Hide ONLY during the actual exam questions phase
      const isEamcetActiveExam = pathname === "/" && step >= 13;
      const isJeeActiveExam = pathname.includes("/jee-advanced/mock-test") && jeePhase === "exam";

      // 3. Hide on specific paths
      const isPathHidden = hidePaths.includes(pathname);

      setHideForStep(isIntro || isEamcetActiveExam || isJeeActiveExam || isPathHidden);
    };
    checkStep();
    window.addEventListener("sc_step_change", checkStep);
    window.addEventListener("sc_navigate", checkStep);
    // Listen for phase changes
    window.addEventListener("storage", checkStep);

    // ── Live Count Fetching ────────────────────────────────
    const fetchLiveCount = async () => {
      try {
        const path = window.location.pathname;
        let exam = "";
        if (path.includes("/jee-advanced")) exam = "JEE";
        else exam = "EAMCET";

        // Heartbeat: Register current user as active
        if (authUser?.uid && authUser.uid !== "sc_user") {
          fetch("/api/admin/register-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: authUser.uid, exam })
          }).catch(() => {});
        }

        const res = await fetch(`/api/stats/live-count?exam=${exam}`);
        const data = await res.json();
        setLiveCount(data.count || 0);
      } catch (e) {}
    };

    fetchLiveCount();
    const interval = setInterval(fetchLiveCount, 30000); // Update every 30s

    return () => {
      window.removeEventListener("sc_step_change", checkStep);
      window.removeEventListener("sc_navigate", checkStep);
      window.removeEventListener("storage", checkStep);
      clearInterval(interval);
    };
  }, [pathname, authUser]);

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

  if (hideForStep) return null;

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
          position: "fixed", top: "0", left: "0", right: "0", zIndex: 30000,
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
              const path = window.location.pathname;
              if (path.includes("/jee-advanced")) {
                window.location.href = "/jee-advanced";
              } else {
                // For EAMCET or other main paths
                if (path === "/") {
                  window.dispatchEvent(new CustomEvent("sc_navigate", { detail: { step: 6 } }));
                } else {
                  window.location.href = "/";
                }
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
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Live Student Count - Only visible on Admin pages */}
          {pathname?.startsWith("/admin") && (
            <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "4px 10px", borderRadius: "100px",
                background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.12)",
                fontSize: "12px", fontWeight: 700, color: "#ef4444",
                animation: "fadeIn 0.5s ease-out"
              }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444",
                  boxShadow: "0 0 6px #ef4444", animation: "ping 2s infinite"
                }} />
                <span>{liveCount} {pathname?.includes("/jee-advanced") ? "JEE" : "EAMCET"} Students Practicing</span>
              </div>
          )}

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
            background: "rgba(0,0,0,0.4)", zIndex: 40000, backdropFilter: "blur(4px)"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed", top: 0, left: 0, bottom: 0, width: "280px",
              background: "var(--glass-bg)", borderRight: "1px solid var(--border)",
              padding: "80px 24px 24px", display: "flex", flexDirection: "column", gap: "12px",
              boxShadow: "var(--shadow)",
              zIndex: 40001,
              overflowY: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              backdropFilter: "var(--glass-blur)"
            }}
          >
            <h3 style={{ fontSize: "14px", color: "var(--text-muted, #64748b)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
              {pathname?.includes("/jee-advanced") ? "JEE Advanced Menu" : "Main Menu"}
            </h3>
            
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
                
                const path = window.location.pathname;
                if (path.includes("/jee-advanced")) {
                  window.location.href = "/jee-advanced";
                } else {
                  if (path === "/") {
                    window.dispatchEvent(new CustomEvent("sc_navigate", { detail: { step: 6 } }));
                    setIsMenuOpen(false);
                  } else {
                    window.location.href = "/";
                  }
                }
              }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                width: "100%", padding: "16px", borderRadius: "12px", color: "var(--text)",
                border: "1px solid var(--border)", background: "var(--bg-card)",
                fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                textAlign: "left"
              }}
            >
              <span>🏠</span> {pathname?.includes("/jee-advanced") ? "JEE Advanced Hub" : "Home"}
            </button>

            <button 
              onClick={async () => {
                try {
                  const uid = authUser?.uid;
                  const pk = uid ? `sc_step_${uid}` : "sc_step";
                  localStorage.setItem(pk, "2");
                  localStorage.setItem("sc_step", "2");
                  
                  if (uid && uid !== "sc_user") {
                    await fetch("/api/admin/register-user", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: uid, last_step: 2 })
                    });
                  }
                } catch(e) {}
                
                if (window.location.pathname === "/") {
                  window.dispatchEvent(new CustomEvent("sc_navigate", { detail: { step: 2 } }));
                  setIsMenuOpen(false);
                } else {
                  window.location.href = "/";
                }
              }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                width: "100%", padding: "16px", borderRadius: "12px", color: "var(--text)",
                border: "1px solid var(--border)", background: "var(--bg-card)",
                fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                textAlign: "left"
              }}
            >
              <span>🎯</span> Choose Another Exam
            </button>

            <button 
              onClick={() => { setProfileOpen(true); closeMenu(); }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "16px", borderRadius: "12px", color: "var(--text)",
                border: "1px solid var(--border)", background: "var(--bg-card)",
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
                padding: "16px", borderRadius: "12px", color: "var(--text)",
                textDecoration: "none", fontSize: "16px", fontWeight: 600,
                background: "var(--bg-card)", border: "1px solid var(--border)",
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
                padding: "16px", borderRadius: "12px", color: "var(--text)",
                textDecoration: "none", fontSize: "16px", fontWeight: 600,
                background: "var(--bg-card)", border: "1px solid var(--border)",
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

            {!isPremium && (
              <div 
                onClick={() => setShowPurchase(true)}
                style={{
                  marginTop: "16px", padding: "16px", borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))",
                  border: "1px solid rgba(99,102,241,0.3)", cursor: "pointer",
                  transition: "all 0.2s", boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "20px" }}>👑</span>
                  <span style={{ fontWeight: 800, fontSize: "15px", color: "#fff" }}>Go Premium Pro</span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 12px", lineHeight: "1.4" }}>
                  Unlock 10 JEE Mocks, Rank Estimation, and detailed performance analytics.
                </p>
                <div style={{ 
                  background: "#6366f1", color: "#fff", padding: "8px", 
                  borderRadius: "8px", textAlign: "center", fontSize: "13px", fontWeight: 700 
                }}>
                  View Pricing
                </div>
              </div>
            )}



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

      {showPurchase && (
        <PurchaseScreen 
          config={getExamConfig(pathname?.includes("jee") ? "jee-advanced" : "eamcet")} 
          user={authUser} 
          onClose={() => setShowPurchase(false)} 
          onSuccess={() => {
            setShowPurchase(false);
            window.location.reload();
          }}
        />
      )}

      <div style={{ height: "75px" }} />
    </>
  );
}
