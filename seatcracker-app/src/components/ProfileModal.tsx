"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserState } from "../lib/useUserState";
import { GLOBAL_PROMO_CODES } from "../lib/promoCodes";
import type { User } from "../lib/firebase";
import type { AccessState } from "../lib/access";
import PurchaseModal from "./PurchaseModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accuracy: number;
  pace: string;
  authUser?: User | null;
  access?: AccessState | null;
  onSignOut?: () => void;
}

export default function ProfileModal({ isOpen, onClose, accuracy, pace, authUser, access, onSignOut }: Props) {
  const { user, isLoaded, saveState, applyCode } = useUserState();

  // Local edit state
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [editingRank, setEditingRank] = useState(false);
  const [rankInput, setRankInput] = useState("");

  // Promo code state
  const [codeInput, setCodeInput] = useState("");
  const [codeFeedback, setCodeFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mounted, setMounted] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      const result = applyCode(codeInput);
      setCodeFeedback({ msg: result.message, ok: result.success });
      if (result.success) setCodeInput("");
      setCodeLoading(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCodeFeedback(null), 5000);
    }, 500); // Tiny simulated delay for polish
  };

  // ── Helpers ───────────────────────────────────────────────
  const pct = Math.min(100, Math.max(0, accuracy));
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (pct / 100) * circ;
  
  const parsedPace = parseFloat(pace) || 2.5;
  const bitsPerMin = (1 / parsedPace).toFixed(2);

  const typeColors: Record<string, string> = {
    discount: "#f59e0b",
    unlock: "#6366f1",
    resource: "#10b981",
    boost: "#ec4899",
    lifetime: "#8b5cf6",
  };

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
              <div style={{
                width: "60px", height: "60px", borderRadius: "50%",
                background: access?.status === "premium"
                  ? "linear-gradient(135deg, #f59e0b, #f97316)"
                  : "linear-gradient(135deg, #6366f1, #a855f7)",
                margin: "0 auto 12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(99,102,241,0.4)",
                boxShadow: "0 0 20px rgba(99,102,241,0.3)",
              }}>
                {authUser?.photoURL ? (
                  <img src={authUser.photoURL} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} alt="Avatar" />
                ) : (
                  <img src="/character-avatar.png" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} alt="Avatar" />
                )}
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

            {/* ── Score + XP ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              {/* Accuracy Circle */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                <svg width="80" height="80" viewBox="0 0 100 100" style={{ margin: "0 auto", display: "block" }}>
                  <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle cx="50" cy="50" r={r} fill="none" stroke="#6366f1" strokeWidth="8"
                    strokeDasharray={circ} strokeDashoffset={dashOffset}
                    strokeLinecap="round" transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
                  />
                  <text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800">{pct}%</text>
                </svg>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Accuracy</span>
              </div>

              {/* Bits/Min + Discount */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "12px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bits / Min</div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#ec4899", lineHeight: 1.1 }}>{bitsPerMin}</div>
                </div>
                {user.discount_percentage > 0 && (
                  <div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Discount</div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#f59e0b", lineHeight: 1.1 }}>{user.discount_percentage}% Off</div>
                  </div>
                )}
              </div>
            </div>

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

            {/* ── Promo Code Input ── */}
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

            {/* ── Sign Out ── */}
            {onSignOut && (
              <button
                onClick={() => { onClose(); onSignOut(); }}
                style={{
                  marginTop: "16px", width: "100%", padding: "11px",
                  background: "none", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "12px", color: "rgba(239,68,68,0.7)",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(239,68,68,0.7)"; }}
              >
                Sign Out
              </button>
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
