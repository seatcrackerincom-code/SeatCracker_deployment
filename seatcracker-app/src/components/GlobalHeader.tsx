"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import ProfileModal from "./ProfileModal";
import { onAuthChange, signOut, type User } from "../lib/firebase";
import { getAccessStateSync, type AccessState } from "../lib/access";

export default function GlobalHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [access, setAccess] = useState<AccessState | null>(null);

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setAuthUser(user);
      setAccess(getAccessStateSync());
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

  return (
    <header
      id="sc-global-header"
      style={{
        position: "fixed", top: "0", left: "0", right: "0", zIndex: 1000,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px",
        background: "rgba(2, 6, 23, 0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
          color: "#fff", textTransform: "lowercase", opacity: 0.9,
        }}>
          seatcracker.com
        </span>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {/* Right side empty as per request to remove theme/profile */}
      </div>
    </header>
  );
}
