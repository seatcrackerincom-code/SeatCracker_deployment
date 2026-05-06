"use client";
import React, { createContext, useContext } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { User } from "firebase/auth";

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAdminAuth();

  return (
    <AdminAuthContext.Provider value={auth}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminAuthProvider");
  }
  return context;
}
