"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────
interface Stats {
  totalUsers:       number;
  premiumUsers:     number;
  totalRevenue:     number;
  usersJoinedToday: number;
  recentPayments: { user_id: string; amount: number; status: string; created_at: string }[];
  recentUsers:    { id: string; is_premium: boolean; purchase_date: string | null; plan: string | null; created_at: string }[];
}

const ADMIN_SECRET = "sc_admin_2024"; // only used client→server; server validates

// ─── Component ────────────────────────────────────────────
export default function AdminDashboard() {
  const [pin,      setPin]      = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [liveCCU,  setLiveCCU]  = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleUnlock = () => {
    if (pin === ADMIN_SECRET || pin === "sc_admin_2024") {
      setUnlocked(true);
    } else {
      setError("Wrong password.");
    }
  };

  useEffect(() => {
    if (!unlocked) return;
    setLoading(true);
    
    // ── Real-time CCU ─────────────────────────────────────
    if (!supabase) return;
    const channel: RealtimeChannel = supabase.channel("online-users");
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setLiveCCU(Object.keys(state).length);
      })
      .subscribe();

    fetch("/api/admin/stats", {
      headers: { "x-admin-secret": ADMIN_SECRET },
    })
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => { setError("Failed to load stats."); setLoading(false); });

    return () => {
      channel.unsubscribe();
    };
  }, [unlocked]);

  // ── Lock screen ───────────────────────────────────────
  if (!unlocked) {
    return (
      <div style={styles.lockWrap}>
        <div style={styles.lockCard}>
          <div style={styles.lockIcon}>🔐</div>
          <h1 style={styles.lockTitle}>SeatCracker Admin</h1>
          <p style={styles.lockSub}>Enter admin password to continue</p>
          <input
            type="password"
            placeholder="Password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            style={styles.lockInput}
          />
          {error && <p style={styles.errText}>{error}</p>}
          <button onClick={handleUnlock} style={styles.lockBtn}>
            Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────
  return (
    <div style={styles.wrap}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Analytics Dashboard</h1>
          <p style={styles.subtitle}>SeatCracker — Live Platform Metrics</p>
        </div>
        <button onClick={() => setUnlocked(false)} style={styles.logoutBtn}>
          🔒 Lock
        </button>
      </div>

      {loading && <p style={styles.loading}>Loading metrics…</p>}
      {error   && <p style={styles.errText}>{error}</p>}

      {stats && (
        <>
          {/* KPI Cards */}
          <div style={styles.cardRow}>
            <KpiCard
              icon="🔴"
              label="Live Now"
              value={liveCCU}
              color="#ef4444"
              isLive
            />
            <KpiCard
              icon="👥"
              label="Total Users"
              value={stats.totalUsers}
              color="#6366f1"
            />
            <KpiCard
              icon="✨"
              label="Joined Today"
              value={stats.usersJoinedToday}
              color="#34d399"
            />
            <KpiCard
              icon="⭐"
              label="Premium Users"
              value={stats.premiumUsers}
              color="#f59e0b"
            />
            <KpiCard
              icon="💰"
              label="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
              color="#10b981"
            />
            <KpiCard
              icon="📈"
              label="Conversion Rate"
              value={
                stats.totalUsers > 0
                  ? `${((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}%`
                  : "—"
              }
              color="#ec4899"
            />
          </div>

          {/* Recent Payments */}
          <Section title="💳 Recent Payments">
            <table style={styles.table}>
              <thead>
                <tr>
                  {["User ID", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentPayments.length === 0 ? (
                  <tr><td colSpan={4} style={styles.empty}>No payments yet</td></tr>
                ) : (
                  stats.recentPayments.map((p, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      <td style={styles.td}>{truncate(p.user_id)}</td>
                      <td style={{ ...styles.td, color: "#10b981", fontWeight: 700 }}>
                        ₹{p.amount}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: p.status === "success" ? "#10b98133" : "#ef444433",
                          color:      p.status === "success" ? "#10b981"   : "#ef4444",
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: "#94a3b8" }}>
                        {new Date(p.created_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Section>

          {/* Recent Users */}
          <Section title="🧑‍🎓 Recent Users">
            <table style={styles.table}>
              <thead>
                <tr>
                  {["User ID", "Premium", "Plan", "Purchase Date"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.length === 0 ? (
                  <tr><td colSpan={4} style={styles.empty}>No users yet</td></tr>
                ) : (
                  stats.recentUsers.map((u, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      <td style={styles.td}>{truncate(u.id)}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: u.is_premium ? "#f59e0b22" : "#64748b22",
                          color:      u.is_premium ? "#f59e0b"   : "#64748b",
                        }}>
                          {u.is_premium ? "⭐ Premium" : "Free"}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: "#94a3b8" }}>{u.plan ?? "—"}</td>
                      <td style={{ ...styles.td, color: "#94a3b8" }}>
                        {u.purchase_date
                          ? new Date(u.purchase_date).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Section>
        </>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────
function KpiCard({
  icon, label, value, color, isLive
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  isLive?: boolean;
}) {
  return (
    <div style={{ ...styles.kpiCard, borderTop: `3px solid ${color}` }}>
      <div style={{ ...styles.kpiIcon, color }}>{icon}</div>
      <div style={{ ...styles.kpiValue, color }}>{value}</div>
      <div style={styles.kpiLabel}>{label} {isLive && "●"}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────
function truncate(s: string, n = 14) {
  return s.length > n ? `${s.substring(0, n)}…` : s;
}

// ─── Styles ───────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  // Lock
  lockWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
  },
  lockCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    minWidth: 340,
    backdropFilter: "blur(20px)",
  },
  lockIcon:  { fontSize: 48 },
  lockTitle: { color: "#fff", fontSize: 26, fontWeight: 700, margin: 0, fontFamily: "Inter,sans-serif" },
  lockSub:   { color: "#94a3b8", fontSize: 14, margin: 0 },
  lockInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
  },
  lockBtn: {
    width: "100%",
    padding: "13px 0",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
  // Dashboard
  wrap: {
    minHeight: "100vh",
    background: "#0b0f1a",
    color: "#e2e8f0",
    fontFamily: "Inter,system-ui,sans-serif",
    padding: "32px 24px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 },
  title:    { fontSize: 28, fontWeight: 800, color: "#f1f5f9", margin: 0 },
  subtitle: { color: "#94a3b8", fontSize: 14, marginTop: 4 },
  logoutBtn: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: 13,
  },
  loading: { color: "#94a3b8", textAlign: "center", padding: 20 },
  errText: { color: "#ef4444", textAlign: "center" },
  // KPI
  cardRow: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 20, marginBottom: 40 },
  kpiCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  kpiIcon:  { fontSize: 28 },
  kpiValue: { fontSize: 32, fontWeight: 800, lineHeight: 1 },
  kpiLabel: { color: "#64748b", fontSize: 13, fontWeight: 500 },
  // Table
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#e2e8f0" },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: {
    textAlign: "left" as const,
    padding: "10px 14px",
    background: "rgba(255,255,255,0.04)",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  td:      { padding: "11px 14px", fontSize: 14, borderBottom: "1px solid rgba(255,255,255,0.04)" },
  rowEven: { background: "transparent" },
  rowOdd:  { background: "rgba(255,255,255,0.015)" },
  empty:   { padding: 20, textAlign: "center" as const, color: "#475569", fontSize: 14 },
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 600,
  },
};
