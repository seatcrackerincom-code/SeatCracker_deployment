import Link from "next/link";
import GlobalHeader from "../../components/GlobalHeader";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0a0a0f)" }}>
      <GlobalHeader />
      
      <main style={{ flex: 1, padding: "40px 20px", width: "100%", maxWidth: "800px", margin: "0 auto", color: "var(--text, #f8fafc)" }}>
        <div style={{ marginBottom: "20px" }}>
          <Link href="/" style={{ color: "var(--accent, #a78bfa)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <span>←</span> Back to Home
          </Link>
        </div>
        
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "32px", letterSpacing: "-0.02em" }}>Privacy Policy</h1>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", lineHeight: 1.7, color: "var(--text-muted, #cbd5e1)" }}>
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>1. What Data We Collect</h2>
            <p>To provide you with the best experience on SeatCracker, we collect the following minimal necessary information:</p>
            <ul style={{ paddingLeft: "24px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Name:</strong> To personalize your dashboard and experience.</li>
              <li><strong>Email Address:</strong> For account management, communications, and securing your progress.</li>
              <li><strong>Phone Number:</strong> Handled securely via Firebase during the authentication process.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>2. How We Use Your Data</h2>
            <p>Your data is exclusively used to operate the SeatCracker platform:</p>
            <ul style={{ paddingLeft: "24px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Authentication:</strong> Logging you securely into the platform across sessions.</li>
              <li><strong>Progress Tracking:</strong> Saving your mock test scores, topic mastery, and roadmap status so you never lose progress.</li>
              <li><strong>Personalization:</strong> Adapting study recommendations and timers based on your interaction.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>3. Third-Party Services</h2>
            <p>We rely on trusted, industry-standard third-party providers to process certain data securely:</p>
            <ul style={{ paddingLeft: "24px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Firebase Authentication:</strong> Manages secure sign-up, sign-in, and account security.</li>
              <li><strong>Razorpay:</strong> Handles all payment processing. We do not store your raw credit card or bank details on our servers at any point.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>4. Data Protection Statement</h2>
            <p>We take the security of your data seriously. Communications with our servers are encrypted, and we follow strict access control measures to prevent unauthorized access, disclosure, or alteration of your personal data.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text, #fff)", marginBottom: "12px" }}>5. Your Rights</h2>
            <p>You have full control over your personal data. You may request access to, correction of, or deletion of the data we hold about you at any time. For concerns or requests regarding your data, please contact our support team.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
