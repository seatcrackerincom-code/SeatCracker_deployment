"use client";
import { useState, useEffect } from "react";
import { useAdminContext } from "../../../components/admin/AdminAuthProvider";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const { login, isAdmin, isLoading } = useAdminContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { success, error: loginError } = await login(email, password);
    
    if (success) {
      router.push("/admin");
    } else {
      setError(loginError || "Access denied");
      setLoading(false);
    }
  };

  if (isLoading && !loading) {
    return (
      <div className="admin-login-wrap">
        <div style={{ color: "#94a3b8", fontStyle: "italic" }}>Synchronizing Admin Workspace...</div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrap">
      {/* Background for login page specifically since Shell might not be wrapping it fully or we want more stars here */}
      <div className="aurora-wrapper" style={{ zIndex: -1 }}>
        <div className="aurora-mesh"></div>
        <div className="starfield">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i} 
              className="star" 
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                animationDelay: `${Math.random() * 5}s`,
                background: i % 4 === 0 ? 'var(--accent-light)' : '#fff'
              }}
            />
          ))}
        </div>
      </div>

      <div className="admin-login-card">
        <button 
          onClick={() => window.location.href = "/"}
          style={{ position: "absolute", top: "24px", right: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", width: "40px", height: "40px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", transition: "all 0.2s" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          title="Exit Admin"
        >
          ×
        </button>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔒</div>
          <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Admin Portal</h1>
          <p style={{ color: "#94a3b8", fontSize: "16px", margin: 0 }}>Secure access to SeatCracker Hub</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", marginLeft: "4px" }}>ADMIN EMAIL</label>
            <input
              type="email"
              placeholder="admin@seatcracker.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", marginLeft: "4px" }}>SECRET PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              required
            />
          </div>
          
          {error && (
            <div style={{ 
              padding: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", 
              borderRadius: "12px", color: "#ef4444", fontSize: "14px", textAlign: "center" 
            }}>
              {error}
            </div>
          )}
          
          <button type="submit" className="admin-btn" disabled={loading} style={{ marginTop: "8px" }}>
            {loading ? "Verifying Credentials..." : "Access Dashboard"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
            Internal Use Only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
