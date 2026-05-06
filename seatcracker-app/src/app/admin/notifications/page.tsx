import React from "react";
import AuditLog from "../../../components/admin/AuditLog";

export default function NotificationsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 8px", color: "var(--text)" }}>Notifications & Activity Log</h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>Complete history of admin actions and platform events.</p>
      </div>
      
      <AuditLog />
    </div>
  );
}
