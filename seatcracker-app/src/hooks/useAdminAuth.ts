"use client";
import { useState, useEffect } from "react";
import { signOut, onAuthChange, type User } from "../lib/firebase";
import { supabase } from "../lib/supabase";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const savedKey = typeof window !== "undefined" ? localStorage.getItem("sc_admin_session") : null;
    if (savedKey === "true") {
      setIsAdmin(true);
      setIsLoading(false);
    }

    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        if (supabase) {
          const { data } = await supabase
            .from("users")
            .select("is_admin")
            .eq("id", firebaseUser.uid)
            .single();
          if (data && data.is_admin) {
            setIsAdmin(true);
          }
        }
      } else {
        setUser(null);
        if (savedKey !== "true") setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (secret: string, _pass?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });

      const data = await response.json();
      if (data.success) {
        setIsAdmin(true);
        localStorage.setItem("sc_admin_session", "true");
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: data.error || "Invalid Secret" };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: "Network Error" };
    }
  };

  const logout = async () => {
    await signOut();
    localStorage.removeItem("sc_admin_session");
    setIsAdmin(false);
  };

  return { user, isAdmin, isLoading, login, logout };
}
