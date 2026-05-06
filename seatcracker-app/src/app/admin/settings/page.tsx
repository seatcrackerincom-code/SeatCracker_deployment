"use client";
import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const [target, setTarget] = useState("10000");

  useEffect(() => {
    const saved = localStorage.getItem("sc_monthly_target");
    if (saved) setTarget(saved);
  }, []);

  const saveTarget = () => {
    localStorage.setItem("sc_monthly_target", target);
    alert("Target saved successfully.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 8px", color: "var(--text)" }}>Platform Settings</h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>Configure global dashboard parameters and view admin access.</p>
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>Dashboard Configuration</h3>
        
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Monthly Revenue Target (₹)</label>
          <div style={{ display: "flex", gap: "12px", maxWidth: "400px" }}>
            <input 
              type="number" 
              value={target} 
              onChange={e => setTarget(e.target.value)} 
              className="admin-input" 
            />
            <button onClick={saveTarget} className="admin-btn" style={{ width: "auto", padding: "0 24px" }}>Save</button>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>Used for calculating progress in the Revenue dashboard gauges.</p>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>Admin Accounts</h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
          Admins are users in the Supabase <code>users</code> table where <code>is_admin = true</code>. To add a new admin, run an UPDATE query in your Supabase SQL editor.
        </p>
        
        <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <code style={{ fontSize: "12px", color: "#10b981", wordBreak: "break-all" }}>
            UPDATE users SET is_admin = true WHERE id = 'firebase_user_uid';
          </code>
        </div>
      </div>
    </div>
  );
}
