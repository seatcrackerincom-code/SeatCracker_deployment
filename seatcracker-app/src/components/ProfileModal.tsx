"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserState } from "../lib/useUserState";
import { GLOBAL_PROMO_CODES } from "../lib/promoCodes";
import type { User } from "../lib/firebase";
import type { AccessState } from "../lib/access";
import PurchaseModal from "./PurchaseModal";

const AVATAR_LS_KEY = "sc_profile_avatar";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  authUser?: User | null;
  access?: AccessState | null;
  onSignOut?: () => void;
}

export default function ProfileModal({ isOpen, onClose, authUser, access, onSignOut }: Props) {
  const { user, isLoaded, saveState, applyCode } = useUserState();

  // Local edit state
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [editingRank, setEditingRank] = useState(false);
  const [rankInput, setRankInput] = useState("");

  // Profile image state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Promo code state
  const [codeInput, setCodeInput] = useState("");
  const [codeFeedback, setCodeFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mounted, setMounted] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved avatar from localStorage
    try {
      const saved = localStorage.getItem(AVATAR_LS_KEY);
      if (saved) setProfileImage(saved);
    } catch {}
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Resize to max 200x200 before storing to save space
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setProfileImage(dataUrl);
        try { localStorage.setItem(AVATAR_LS_KEY, dataUrl); } catch {}
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isLoaded || !mounted) return null;

  // ── Handlers ──────────────────────────────────────────────
  const startEditName = () => {
    setNameInput(user.name);
    setEditingName(true);
  };
  const saveName = () => {
    if (nameInput.trim()) saveState({ ...user, name: nameInput.trim() });
    setEditingName(false);
  };

  const startEditRank = () => {
    setRankInput(String(user.targetRank));
    setEditingRank(true);
  };
  const saveRank = () => {
    const n = parseInt(rankInput);
    if (!isNaN(n) && n > 0) saveState({ ...user, targetRank: n });
    setEditingRank(false);
  };

  const handleApplyCode = () => {
    if (!codeInput.trim()) return;
    setCodeLoading(true);
    setTimeout(() => {
      const result = applyCode(codeInput, true); // true = allow even if premium
      setCodeFeedback({ msg: result.message, ok: result.success });
      if (result.success) setCodeInput("");
      setCodeLoading(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCodeFeedback(null), 5000);
    }, 500);
  };

  // ── Helpers ───────────────────────────────────────────────
  const typeColors: Record<string, string> = {
    discount: "#f59e0b",
    unlock: "#6366f1",
    resource: "#10b981",
    boost: "#ec4899",
    lifetime: "#8b5cf6",
  };

  const avatarSrc = profileImage || authUser?.photoURL || "/character-avatar.png";

  // ── Render ────────────────────────────────────────────────
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(10px)",
              zIndex: 10000,
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.92, x: "-50%", y: "calc(-50% + 24px)" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.92, x: "-50%", y: "calc(-50% + 24px)" }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{
              position: "fixed", top: "50%", left: "50%",
              width: "92%", maxWidth: "520px",
              maxHeight: "90vh", overflowY: "auto",
              background: "rgba(12, 8, 32, 0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px", padding: "24px 20px",
              zIndex: 10001, backdropFilter: "blur(32px)",
              boxShadow: "0 32px 64px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px", color: "rgba(255,255,255,0.5)",
                cursor: "pointer", width: "32px", height: "32px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#ef4444"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>

            {/* ── Avatar + Name ── */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              {/* Avatar with upload overlay */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "96px", height: "96px", borderRadius: "50%",
                  margin: "0 auto 12px", position: "relative", cursor: "pointer",
                  border: access?.status === "premium"
                    ? "3px solid #f59e0b"
                    : "3px solid rgba(99,102,241,0.6)",
                  boxShadow: access?.status === "premium"
                    ? "0 0 24px rgba(245,158,11,0.4)"
                    : "0 0 24px rgba(99,102,241,0.35)",
                }}
              >
                <img
                  src={avatarSrc}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  alt="Avatar"
                />
                {/* Hover overlay */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "rgba(0,0,0,0.55)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <span style={{ fontSize: "10px", color: "#fff", marginTop: "2px", fontWeight: 700 }}>Upload</span>
                </div>
              </div>

              {editingName ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && saveName()}
                    style={{
                      background: "rgba(255,255,255,0.07)", border: "1px solid rgba(99,102,241,0.4)",
                      borderRadius: "10px", padding: "8px 14px", color: "#fff",
                      outline: "none", fontSize: "16px", textAlign: "center",
                    }}
                  />
                  <button onClick={saveName} style={{ background: "#6366f1", border: "none", borderRadius: "8px", padding: "8px 14px", color: "#fff", cursor: "pointer", fontWeight: "700", fontSize: "12px" }}>Save</button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: 0 }}>
                    {authUser?.displayName ?? authUser?.phoneNumber ?? user.name}
                  </h2>
                  <button onClick={startEditName} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", padding: "2px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "4px" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>🎯 Target Rank:</span>
                {editingRank ? (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      autoFocus
                      type="number"
                      value={rankInput}
                      onChange={e => setRankInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && saveRank()}
                      style={{ width: "90px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: "8px", padding: "4px 10px", color: "#fff", outline: "none", fontSize: "13px" }}
                    />
                    <button onClick={saveRank} style={{ background: "#6366f1", border: "none", borderRadius: "6px", padding: "4px 10px", color: "#fff", cursor: "pointer", fontSize: "11px", fontWeight: "700" }}>OK</button>
                  </div>
                ) : (
                  <button onClick={startEditRank} style={{ background: "rgba(99,102,241,0.15)", border: "none", borderRadius: "6px", padding: "3px 10px", color: "#a5b4fc", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                    #{user.targetRank.toLocaleString()}
                  </button>
                )}
              </div>
            </div>

            {/* ── Discount badge (if any) ── */}
            {user.discount_percentage > 0 && (
              <div style={{
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "12px", padding: "10px 14px", textAlign: "center", marginBottom: "16px"
              }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#fbbf24" }}>
                  🏷️ {user.discount_percentage}% Discount Active
                </span>
              </div>
            )}

            {/* ── Overall Progress ── */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "14px", padding: "14px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>Overall Progress</span>
                <span style={{ color: "#fff", fontWeight: "700" }}>{user.progressPercent}%</span>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${user.progressPercent}%` }}
                  transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                  style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #a855f7)", borderRadius: "999px" }}
                />
              </div>
            </div>

            {/* ── Promo Code Input (always visible) ── */}
            <div style={{ background: "rgba(99,102,241,0.06)", borderRadius: "14px", padding: "14px", border: "1px solid rgba(99,102,241,0.15)", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#a5b4fc", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Redeem Promo Code
                </h3>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="e.g. SAVE10, MOCKBOOST…"
                    value={codeInput}
                    onChange={e => setCodeInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && handleApplyCode()}
                    style={{
                      flex: 1, padding: "10px 12px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(99,102,241,0.25)",
                      borderRadius: "10px", color: "#fff",
                      fontSize: "13px", fontWeight: "600", outline: "none",
                      letterSpacing: "0.08em",
                    }}
                  />
                  <button
                    onClick={handleApplyCode}
                    disabled={codeLoading || !codeInput.trim()}
                    style={{
                      padding: "10px 16px",
                      background: "linear-gradient(135deg, #6366f1, #a855f7)",
                      border: "none", borderRadius: "10px",
                      color: "#fff", fontWeight: "700", fontSize: "12px",
                      cursor: "pointer", whiteSpace: "nowrap",
                      opacity: codeLoading || !codeInput.trim() ? 0.5 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    {codeLoading ? "…" : "Apply"}
                  </button>
                </div>

                <AnimatePresence>
                  {codeFeedback && (
                    <motion.p
                      key="feedback"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      style={{
                        marginTop: "12px", fontSize: "13px", fontWeight: "600",
                        color: codeFeedback.ok ? "#34d399" : "#f87171",
                        padding: "10px 14px",
                        background: codeFeedback.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                        border: `1px solid ${codeFeedback.ok ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                        borderRadius: "10px",
                      }}
                    >
                      {codeFeedback.msg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

            {/* ── Active Codes ── */}
            {user.applied_codes.length > 0 && (
              <div>
                <h4 style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                  Active Perks
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {user.applied_codes.map(c => {
                    const promoData = GLOBAL_PROMO_CODES[c];
                    const color = promoData ? { 
                      discount: "#f59e0b", 
                      unlock: "#6366f1", 
                      resource: "#10b981", 
                      boost: "#ec4899",
                      lifetime: "#8b5cf6"
                    }[promoData.type] : "#6b7280";
                    return (
                      <span
                        key={c}
                        title={promoData?.description}
                        style={{
                          padding: "4px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700",
                          background: `${color}15`, border: `1px solid ${color}40`, color,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {c}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Access Status ── */}
            {access && (
              <div style={{ marginTop: "16px" }}>
                {access.status === "premium" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "12px", fontSize: "12px", fontWeight: "700", color: "#fbbf24" }}>
                    Premium Member — Lifetime Access
                  </div>
                )}
                {access.status === "trial" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", fontSize: "12px", fontWeight: "700", color: "#a5b4fc" }}>
                    Free Trial — {access.daysLeft} day{access.daysLeft !== 1 ? "s" : ""} left
                  </div>
                )}
                {access.status === "expired" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", fontSize: "12px", fontWeight: "700", color: "#f87171" }}>
                    ⏰ Trial Expired — Upgrade to continue
                  </div>
                )}
                
                {access.status !== "premium" && (
                  <button
                    onClick={() => setShowPurchase(true)}
                    style={{
                      width: "100%", marginTop: "12px", padding: "12px",
                      background: "linear-gradient(135deg, #f59e0b, #f97316)",
                      border: "none", borderRadius: "12px", color: "#fff",
                      fontSize: "14px", fontWeight: "800", cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
                      transition: "transform 0.1s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(0.98)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    Purchase Course
                  </button>
                )}
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      <PurchaseModal 
        isOpen={showPurchase} 
        onClose={() => setShowPurchase(false)} 
        userId={authUser?.uid} 
        discountPercentage={user.discount_percentage} 
      />
    </>
  );
}
