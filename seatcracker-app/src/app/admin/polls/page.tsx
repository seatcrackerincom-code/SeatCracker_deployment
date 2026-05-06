import React from "react";
import PollManager from "../../../components/admin/PollManager";

export default function PollsDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 8px", color: "var(--text)" }}>Polls Management</h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>Create targeted user polls and display them across the app to gather feedback.</p>
      </div>
      
      <PollManager />
    </div>
  );
}
