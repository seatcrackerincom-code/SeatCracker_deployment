"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { calcFinalPrice, BASE_COURSE_PRICE } from "../lib/access";
import { useUserState } from "../lib/useUserState";

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  discountPercentage: number;
}

export default function PurchaseModal({ isOpen, onClose, userId, discountPercentage }: Props) {
  const [payLoading, setPayLoading] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  
  const { user, applyCode } = useUserState();

  if (!isOpen || typeof document === "undefined") return null;

  // Use the local user state's discount so the UI updates instantly when applying code!
  const currentDiscount = Math.max(discountPercentage, user?.discount_percentage || 0);

  const finalPrice = calcFinalPrice(currentDiscount);
  const discountAmount = BASE_COURSE_PRICE - finalPrice;

  useEffect(() => {
    if (!isOpen) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isOpen]);

  const handlePayment = async () => {
    setPayLoading(true);
    try {
      // 1. Create order on server
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalPrice, userId: userId || "guest" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const { orderId, key, amount, currency } = await res.json();

      // 2. Open Razorpay modal
      const rzp = new window.Razorpay({
        key,
        amount,
        currency,
        name: "SeatCracker",
        description: "EAMCET Full Access",
        order_id: orderId,
        handler: async (response: Record<string, string>) => {
          // 3. Verify on server
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, userId: userId || "guest" }),
            });
            const verifyResult = await verifyRes.json();
            if (verifyResult.success) {
              alert("Payment successful! Welcome to SeatCracker Premium 🎉");
              window.location.reload();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (e) {
            alert("Verification error occurred.");
          }
        },
        prefill: { name: "SeatCracker Student" },
        theme: { color: "#8b5cf6" },
      });
      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      alert(err.message || "Payment setup failed. Please check your connection.");
    } finally {
      setPayLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 99999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "rgba(28, 20, 8, 0.95)",
            border: "1px solid rgba(251, 191, 36, 0.2)",
            borderRadius: "24px",
            padding: "32px",
            width: "90%",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 32px 64px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(245, 158, 11, 0.3)",
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
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          <div style={{ fontSize: "56px", marginBottom: "16px", filter: "drop-shadow(0 0 20px rgba(251,191,36,0.5))" }}>👑</div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#fbbf24", marginBottom: "8px" }}>
            Unlock Full Access
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "24px", lineHeight: "1.5" }}>
            Get lifetime access to the AI Roadmap, unlimited EAMCET practice tests, and detailed analytics.
          </p>

          <div style={{ 
            background: "rgba(0,0,0,0.3)", 
            borderRadius: "16px", 
            padding: "20px", 
            marginBottom: "24px",
            border: discountPercentage > 0 ? "1px dashed rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.05)"
          }}>
            {discountPercentage > 0 ? (
              <>
                <div style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.4)", fontSize: "18px", marginBottom: "4px" }}>
                  ₹{BASE_COURSE_PRICE}
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ fontSize: "20px", color: "#fff" }}>₹</span>
                  <span style={{ fontSize: "42px", fontWeight: "900", color: "#fff", lineHeight: 1 }}>{finalPrice}</span>
                </div>
                <div style={{ 
                  marginTop: "12px", 
                  color: "#34d399", 
                  fontSize: "13px", 
                  fontWeight: "700",
                  background: "rgba(16,185,129,0.1)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  display: "inline-block"
                }}>
                  🎉 You got {discountPercentage}% discount! (Save ₹{discountAmount})
                </div>
              </>
            ) : (
              <>
                <div style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.4)", fontSize: "18px", marginBottom: "4px" }}>
                  ₹{BASE_COURSE_PRICE === 199 ? 299 : BASE_COURSE_PRICE + 100}
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ fontSize: "20px", color: "#fff" }}>₹</span>
                  <span style={{ fontSize: "42px", fontWeight: "900", color: "#fff", lineHeight: 1 }}>{BASE_COURSE_PRICE}</span>
                </div>
                <div style={{ 
                  marginTop: "12px", 
                  color: "#f59e0b", 
                  fontSize: "13px", 
                  fontWeight: "700",
                  background: "rgba(245,158,11,0.1)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  display: "inline-block"
                }}>
                  🎓 Special Student Offer!
                </div>
              </>
            )}
          </div>

          {/* Promo Code Input on Payment Screen */}
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Got a promo code?"
                value={promoInput}
                onChange={e => setPromoInput(e.target.value.toUpperCase())}
                onKeyDown={e => {
                  if (e.key === "Enter" && promoInput.trim()) {
                    const res = applyCode(promoInput);
                    setPromoFeedback({ msg: res.message, ok: res.success });
                    if (res.success) setPromoInput("");
                    setTimeout(() => setPromoFeedback(null), 5000);
                  }
                }}
                style={{
                  flex: 1, padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  borderRadius: "10px", color: "#fff",
                  fontSize: "13px", fontWeight: "600", outline: "none",
                }}
              />
              <button
                disabled={!promoInput.trim()}
                onClick={() => {
                  if (promoInput.trim()) {
                    const res = applyCode(promoInput);
                    setPromoFeedback({ msg: res.message, ok: res.success });
                    if (res.success) setPromoInput("");
                    setTimeout(() => setPromoFeedback(null), 5000);
                  }
                }}
                style={{
                  padding: "10px 16px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  border: "none", borderRadius: "10px",
                  color: "#fff", fontWeight: "700", fontSize: "12px",
                  cursor: "pointer", opacity: !promoInput.trim() ? 0.5 : 1,
                }}
              >
                Apply
              </button>
            </div>
            {promoFeedback && (
              <div style={{
                marginTop: "8px", fontSize: "12px", fontWeight: "600",
                color: promoFeedback.ok ? "#34d399" : "#f87171",
              }}>
                {promoFeedback.msg}
              </div>
            )}
          </div>

          <button
            onClick={handlePayment}
            disabled={payLoading}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "800",
              cursor: payLoading ? "not-allowed" : "pointer",
              boxShadow: "0 8px 20px -8px rgba(245, 158, 11, 0.7)",
              transition: "transform 0.1s, box-shadow 0.1s",
              opacity: payLoading ? 0.7 : 1,
              letterSpacing: "0.05em",
            }}
            onMouseDown={e => { if (!payLoading) e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseLeave={e => { if (!payLoading) e.currentTarget.style.transform = "scale(1)"; }}
            onMouseUp={e => { if (!payLoading) e.currentTarget.style.transform = "scale(1)"; }}
          >
            {payLoading ? "Processing..." : `Pay ₹${finalPrice}`}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
