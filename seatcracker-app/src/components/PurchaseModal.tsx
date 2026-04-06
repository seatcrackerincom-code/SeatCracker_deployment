"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { calcFinalPrice, BASE_COURSE_PRICE } from "../lib/access";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  discountPercentage: number;
}

export default function PurchaseModal({ isOpen, onClose, userId, discountPercentage }: Props) {
  const [payLoading, setPayLoading] = useState(false);

  if (!isOpen || typeof document === "undefined") return null;

  const finalPrice = calcFinalPrice(discountPercentage);
  const discountAmount = BASE_COURSE_PRICE - finalPrice;

  const handlePayment = async () => {
    setPayLoading(true);
    // Pause Razorpay actual integration as requested
    setTimeout(() => {
      alert(`Razorpay Integration Paused!\n\nThis would normally launch the payment gateway for ₹${finalPrice}.`);
      setPayLoading(false);
      onClose(); // Auto-close just for now
    }, 1500);
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
            background: "rgba(12, 8, 32, 0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "32px",
            width: "90%",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 32px 64px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.2)",
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

          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "8px" }}>
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

          <button
            onClick={handlePayment}
            disabled={payLoading}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: payLoading ? "not-allowed" : "pointer",
              boxShadow: "0 8px 20px -8px rgba(99,102,241,0.6)",
              transition: "transform 0.1s, box-shadow 0.1s",
              opacity: payLoading ? 0.7 : 1,
            }}
            onMouseDown={e => { if (!payLoading) e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseUp={e => { if (!payLoading) e.currentTarget.style.transform = "scale(1)"; }}
            onMouseLeave={e => { if (!payLoading) e.currentTarget.style.transform = "scale(1)"; }}
          >
            {payLoading ? "Processing..." : `Pay ₹${finalPrice}`}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
