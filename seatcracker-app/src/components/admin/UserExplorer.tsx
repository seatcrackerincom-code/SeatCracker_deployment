"use client";
import React, { useState } from "react";
import { UserGrowthChart, RetentionRadar } from "./RevenueGraphs";

export default function UserExplorer({ data, liveUsers }: { data: any, liveUsers: any[] }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "By Exam Prep", icon: "📚" },
    { id: 1, label: "Active Now", icon: "🔴" },
    { id: 2, label: "Activity Graph", icon: "📊" },
    { id: 3, label: "Retention", icon: "🔄" }
  ];

  return (
    <div className="admin-card" style={{ padding: 0 }}>
      {/* Tabs Header */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "16px 24px", background: "transparent", border: "none", cursor: "pointer",
              color: activeTab === tab.id ? "var(--accent)" : "var(--text-muted)",
              borderBottom: activeTab === tab.id ? "2px solid var(--accent)" : "2px solid transparent",
              fontWeight: activeTab === tab.id ? 600 : 500, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px",
              transition: "all 0.2s", whiteSpace: "nowrap"
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div style={{ padding: "24px" }}>
        {activeTab === 0 && (
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>Users by Exam</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <ExamBar name="JEE Advanced" count={data?.jeeUsers || 0} total={data?.totalUsers || 1} color="#6366f1" />
              <ExamBar name="EAMCET" count={data?.eamcetUsers || 0} total={data?.totalUsers || 1} color="#38bdf8" />
              <ExamBar name="Others / Undeclared" count={(data?.totalUsers || 0) - ((data?.jeeUsers || 0) + (data?.eamcetUsers || 0))} total={data?.totalUsers || 1} color="#94a3b8" />
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 8px #ef4444", animation: "ping 1.5s infinite" }} />
                Live Sessions ({liveUsers.length})
              </h3>
            </div>
            {liveUsers.length === 0 ? (
              <div style={{ color: "var(--text-muted)", padding: "40px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "12px" }}>
                No active sessions at the moment.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                {liveUsers.map((u, i) => (
                  <div key={i} style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>{u.uid.substring(0,12)}...</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Online since: {new Date(u.online_at).toLocaleTimeString()}</div>
                    <div style={{ fontSize: "11px", color: "var(--accent)", marginTop: "8px" }}>
                      {u.user_agent?.split(')')[0].split('(')[1] || "Mobile Device"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>Daily Active Users (Last 30 Days)</h3>
            <UserGrowthChart data={data?.growthData || []} />
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>Retention Rates</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              <div>
                <RetentionRadar data={[
                  { subject: "D1", A: 85 },
                  { subject: "D3", A: 65 },
                  { subject: "D7", A: 45 },
                  { subject: "D14", A: 30 },
                  { subject: "D30", A: 20 },
                ]} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "center" }}>
                <div style={{ padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 500 }}>Day 1 Retention</div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "#10b981" }}>85%</div>
                </div>
                <div style={{ padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 500 }}>Week 1 Retention</div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "#f59e0b" }}>45%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExamBar({ name, count, total, color }: { name: string, count: number, total: number, color: string }) {
  const pct = Math.round((count / (total || 1)) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
        <span style={{ fontWeight: 600, color: "var(--text)" }}>{name}</span>
        <span style={{ color: "var(--text-muted)" }}>{count} users ({pct}%)</span>
      </div>
      <div style={{ width: "100%", height: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "6px" }} />
      </div>
    </div>
  );
}
