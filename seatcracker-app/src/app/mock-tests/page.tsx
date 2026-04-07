import GlobalHeader from "../../components/GlobalHeader";
import Link from "next/link";

export const metadata = {
  title: "Mock Test Platform - SeatCracker Competitive Exam Preparation",
  description: "Take high-quality mock tests for EAMCET, JEE, and NEET with immediate feedback and performance scores."
};

export default function MockTestsPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0a0a0f)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, maxWidth: "1000px", margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "20px", color: "var(--accent, #a78bfa)" }}>
          Mock Test Platform
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto 48px", color: "var(--text-muted, #94a3b8)" }}>
          Simulate the real exam experience with our curated mock tests. High-quality MCQs and a strict timer for the best prep.
        </p>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px", 
          marginBottom: "60px" 
        }}>
          {[
            { title: "Standard Mock Tests", desc: "Full-length 160 question tests for EAPCET/EAMCET." },
            { title: "Subject Wise Mocks", desc: "Focus specifically on Maths, Physics, or Biology." },
            { title: "JEE Level Mocks", desc: "Experience the intensity of National Level engineering tests." },
            { title: "NEET Simulation", desc: "Medical entrance mock tests with full Biology coverage." }
          ].map((item, idx) => (
            <div key={idx} style={{ 
              padding: "32px", 
              background: "rgba(255,255,255,0.03)", 
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.05)",
              textAlign: "left"
            }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "12px", color: "var(--text, #f8fafc)" }}>
                {item.title}
              </h3>
              <p style={{ color: "var(--text-muted, #64748b)" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <Link href="/" style={{ 
          display: "inline-block", 
          padding: "16px 32px", 
          background: "var(--accent, #a78bfa)", 
          color: "#fff", 
          borderRadius: "12px", 
          fontWeight: 700, 
          textDecoration: "none",
          fontSize: "1.1rem"
        }}>
          Take a Mock Test
        </Link>
      </div>
    </main>
  );
}
