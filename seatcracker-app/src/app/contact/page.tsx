import GlobalHeader from "../../components/GlobalHeader";

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
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🏗️</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px", background: "linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Currently Under Construction
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted, #94a3b8)", lineHeight: 1.6, margin: 0 }}>
            We're building something special just for you. Our contact systems will be live very soon. Stay tuned!
          </p>
          <div style={{ 
            marginTop: "32px", 
            height: "4px", 
            width: "100%", 
            background: "rgba(255,255,255,0.05)", 
            borderRadius: "2px", 
            overflow: "hidden" 
          }}>
            <div style={{ 
              height: "100%", 
              width: "60%", 
              background: "linear-gradient(90deg, #6366f1, #a78bfa)", 
              borderRadius: "2px",
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
              animation: "shimmer 2s infinite ease-in-out"
            }} />
          </div>
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
          `}</style>
        </div>
      </div>
    </main>
  );
}
