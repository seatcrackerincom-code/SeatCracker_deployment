"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SHARE_TITLE = "SeatCracker - Competitive Exam Practice Platform";
const SHARE_TEXT = "Master your competitive exams with SeatCracker! Practice mock tests, track performance, and crack EAMCET, JEE, NEET with ease. 🚀";
const SHARE_URL = "https://seatcracker.com";

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setIsOpen(!isOpen);
        }
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "📱",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(SHARE_TEXT + " " + SHARE_URL)}`,
      color: "#25D366"
    },
    {
      name: "Twitter (X)",
      icon: "🐦",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`,
      color: "#1DA1F2"
    },
    {
      name: "LinkedIn",
      icon: "💼",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
      color: "#0A66C2"
    },
    {
      name: "Facebook",
      icon: "👥",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`,
      color: "#1877F2"
    }
  ];

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        onClick={handleShare}
        aria-label="Share platform"
        style={{
          background: "var(--bg-card2)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{
              position: "absolute",
              top: "45px",
              right: "0",
              width: "220px",
              background: "var(--bg-card)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "12px",
              zIndex: 1001,
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}
          >
            <p style={{ 
              fontSize: "11px", 
              fontWeight: 700, 
              color: "var(--text-muted)", 
              textTransform: "uppercase", 
              letterSpacing: "0.05em",
              marginBottom: "8px",
              paddingLeft: "8px"
            }}>
              Share via
            </p>
            
            {shareOptions.map((opt) => (
              <a
                key={opt.name}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  color: "var(--text)",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = opt.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text)";
                }}
              >
                <span style={{ fontSize: "16px" }}>{opt.icon}</span>
                {opt.name}
              </a>
            ))}

            <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />

            <button
              onClick={copyLink}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                color: copied ? "var(--success)" : "var(--text)",
                background: copied ? "rgba(16, 185, 129, 0.1)" : "transparent",
                border: "none",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                if (!copied) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!copied) e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span>🔗</span>
                {copied ? "Copied!" : "Copy Link"}
              </div>
              {copied && <span style={{ fontSize: "10px" }}>✔️</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
