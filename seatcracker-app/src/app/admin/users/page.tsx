"use client";
import React, { useEffect, useState } from "react";
import UserExplorer from "../../../components/admin/UserExplorer";
import { subscribeToPresence } from "../../../lib/presence";

export default function UsersDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveUsers, setLiveUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats?range=30&detail=users", { headers: { "x-admin-secret": "sc_admin_2024" } })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });

    // We can't easily wait for the promise from lib/presence in a pure sync way if it's async imported, 
    // but assuming subscribeToPresence works identically to earlier.
    let unsub: (() => void) | null = null;
    import("../../../lib/presence").then(({ subscribeToPresence }) => {
      unsub = subscribeToPresence((state) => {
        const users = Object.entries(state).map(([key, data]: any) => ({
          uid: key,
          ...data[0]
        }));
        setLiveUsers(users);
      });
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (loading) return <div style={{ color: "#94a3b8", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>Loading users data...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Main Card */}
      <div style={{ 
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))",
        border: "1px solid rgba(99, 102, 241, 0.15)", borderRadius: "var(--radius)",
        padding: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px"
      }}>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Total Users</div>
          <div style={{ fontSize: "48px", fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>{data?.totalUsers?.toLocaleString() || 0}</div>
        </div>
        <div style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "24px" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Active Today</div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#10b981", lineHeight: 1 }}>{data?.activeToday?.toLocaleString() || 0}</div>
        </div>
        <div style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "24px" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>New Signups (Today)</div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>{data?.growthData?.[29]?.signups || 0}</div>
        </div>
      </div>

      <UserExplorer data={data || {}} liveUsers={liveUsers} />
    </div>
  );
}
