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
    <>
      <div
        id="sc-global-header"
        style={{
          position: "fixed", top: "16px", right: "16px", zIndex: 1000,
          display: "flex", gap: "12px", alignItems: "center",
          background: "rgba(10, 5, 25, 0.4)", backdropFilter: "blur(12px)",
          padding: "6px 12px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <ThemeToggle />

        {/* Avatar button with optional badge */}
        <div style={{ position: "relative" }}>
          <button
            id="sc-profile-btn"
            onClick={() => setProfileOpen(true)}
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: isPremium
                ? "linear-gradient(135deg, #f59e0b, #f97316)"
                : "linear-gradient(135deg, #6366f1, #a855f7)",
              padding: "2px", border: "none", cursor: "pointer",
              transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title={authUser?.displayName ?? (authUser?.phoneNumber ?? "Guest")}
          >
            {authUser?.photoURL ? (
              <img
                src={authUser.photoURL}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                alt="User"
              />
            ) : (
              <img
                src="/character-avatar.png"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                alt="User"
              />
            )}
          </button>

          {/* Days-left badge */}
          {trialBadge && (
            <div style={{
              position: "absolute", top: "-4px", right: "-4px",
              background: "#ef4444", color: "#fff",
              fontSize: "9px", fontWeight: "800",
              padding: "2px 5px", borderRadius: "999px",
              border: "1.5px solid rgba(10,5,25,0.8)",
              lineHeight: 1,
            }}>
              {trialBadge}
            </div>
          )}

          {/* Premium crown */}
          {isPremium && (
            <div style={{
              position: "absolute", top: "-6px", right: "-4px",
              fontSize: "14px", lineHeight: 1,
            }}>
              👑
            </div>
          )}
        </div>
      </div>

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        accuracy={90}
        pace="2.5"
        authUser={authUser}
        access={access}
        onSignOut={handleSignOut}
      />
    </>
  );
}
