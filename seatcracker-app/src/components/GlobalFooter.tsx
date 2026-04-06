"use client";

import Link from "next/link";

export default function GlobalFooter() {
  return (
    <footer style={{
      width: "100%",
      padding: "24px 20px",
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
        gap: "16px",
        alignItems: "center"
      }}>
        <div style={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: 600
        }}>
          <Link href="/" style={{ color: "var(--text-muted, #94a3b8)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--accent, #a78bfa)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-muted, #94a3b8)"}>
            ← Back to Home
          </Link>
          <Link href="/privacy-policy" style={{ color: "var(--text-muted, #94a3b8)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--accent, #a78bfa)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-muted, #94a3b8)"}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ color: "var(--text-muted, #94a3b8)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--accent, #a78bfa)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-muted, #94a3b8)"}>
            Terms & Conditions
          </Link>
          <Link href="/cookies" style={{ color: "var(--text-muted, #94a3b8)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--accent, #a78bfa)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-muted, #94a3b8)"}>
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
