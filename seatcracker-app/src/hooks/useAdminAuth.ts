"use client";
import { useState, useEffect } from "react";
import { auth, signInEmail, signOut, onAuthChange, type User } from "../lib/firebase";
import { supabase } from "../lib/supabase";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Check admin role in Supabase
        if (supabase) {
          const { data, error } = await supabase
            .from("users")
            .select("is_admin")
            .eq("id", firebaseUser.uid)
            .single();

          if (data && data.is_admin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const { user: loggedInUser, error } = await signInEmail(email, pass);
    
    if (error || !loggedInUser) {
      setIsLoading(false);
      return { success: false, error: "Invalid credentials" };
    }

    // Check admin role
    if (supabase) {
      const { data } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", loggedInUser.uid)
        .single();

      if (data && data.is_admin) {
        setIsAdmin(true);
        setIsLoading(false);
        return { success: true };
      }
    }

    // Not an admin
    await signOut();
    setIsAdmin(false);
    setIsLoading(false);
    return { success: false, error: "Access denied. Admin role required." };
  };

  const logout = async () => {
    await signOut();
    setIsAdmin(false);
  };

  return { user, isAdmin, isLoading, login, logout };
}
