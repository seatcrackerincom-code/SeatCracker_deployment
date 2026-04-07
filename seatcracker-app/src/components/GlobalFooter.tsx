"use client";

import Link from "next/link";
import { useState } from "react";

export default function GlobalFooter() {
  const [accepted, setAccepted] = useState(false);

  return (
    <footer style={{
      width: "100%",
      padding: "48px 20px",
      background: "var(--bg, #0a0a0f)",
      borderTop: "1px solid var(--border, rgba(255,255,255,0.05))",
      marginTop: "auto",
      textAlign: "center"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        alignItems: "center"
      }}>
        {/* The 4 Legal Links */}
        <div style={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: 600
        }}>
          <Link href="/about" style={{ color: "var(--text-muted, #94a3b8)", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--accent, #a78bfa)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-muted, #94a3b8)"}>
            About
          </Link>
          <Link href="/cookies" style={{ color: "var(--text-muted, #94a3b8)", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--accent, #a78bfa)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-muted, #94a3b8)"}>
            Cookies
          </Link>
          <Link href="/privacy-policy" style={{ color: "var(--text-muted, #94a3b8)", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--accent, #a78bfa)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-muted, #94a3b8)"}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ color: "var(--text-muted, #94a3b8)", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--accent, #a78bfa)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-muted, #94a3b8)"}>
            Terms & Conditions
          </Link>
        </div>

        {/* Legal Links (Already defined above) */}

        {/* Copyright (At the very bottom) */}
        <div style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.25)",
          marginTop: "16px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          letterSpacing: "0.05em",
          fontWeight: 500
        }}>
          <span>© 2026 seatcracker.com. All rights reserved.</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <Link href="/admin" style={{ color: "rgba(255,255,255,0.15)", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.color="rgba(255,255,255,0.5)"} onMouseLeave={(e) => e.currentTarget.style.color="rgba(255,255,255,0.15)"}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
