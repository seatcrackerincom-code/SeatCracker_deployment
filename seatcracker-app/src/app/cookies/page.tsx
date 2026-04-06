import Link from "next/link";
import GlobalHeader from "../../components/GlobalHeader";

export default function CookiePolicyPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0a0a0f)" }}>
      <GlobalHeader />
      
      <main style={{ flex: 1, padding: "40px 20px", width: "100%", maxWidth: "800px", margin: "0 auto", color: "var(--text, #f8fafc)" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link href="/" style={{ color: "var(--accent, #a78bfa)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <span>←</span> Back to Home
          </Link>
        </div>
        
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "32px", letterSpacing: "-0.02em" }}>Cookie Policy</h1>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", lineHeight: 1.7, color: "var(--text-muted, #cbd5e1)" }}>
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>1. What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your actions, preferences, and login states to give you a smooth, seamless experience.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>2. What Cookies Are Used?</h2>
            <p>We use minimalistic, essential cookies. This includes:</p>
            <ul style={{ paddingLeft: "24px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Authentication Cookies:</strong> Required to keep you securely logged into your account.</li>
              <li><strong>Session Tracking Cookies:</strong> Used to temporarily store your progress during a mock exam or practice session so your data isn't lost if you refresh.</li>
              <li><strong>Analytics (Optional):</strong> Helps us understand platform traffic to optimize server performances dynamically.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>3. Purpose of Cookies</h2>
            <p>Our primary operational goal is performance and reliability. Cookies ensure you do not have to re-enter your login information repeatedly, and they provide crash-safe states for long EAMCET exam sessions.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>4. User Control Over Cookies</h2>
            <p>You can manage, reject, or delete cookies at any time via our Cookie Consent banner or directly through your browser settings. Please note that blocking essential authentication cookies will prevent you from accessing premium features and tracking your progress across the platform.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
