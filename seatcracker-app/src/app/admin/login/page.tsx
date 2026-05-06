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

    const { success, error: loginError } = await login(password);
    
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
        <div style={{ color: "#94a3b8" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card" style={{ position: "relative" }}>
        <button 
          onClick={() => window.location.href = "/"}
          style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", transition: "all 0.2s" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          title="Exit Admin"
        >
          ×
        </button>
        <div style={{ textAlign: "center", fontSize: "48px", marginBottom: "-16px" }}>🔐</div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: 700, margin: "0 0 8px" }}>Admin Portal</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Sign in with your admin account</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <input
              type="password"
              placeholder="Admin Secret Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              style={{ textAlign: "center", letterSpacing: "2px" }}
              required
            />
          </div>
          
          {error && <p style={{ color: "#ef4444", fontSize: "14px", margin: 0, textAlign: "center" }}>{error}</p>}
          
          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Unlock Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
