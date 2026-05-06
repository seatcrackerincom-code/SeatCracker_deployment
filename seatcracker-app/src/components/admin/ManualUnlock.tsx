"use client";
import React, { useState } from "react";
import { useAdminContext } from "./AdminAuthProvider";

export default function ManualUnlock() {
  const { user } = useAdminContext();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalExam, setModalExam] = useState("");
  const [modalAction, setModalAction] = useState<"grant" | "revoke">("grant");
  const [reason, setReason] = useState("Payment proof received");
  const [note, setNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const searchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/admin/users?query=${encodeURIComponent(query)}`, {
        headers: { "x-admin-secret": "sc_admin_2024" }
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Search failed");
      }
      if (!data) throw new Error("Invalid response from server");
      
      if (data.users && data.users.length > 0) {
        setResult(data.users[0]); // Take first match
      } else {
        setError("No user found with that email or ID");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (exam: string, action: "grant" | "revoke") => {
    setModalExam(exam);
    setModalAction(action);
    setReason("Payment proof received");
    setNote("");
    setModalOpen(true);
  };

  const handleAction = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/manual-unlock", {
        method: "POST",
        headers: { 
          "x-admin-secret": "sc_admin_2024",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminEmail: user?.email,
          targetUserId: result.id,
          targetExamId: modalExam,
          actionType: modalAction,
          reason,
          note
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Action failed");
      }
      if (!data) throw new Error("Invalid response from server");

      // Simple local update
      setResult((prev: any) => ({
        ...prev,
        access: {
          ...prev.access,
          [modalExam]: modalAction === "grant"
        }
      }));
      setModalOpen(false);
      alert(`Successfully ${modalAction === "grant" ? "granted" : "revoked"} premium for ${modalExam.toUpperCase()}`);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>Manual Controls</h3>
      
      <form onSubmit={searchUser} style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Enter User Email or ID..." 
          className="admin-input" 
          style={{ flex: 1 }} 
        />
        <button type="submit" className="admin-btn" style={{ width: "auto", padding: "0 24px" }} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div style={{ color: "#ef4444", marginBottom: "20px", fontSize: "14px" }}>{error}</div>}

      {result && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(99, 102, 241, 0.2)", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>👤</div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 600 }}>{result.id.substring(0,20)}...</div>
              <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>Joined: {new Date(result.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {['jee-advanced', 'eamcet'].map(exam => {
              const hasAccess = result.access && result.access[exam];
              return (
                <div key={exam} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
                  <div>
                    <div style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "14px", marginBottom: "4px" }}>{exam.replace('-', ' ')}</div>
                    <span style={{ 
                      padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600,
                      background: hasAccess ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', 
                      color: hasAccess ? '#10b981' : '#94a3b8' 
                    }}>
                      {hasAccess ? "Premium" : "Free"}
                    </span>
                  </div>
                  
                  {hasAccess ? (
                    <button onClick={() => openModal(exam, "revoke")} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Revoke Premium</button>
                  ) : (
                    <button onClick={() => openModal(exam, "grant")} style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Grant Premium</button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {modalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "18px", color: "var(--text)" }}>
              {modalAction === "grant" ? "Grant Premium" : "Revoke Premium"} — {modalExam.toUpperCase()}
            </h3>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Reason</label>
              <select value={reason} onChange={e => setReason(e.target.value)} className="admin-input" style={{ color: "#fff", background: "rgba(255,255,255,0.05)" }}>
                <option value="Payment proof received">Payment proof received</option>
                <option value="Test account">Test account</option>
                <option value="Compensation">Compensation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Note (Optional)</label>
              <input type="text" value={note} onChange={e => setNote(e.target.value)} className="admin-input" placeholder="e.g. Paid via UPI on WhatsApp" />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setModalOpen(false)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "10px 16px", borderRadius: "8px", cursor: "pointer" }} disabled={actionLoading}>Cancel</button>
              <button onClick={handleAction} className="admin-btn" style={{ width: "auto", padding: "0 24px" }} disabled={actionLoading}>
                {actionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
