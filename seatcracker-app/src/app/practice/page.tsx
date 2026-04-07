import GlobalHeader from "../../components/GlobalHeader";
import Link from "next/link";

export const metadata = {
  title: "Topic-wise Practice - SeatCracker Competitive Exam Platform",
  description: "Master every topic with SeatCracker's topic-wise practice modules. Practice EAMCET, JEE, and NEET questions."
};

export default function PracticePage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0a0a0f)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, maxWidth: "1000px", margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "20px", color: "var(--accent, #a78bfa)" }}>
          Topic-Wise Practice
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto 48px", color: "var(--text-muted, #94a3b8)" }}>
          The best way to crack any exam is to master individual chapters. Our smart practice engine adapts to your needs.
        </p>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px", 
          marginBottom: "60px" 
        }}>
          {[
            { title: "Mathematics", desc: "Algebra, Calculus, Vectors, and more." },
            { title: "Physics", desc: "Mechanics, Optics, Thermodynamics." },
            { title: "Chemistry", desc: "Organic, Inorganic, Physical Chemistry." },
            { title: "Biology", desc: "Botany, Zoology, Microbiology." }
          ].map((subj, idx) => (
            <div key={idx} style={{ 
              padding: "32px", 
              background: "rgba(255,255,255,0.03)", 
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.05)",
              textAlign: "left"
            }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "12px", color: "var(--text, #f8fafc)" }}>
                {subj.title}
              </h3>
              <p style={{ color: "var(--text-muted, #64748b)" }}>{subj.desc}</p>
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
          Start Practicing Now
        </Link>
      </div>
    </main>
  );
}
