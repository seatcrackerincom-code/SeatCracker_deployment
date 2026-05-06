"use client";
import React, { useEffect, useState } from "react";

export default function AuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/audit-log", { headers: { "x-admin-secret": "sc_admin_2024" } })
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "20px", color: "var(--text-muted)" }}>Loading audit log...</div>;

  return (
    <div className="admin-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>Recent Audit Log</h3>
        <button onClick={() => window.location.reload()} style={{ background: "transparent", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "13px" }}>Refresh</button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "12px", textAlign: "left" }}>
              <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Time</th>
              <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Admin</th>
              <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Action</th>
              <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Target</th>
              <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Exam</th>
              <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <td style={{ padding: "14px 0", fontSize: "12px", color: "var(--text-muted)" }}>{new Date(log.performed_at).toLocaleString()}</td>
                <td style={{ padding: "14px 0", fontSize: "13px", color: "var(--text)" }}>{log.admin_email}</td>
                <td style={{ padding: "14px 0", fontSize: "13px" }}>
                  <span style={{ 
                    color: log.action_type === 'grant' ? '#10b981' : '#ef4444', 
                    background: log.action_type === 'grant' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600
                  }}>
                    {log.action_type.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "14px 0", fontSize: "13px", color: "var(--text)" }}>{log.target_user_id.substring(0,8)}...</td>
                <td style={{ padding: "14px 0", fontSize: "13px", color: "var(--text)" }}>{log.target_exam_id}</td>
                <td style={{ padding: "14px 0", fontSize: "13px", color: "var(--text-muted)" }}>{log.reason}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "30px 0", textAlign: "center", color: "var(--text-muted)" }}>No actions logged yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
