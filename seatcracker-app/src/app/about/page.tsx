import GlobalHeader from "../../components/GlobalHeader";

export const metadata = {
  title: "About SeatCracker - Dedicated Practice for Your Success",
  description: "Learn more about the mission of SeatCracker to help students prepare for competitive exams."
};

export default function AboutPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0a0a0f)" }}>
      <GlobalHeader />
      <div style={{ flex: 1, maxWidth: "800px", margin: "60px auto", padding: "0 20px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "24px", color: "var(--accent, #a78bfa)" }}>
          About SeatCracker
        </h1>
        <section style={{ lineHeight: 1.6, fontSize: "1.1rem", color: "var(--text, #f8fafc)" }}>
          <p style={{ marginBottom: "20px" }}>
            SeatCracker was founded with a single mission: to empower students in their journey to crack competitive entrance exams. 
            We recognized that while study materials are abundant, effective, targeted practice is often the missing piece of the puzzle.
          </p>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginTop: "40px", marginBottom: "16px" }}>Our Mission</h2>
          <p style={{ marginBottom: "20px" }}>
            Our platform provides a highly personalized practice experience, focusing on mastery of individual topics before moving on to full mock exams. 
            Whether you are preparing for <strong>EAMCET, JEE, NEET, or GATE</strong>, SeatCracker offers the tools you need to build speed and accuracy.
          </p>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginTop: "40px", marginBottom: "16px" }}>Why Choose SeatCracker?</h2>
          <ul>
            <li style={{ marginBottom: "12px" }}><strong>Smart Question Banks:</strong> Carefully curated, hard-difficulty questions that push you to learn.</li>
            <li style={{ marginBottom: "12px" }}><strong>Performance Tracking:</strong> Real-time feedback on your performance across subjects and chapters.</li>
            <li style={{ marginBottom: "12px" }}><strong>Roadmap Progression:</strong> Structured paths to ensure you cover your entire syllabus efficiently.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
