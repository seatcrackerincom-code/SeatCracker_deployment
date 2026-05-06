"use client";
import React, { useEffect, useState } from "react";
import RevenueCards from "../../../components/admin/RevenueCards";
import { DailyRevenueChart, PaymentStatusPie } from "../../../components/admin/RevenueGraphs";

export default function RevenueDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats?range=30&detail=revenue", { headers: { "x-admin-secret": "sc_admin_2024" } })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: "#94a3b8", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>Loading revenue data...</div>;

  // Mock pie data if not provided directly
  const pieData = data?.pieData || [
    { name: "Verified", value: data?.totalRevenue || 1000 },
    { name: "Failed", value: 250 },
    { name: "Pending", value: 100 }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <RevenueCards data={data || {}} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        <div className="admin-card" style={{ gridColumn: "span 2" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>Revenue Trend (Last 30 Days)</h3>
          <DailyRevenueChart data={data?.revenueData || []} />
        </div>
        <div className="admin-card">
          <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>Payment Status</h3>
          <PaymentStatusPie data={pieData} />
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginTop: "16px" }}>
            {pieData.map((d: any, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: ['#10b981', '#ef4444', '#f59e0b'][i % 3] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>Recent Transactions</h3>
          <button style={{ 
            background: "transparent", border: "1px solid var(--border)", color: "var(--text)", 
            padding: "6px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer"
          }}>
            Export CSV
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "12px", textAlign: "left" }}>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Date</th>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>User ID</th>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Exam</th>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Amount</th>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentPayments?.map((p: any, i: number) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "14px 0", fontSize: "13px", color: "var(--text-muted)" }}>
                    {new Date(p.purchased_at).toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 0", fontSize: "14px", color: "var(--text)" }}>{p.user_id.substring(0,12)}...</td>
                  <td style={{ padding: "14px 0", fontSize: "14px", color: "var(--text)" }}>{p.exam_id?.toUpperCase() || 'UNKNOWN'}</td>
                  <td style={{ padding: "14px 0", fontSize: "14px", color: "#10b981", fontWeight: 600 }}>₹{p.amount_paid}</td>
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
              {data?.recentPayments?.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                    No recent payments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
}
