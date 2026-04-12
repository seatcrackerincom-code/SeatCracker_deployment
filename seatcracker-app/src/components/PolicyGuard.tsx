"use client";

import { useEffect, useState } from "react";
import { onAuthChange, type User } from "../lib/firebase";
import { fetchUser } from "../lib/supabase";
import { useUserState } from "../lib/useUserState";
import PolicyConsentModal from "./PolicyConsentModal";

export default function PolicyGuard() {
  const { user: appUser, setPoliciesAccepted, isLoaded } = useUserState();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

  // Sync with Firebase Auth
  useEffect(() => {
    const unsub = onAuthChange((fbUser) => {
      setAuthUser(fbUser);
      if (!fbUser) {
        setIsSyncing(false);
        setShowModal(false);
      }
    });
    return () => unsub();
  }, []);

  // Sync with Supabase on Auth Change
  useEffect(() => {
    if (authUser && isLoaded) {
      setIsSyncing(true);
      fetchUser(authUser.uid).then((dbUser) => {
        if (dbUser) {
          setPoliciesAccepted(dbUser.policies_accepted);
          setShowModal(!dbUser.policies_accepted);
        } else {
          // New user or legacy user without DB record yet
          setShowModal(true);
        }
        setIsSyncing(false);
      });
    }
  }, [authUser, isLoaded, setPoliciesAccepted]);

  // Don't show modal if we haven't synced with DB yet or if user is guest
  if (!authUser || isSyncing || !isLoaded) return null;

  if (showModal && !appUser.policies_accepted) {
    return (
      <PolicyConsentModal 
        uid={authUser.uid} 
        onAccept={() => setShowModal(false)}
      />
    );
  }

  return null;
}
