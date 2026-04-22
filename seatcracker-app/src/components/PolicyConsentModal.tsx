"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updatePolicyStatus } from "../lib/supabase";
import { useUserState } from "../lib/useUserState";

interface Props {
  uid: string;
  onAccept: () => void;
}

export default function PolicyConsentModal({ uid, onAccept }: Props) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setPoliciesAccepted } = useUserState();

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Check if user is within 5px of the bottom (more lenient)
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setHasScrolledToBottom(true);
    }
  };

  // Check if content is smaller than container on mount/resize
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight } = scrollRef.current;
        if (scrollHeight <= clientHeight) {
          setHasScrolledToBottom(true);
        }
      }
    };
    
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleSubmit = async () => {
    if (!isAccepted) return;
    setIsSubmitting(true);
    try {
      await updatePolicyStatus(uid, true);
      setPoliciesAccepted(true);
      onAccept();
    } catch (err) {
      console.error("Error updating policy status:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10002,
          background: "rgba(2, 6, 23, 0.85)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          style={{
            width: "100%",
            maxWidth: "600px",
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(167, 139, 250, 0.2)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(167, 139, 250, 0.1)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ 
              width: "56px", height: "56px", borderRadius: "50%", background: "rgba(167, 139, 250, 0.1)", 
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" 
            }}>
              <span style={{ fontSize: "24px" }}>🛡️</span>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
              Update to Our Policies
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Please review and accept our updated Terms and Privacy Policy to continue using SeatCracker.
            </p>
          </div>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              flex: 1,
              overflowY: "auto",
              background: "rgba(2, 6, 23, 0.4)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              marginBottom: "24px",
              fontSize: "14px",
              color: "#cbd5e1",
              lineHeight: 1.6,
            }}
          >
            <h3 style={{ color: "#fff", marginTop: 0 }}>1. Acceptance of Terms</h3>
            <p>By accessing and using SeatCracker ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, do not use the Platform. We reserve the right to modify these terms at any time.</p>
            
            <h3 style={{ color: "#fff" }}>2. Privacy & Data Collection</h3>
            <p>We take your privacy seriously. By using SeatCracker, you consent to the collection of certain personal data, including but not limited to your name, email address, and performance metrics (accuracy, timing, and topic mastery). This data is used solely to enhance your learning experience and provide personalized roadmap recommendations.</p>
            <p>We do not sell your personal data to third parties. All authentication is handled securely via Firebase, and your progress is stored in encrypted Supabase databases.</p>
            
            <h3 style={{ color: "#fff" }}>3. User Responsibilities</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to use the Platform only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the Platform.</p>
            <p>Redistribution of our curated question banks, mock tests, or proprietary training methodology is strictly prohibited and may result in immediate account termination without refund.</p>
            
            <h3 style={{ color: "#fff" }}>4. Free Education Access</h3>
            <p>All features on SeatCracker, including "Mock Tests," "Performance Analytics," and "AI Roadmaps," are currently provided for free as part of our mission to democratize quality education. No subscription fees or hidden charges are required for full access.</p>
            
            <h3 style={{ color: "#fff" }}>5. Intellectual Property</h3>
            <p>All content on SeatCracker, including questions, explanations, graphics, and code, is the property of SeatCracker or its licensors and is protected by intellectual property laws. You are granted a limited, non-exclusive license to use the content for personal, non-commercial exam preparation only.</p>
            
            <h3 style={{ color: "#fff" }}>6. Limitation of Liability</h3>
            <p>SeatCracker is provided "as is" without any warranties. While we strive for 100% accuracy in our exam simulations, we do not guarantee that using the Platform will lead to specific exam results. We are not liable for any indirect or consequential losses arising from your use of the Platform.</p>
            
            <h3 style={{ color: "#fff" }}>7. Termination</h3>
            <p>We reserve the right to suspend or terminate your access to the Platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.</p>

            <div style={{ height: "60px" }} /> {/* Spacer to ensure scroll interaction */}
            <p style={{ textAlign: "center", color: "#a78bfa", fontWeight: 700, marginBottom: "20px" }}>
              --- End of Document ---
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ 
              display: "flex", alignItems: "center", gap: "12px", cursor: hasScrolledToBottom ? "pointer" : "not-allowed",
              opacity: hasScrolledToBottom ? 1 : 0.5, transition: "0.2s"
            }}>
              <input 
                type="checkbox" 
                checked={isAccepted}
                disabled={!hasScrolledToBottom}
                onChange={(e) => setIsAccepted(e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "#a78bfa" }}
              />
              <span style={{ fontSize: "14px", color: "#f8fafc" }}>
                I have read and agree to the Terms & Privacy Policy
              </span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={!isAccepted || isSubmitting}
              style={{
                width: "100%",
                padding: "16px",
                background: isAccepted ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "rgba(255, 255, 255, 0.05)",
                color: isAccepted ? "#fff" : "#64748b",
                border: "none",
                borderRadius: "14px",
                fontWeight: 700,
                fontSize: "16px",
                cursor: isAccepted ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow: isAccepted ? "0 10px 20px -5px rgba(124, 58, 237, 0.4)" : "none",
              }}
            >
              {isSubmitting ? "Updating..." : "Accept & Continue"}
            </button>
            
            {!hasScrolledToBottom && (
              <p style={{ fontSize: "12px", color: "#f43f5e", textAlign: "center", marginTop: "4px", fontWeight: 600 }}>
                Please scroll to the bottom of the policies to enable acceptance.
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
