"use client";
import React, { useEffect } from "react";
import { useAdminContext } from "./AdminAuthProvider";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import NotificationBell from "./NotificationBell";
import SaleAlert from "./SaleAlert";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading, logout } = useAdminContext();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isAdmin && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoading, isAdmin, isLoginPage, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f1a", color: "#94a3b8" }}>
        Loading Admin Workspace...
      </div>
    );
  }

  // If on login page, just show the page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not admin and not loading (and not on login page), show nothing while redirecting
  if (!isAdmin) {
    return null;
  }

  const navLinks = [
    { name: "Overview", path: "/admin", icon: "📊" },
    { name: "Revenue", path: "/admin/revenue", icon: "💰" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Manual Controls", path: "/admin/controls", icon: "🔓" },
    { name: "Polls", path: "/admin/polls", icon: "📊" },
    { name: "Notifications", path: "/admin/notifications", icon: "🔔" },
    { name: "Settings", path: "/admin/settings", icon: "⚙️" }
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <span style={{ fontSize: "24px" }}>🚀</span> SeatCracker Admin
          </div>
        </div>
        
        <nav className="admin-sidebar-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`admin-nav-item ${isActive ? "active" : ""}`}
              >
                <span style={{ fontSize: "16px" }}>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div style={{ padding: "24px 16px", marginTop: "auto" }}>
          <button 
            onClick={() => logout()}
            style={{ 
              width: "100%", padding: "10px", borderRadius: "8px", 
              background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", 
              border: "1px solid rgba(239, 68, 68, 0.2)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              fontWeight: 600, transition: "all 0.2s"
            }}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">
            {navLinks.find(l => l.path === pathname)?.name || "Dashboard"}
          </div>
          
          <div className="admin-header-actions">
            <div style={{ fontSize: "14px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
              {user?.email}
            </div>
            <NotificationBell />
          </div>
        </header>
        
        <div className="admin-content">
          {children}
        </div>
      </main>
      
      <SaleAlert />
    </div>
  );
}
