import Link from "next/link";
import GlobalHeader from "../../components/GlobalHeader";

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0a0a0f)" }}>
      <GlobalHeader />
      
      <main style={{ flex: 1, padding: "40px 20px", width: "100%", maxWidth: "800px", margin: "0 auto", color: "var(--text, #f8fafc)" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link href="/" style={{ color: "var(--accent, #a78bfa)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <span>←</span> Back to Home
          </Link>
        </div>
        
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "32px", letterSpacing: "-0.02em" }}>Terms & Conditions</h1>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", lineHeight: 1.7, color: "var(--text-muted, #cbd5e1)" }}>
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>1. Platform Usage Rules</h2>
            <p>Welcome to SeatCracker. By accessing our platform, you agree to comply with and be bound by these terms. SeatCracker provides educational simulation for entrance exams. Your use of this service must be lawful, respectful, and solely for personal preparation.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>2. No Misuse or Hacking</h2>
            <p>You agree not to attempt to breach security, tamper with servers, scrape data, or distribute material that interrupts or damages the platform. Any form of hacking, exploiting, or distributing our proprietary question banks will result in immediate termination of an account and possible legal action.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>3. Payment Terms</h2>
            <p>SeatCracker offers premium access requiring payment.</p>
            <ul style={{ paddingLeft: "24px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Pricing:</strong> Premium access unlocks the complete roadmap and Real Battle Mode for ₹149.</li>
              <li><strong>Refund Policy:</strong> Since digital access is granted instantly upon purchase, we operate a strict <strong>no refund</strong> policy except under explicit technical failures where the service is not rendered.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>4. Account Responsibility</h2>
            <p>You are solely responsible for maintaining the confidentiality of your account credentials. All activities that occur under your account are your responsibility. Account sharing is strictly prohibited.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>5. Service Availability Disclaimer</h2>
            <p>We strive for 99.9% uptime, but SeatCracker is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. We do not guarantee uninterrupted access and may briefly pause services for essential maintenance or final calibrations.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
