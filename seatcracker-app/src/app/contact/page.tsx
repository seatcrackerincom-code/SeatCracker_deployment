import GlobalHeader from "../../components/GlobalHeader";
import Link from "next/link";

export const metadata = {
  title: "Contact SeatCracker - We're Here to Help",
  description: "Get in touch with the SeatCracker team for support, feedback, and collaboration opportunities."
};

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{
          maxWidth: "500px",
          width: "100%",
          padding: "40px",
          background: "var(--bg-card)",
          backdropFilter: "var(--glass-blur)",
          borderRadius: "24px",
          border: "1px solid var(--border)",
          textAlign: "center",
          boxShadow: "var(--shadow)"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>💬</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "16px", background: "linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "32px" }}>
            Have questions or need updates? We'd love to hear from you.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
            <div style={{ padding: "20px", background: "var(--bg-card2)", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Website & Updates</div>
              <a href="https://seatcracker.com.in" target="_blank" rel="noopener noreferrer" style={{ fontSize: "18px", color: "var(--text)", textDecoration: "none", fontWeight: 600 }}>
                seatcracker.com.in ↗
              </a>
            </div>

            <div style={{ padding: "20px", background: "var(--bg-card2)", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "12px", color: "var(--accent2)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Email Support</div>
              <a href="mailto:seatcracker.in.com@gmail.com" style={{ fontSize: "18px", color: "var(--text)", textDecoration: "none", fontWeight: 600 }}>
                seatcracker.in.com@gmail.com ↗
              </a>
            </div>

            <div style={{ padding: "20px", background: "var(--bg-card2)", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "12px", color: "#ec4899", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Follow Us</div>
              <a href="https://instagram.com/seatcracker.com.in" target="_blank" rel="noopener noreferrer" style={{ fontSize: "16px", color: "var(--text)", textDecoration: "none", fontWeight: 600, display: "block", lineHeight: 1.4 }}>
                For updates please visit our Instagram page seatcracker.com.in ↗
              </a>
            </div>
          </div>

          <div style={{ marginTop: "32px" }}>
            <Link href="/" style={{ color: "var(--accent)", fontSize: "14px", textDecoration: "none", fontWeight: 600 }}>
              ← Back to Practice
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
