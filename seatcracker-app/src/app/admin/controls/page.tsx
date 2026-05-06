import React from "react";
import ManualUnlock from "../../../components/admin/ManualUnlock";
import AuditLog from "../../../components/admin/AuditLog";

export default function ControlsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 8px", color: "var(--text)" }}>Manual Unlock & Controls</h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>Search for users and grant or revoke premium access manually.</p>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
        <div style={{ gridColumn: "1 / -1", maxWidth: "800px" }}><ManualUnlock /></div>
        <div style={{ gridColumn: "1 / -1" }}><AuditLog /></div>
      </div>
    </div>
  );
}
