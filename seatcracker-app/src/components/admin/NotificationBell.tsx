"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRealtimePayments } from "../../hooks/useRealtimePayments";

export default function NotificationBell() {
  const { latestPayment } = useRealtimePayments();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/audit-log", { headers: { "x-admin-secret": "sc_admin_2024" } })
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(data => {
        if (data.logs) {
          setNotifications(data.logs.slice(0, 5));
        }
      })
      .catch(() => {});
      
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (latestPayment) {
      const newNotif = {
        id: Date.now(),
        type: 'payment',
        action_type: 'payment',
        target_exam_id: latestPayment.exam_id,
        target_user_id: latestPayment.user_id,
        performed_at: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + 1);
    }
  }, [latestPayment]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        style={{ 
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", 
          width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
          position: "relative", transition: "all 0.2s"
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{ 
            position: "absolute", top: "-2px", right: "-2px", background: "#ef4444", 
            color: "#fff", fontSize: "10px", width: "16px", height: "16px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ 
          position: "absolute", top: "50px", right: "0", width: "320px", 
          background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 100, overflow: "hidden"
        }}>
          <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: "14px" }}>Notifications</span>
            <span onClick={() => setUnreadCount(0)} style={{ fontSize: "12px", color: "var(--accent)", cursor: "pointer" }}>Mark all read</span>
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {notifications.map((n, i) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: n.action_type === 'grant' ? "rgba(16,185,129,0.1)" : "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                  {n.action_type === 'grant' ? "🔓" : "💰"}
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text)" }}>
                    {n.action_type === 'grant' ? 'Manual premium granted' : 'New payment received'} for <span style={{ fontWeight: 600 }}>{n.target_exam_id?.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    {new Date(n.performed_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                No notifications yet.
              </div>
            )}
          </div>
          <a href="/admin/notifications" style={{ display: "block", padding: "12px", textAlign: "center", background: "rgba(255,255,255,0.02)", color: "var(--accent)", fontSize: "13px", textDecoration: "none", borderTop: "1px solid var(--border)" }}>
            View all activity
          </a>
        </div>
      )}
    </div>
  );
}
