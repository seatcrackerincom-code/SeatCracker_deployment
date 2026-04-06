"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (status: "accepted" | "rejected") => {
    localStorage.setItem("cookie_consent", status);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "var(--card-bg, #1e293b)",
      border: "1px solid var(--border, rgba(255,255,255,0.1))",
      borderRadius: "16px",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
      zIndex: 9999,
      maxWidth: "90%",
      width: "400px",
      animation: "fadeInUp 0.4s ease"
    }}>
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
      }}>
        <span style={{ fontSize: "24px" }}>🍪</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text, #f8fafc)", lineHeight: 1.5, fontWeight: 500 }}>
            We use cookies to improve your experience, handle authentication, and keep track of your session.
          </p>
          <Link href="/cookies" style={{ fontSize: "12px", color: "var(--accent, #a78bfa)", textDecoration: "none", fontWeight: 600 }}>
            Read our Cookie Policy
          </Link>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "12px" }}>
        <button 
          onClick={() => handleConsent("rejected")}
          style={{
            flex: 1,
            padding: "10px",
            background: "transparent",
            border: "1px solid var(--border, rgba(255,255,255,0.2))",
            color: "var(--text-muted, #94a3b8)",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text, #fff)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted, #94a3b8)"}
        >
          Reject
        </button>
        <button 
          onClick={() => handleConsent("accepted")}
          style={{
            flex: 1,
            padding: "10px",
            background: "var(--accent, #6c63ff)",
            border: "none",
            color: "#fff",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 700,
            boxShadow: "0 4px 12px rgba(108, 99, 255, 0.3)",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
