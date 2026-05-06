"use client";
import React, { useEffect, useState } from "react";
import { UserGrowthChart, DailyRevenueChart } from "../../components/admin/RevenueGraphs";
import { useLivePresence } from "../../lib/presence";

interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  totalRevenue: number;
  todaysPayments: number;
  recentPayments: any[];
  activePoll?: any;
  revenueData: any[]; // for graph
  growthData: any[];  // for graph
}

export default function OverviewDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const liveCount = useLivePresence();

  useEffect(() => {
    fetch("/api/admin/stats?range=30", { headers: { "x-admin-secret": "sc_admin_2024" } })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: "#94a3b8", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>Loading metrics...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Row Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        <StatCard title="Total Revenue" value={`₹${stats?.totalRevenue.toLocaleString() || 0}`} icon="💰" color="#10b981" />
        <StatCard title="Active Users Now" value={liveCount} icon="🔴" color="#ef4444" isLive />
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" color="#6366f1" />
        <StatCard title="Today's Payments" value={stats?.todaysPayments || 0} icon="✨" color="#f59e0b" />
      </div>

      {/* Middle Row Graphs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
        <div className="admin-card">
          <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>Revenue — Last 30 Days</h3>
          <DailyRevenueChart data={stats?.revenueData || []} />
        </div>
        <div className="admin-card">
          <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>User Growth</h3>
          <UserGrowthChart data={stats?.growthData || []} />
        </div>
      </div>

      {/* Bottom Row Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>Recent Payments</h3>
            <a href="/admin/revenue" style={{ fontSize: "13px", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>View All</a>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "12px", textAlign: "left" }}>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>User ID</th>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Amount</th>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentPayments?.slice(0, 5).map((p, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "14px 0", fontSize: "14px", color: "var(--text)" }}>{p.user_id.substring(0,8)}...</td>
                  <td style={{ padding: "14px 0", fontSize: "14px", color: "#10b981", fontWeight: 600 }}>₹{p.amount || p.amount_paid}</td>
                  <td style={{ padding: "14px 0" }}>
                    <span style={{ 
                      padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600,
                      background: p.status === 'success' || p.status === undefined ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                      color: p.status === 'success' || p.status === undefined ? '#10b981' : '#ef4444' 
                    }}>
                      {p.status || "verified"}
                    </span>
                  </td>
                </tr>
              ))}
              {stats?.recentPayments?.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                    No recent payments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>Active Poll Preview</h3>
            <a href="/admin/polls" style={{ fontSize: "13px", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>Manage</a>
          </div>
          {stats?.activePoll ? (
            <div>
              <p style={{ fontSize: "15px", marginBottom: "16px", color: "var(--text)" }}>{stats.activePoll.question}</p>
              {/* Simple progress bars for poll options */}
              {stats.activePoll.options.map((opt: any, i: number) => {
                const total = stats.activePoll.totalVotes || 1;
                const pct = ((opt.votes / total) * 100).toFixed(0);
                return (
                  <div key={i} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                      <span style={{ color: "var(--text)" }}>{opt.text}</span>
                      <span style={{ color: "var(--text-muted)" }}>{pct}% ({opt.votes || 0})</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: "4px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>📊</div>
              No active polls right now.<br/>
              <a href="/admin/polls" style={{ color: "var(--accent)", textDecoration: "none", marginTop: "8px", display: "inline-block" }}>Create one</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, isLive }: { title: string, value: string | number, icon: string, color: string, isLive?: boolean }) {
  return (
    <div style={{ 
      background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
      padding: "24px", display: "flex", flexDirection: "column", gap: "16px",
      borderTop: `3px solid ${color}`, position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "80px", opacity: 0.05, filter: "blur(2px)" }}>
        {icon}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        <span style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 600 }}>{title}</span>
        <div style={{ 
          width: "36px", height: "36px", borderRadius: "10px", 
          background: `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, 0.1)`,
          color: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: "32px", fontWeight: 800, display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
        {value}
        {isLive && (
          <span style={{
            width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444",
            boxShadow: "0 0 12px #ef4444", animation: "ping 1.5s infinite"
          }} />
        )}
      </div>
    </div>
  );
}
