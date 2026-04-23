import GlobalHeader from "../../components/GlobalHeader";
import Link from "next/link";

export const metadata = {
  title: "Contact SeatCracker - We're Here to Help",
  description: "Get in touch with the SeatCracker team for support, feedback, and collaboration opportunities."
};

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0a0a0f)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{
          maxWidth: "500px",
          width: "100%",
          padding: "40px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.08)",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>💬</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "16px", background: "linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted, #94a3b8)", lineHeight: 1.6, marginBottom: "32px" }}>
            Have questions or need updates? We'd love to hear from you.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
            <div style={{ padding: "20px", background: "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: "12px", color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Website & Updates</div>
              <a href="https://seatcracker.com.in" target="_blank" rel="noopener noreferrer" style={{ fontSize: "18px", color: "#fff", textDecoration: "none", fontWeight: 600 }}>
                seatcracker.com.in ↗
              </a>
            </div>

            <div style={{ padding: "20px", background: "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: "12px", color: "#ec4899", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Follow Us</div>
              <a href="https://instagram.com/seatcracker.com.in" target="_blank" rel="noopener noreferrer" style={{ fontSize: "18px", color: "#fff", textDecoration: "none", fontWeight: 600 }}>
                Instagram @seatcracker.com.in ↗
              </a>
            </div>
          </div>

          <div style={{ marginTop: "32px" }}>
            <Link href="/" style={{ color: "#a78bfa", fontSize: "14px", textDecoration: "none", fontWeight: 600 }}>
              ← Back to Practice
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
