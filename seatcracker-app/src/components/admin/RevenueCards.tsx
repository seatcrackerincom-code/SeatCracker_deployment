"use client";
import React from "react";

export default function RevenueCards({ data }: { data: any }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
      <RevCard title="All-Time Revenue" value={`₹${data.totalRevenue?.toLocaleString() || 0}`} icon="💰" color="#10b981" />
      <RevCard title="Today's Revenue" value={`₹${data.todayRevenue?.toLocaleString() || 0}`} icon="✨" color="#f59e0b" />
      <RevCard title="This Month" value={`₹${data.monthRevenue?.toLocaleString() || 0}`} icon="📅" color="#6366f1" growth={data.monthGrowth || 12} />
      <RevCard title="Avg per User" value={`₹${data.avgRevenue?.toLocaleString() || 0}`} icon="📈" color="#8b5cf6" />
    </div>
  );
}

function RevCard({ title, value, icon, color, growth }: any) {
  return (
    <div style={{ 
      background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
      padding: "24px", display: "flex", flexDirection: "column", gap: "16px",
      borderTop: `3px solid ${color}`
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 600 }}>{title}</span>
        <div style={{ 
          width: "36px", height: "36px", borderRadius: "10px", 
          background: `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, 0.1)`,
          color: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: "32px", fontWeight: 800, display: "flex", alignItems: "center", gap: "10px" }}>
        {value}
      </div>
      {growth !== undefined && (
        <div style={{ fontSize: "13px", color: growth >= 0 ? "#10b981" : "#ef4444", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
          {growth >= 0 ? "↑" : "↓"} {Math.abs(growth)}% <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>vs last month</span>
        </div>
      )}
    </div>
  );
}
