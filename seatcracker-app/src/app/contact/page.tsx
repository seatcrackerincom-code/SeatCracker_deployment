import GlobalHeader from "../../components/GlobalHeader";

export const metadata = {
  title: "Contact SeatCracker - We're Here to Help",
  description: "Get in touch with the SeatCracker team for support, feedback, and collaboration opportunities."
};

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0a0a0f)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, maxWidth: "600px", margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "24px", color: "var(--accent, #a78bfa)" }}>
          Contact Us
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "40px", color: "var(--text-muted, #94a3b8)" }}>
          Have questions or need assistance? Reach out to our dedicated support team.
        </p>
        
        <div style={{ 
          padding: "32px", 
          background: "var(--card-bg, rgba(255,255,255,0.05))", 
          borderRadius: "16px",
          border: "1px solid var(--border, rgba(255,255,255,0.1))"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "12px" }}>Email Support</h2>
          <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent, #a78bfa)" }}>
            support@seatcracker.com
          </p>
          <p style={{ marginTop: "24px", fontSize: "0.9rem", color: "var(--text-muted, #94a3b8)" }}>
            We typically respond within 24-48 business hours.
          </p>
        </div>

        <div style={{ marginTop: "40px", fontSize: "1rem" }}>
          <h3>Corporate Address</h3>
          <p style={{ color: "var(--text-muted, #94a3b8)", marginTop: "8px" }}>
            SeatCracker.com - Smart Practice Systems<br />
            Techno Hub, Hyderabad, India
          </p>
        </div>
      </div>
    </main>
  );
}
