"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface PaywallGateProps {
  userId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaywallGate({ userId, onSuccess, onClose }: PaywallGateProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Create Order
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const order = await res.json();

      if (order.error) {
        throw new Error(order.error);
      }

      // 2. Load Razorpay script dynamically if needed, or assume it's in standard layout
      const rzp = new (window as any).Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "SeatCracker",
        description: "JEE Advanced Analysis Unlock",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId,
            }),
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            onSuccess();
          } else {
            setError("Payment verification failed. Contact support.");
            setLoading(false);
          }
        },
        prefill: {
          name: "SeatCracker Student",
        },
        theme: {
          color: "#a78bfa"
        }
      });

      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description);
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
      fontFamily: "Inter, sans-serif"
    }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: "#0f172a", border: "1px solid rgba(167, 139, 250, 0.3)",
          borderRadius: "24px", padding: "40px", maxWidth: "450px", width: "90%",
          textAlign: "center", position: "relative",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
        }}
      >
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#64748b", fontSize: "1.5rem", cursor: "pointer" }}
        >
          ×
        </button>

        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔒</div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f8fafc", marginBottom: "8px" }}>
          Analysis <span style={{ color: "#a78bfa" }}>Locked</span>
        </h2>
        <p style={{ color: "#94a3b8", lineHeight: 1.6, marginBottom: "24px", fontSize: "1rem" }}>
          You've completed your free trial! Unlock highly accurate percentile estimation, AIR tracking, and detailed cutoff analysis for the rest of your prep.
        </p>

        <div style={{ background: "rgba(167, 139, 250, 0.1)", padding: "24px", borderRadius: "16px", border: "1px solid rgba(167, 139, 250, 0.2)", marginBottom: "32px" }}>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
            ₹3 <span style={{ fontSize: "1rem", color: "#a78bfa", fontWeight: 600 }}>One-Time (Test)</span>
          </div>
          <p style={{ color: "#cbd5e1", fontSize: "0.9rem", marginTop: "8px" }}>Full Access to JEE Advanced Mock Analysis</p>
        </div>

        {error && <div style={{ color: "#ef4444", marginBottom: "16px", fontSize: "0.9rem" }}>{error}</div>}

        <button 
          onClick={handlePayment}
          disabled={loading}
          style={{
            width: "100%", padding: "16px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
            color: "#fff", fontSize: "1.1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1, transition: "opacity 0.2s"
          }}
        >
          {loading ? "Processing..." : "Unlock Analysis Now"}
        </button>
      </motion.div>
    </div>
  );
}
