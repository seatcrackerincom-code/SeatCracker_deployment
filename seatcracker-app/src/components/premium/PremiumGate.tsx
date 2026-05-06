"use client";

import React, { useState } from "react";
import { useExamAccess } from "@/hooks/useExamAccess";
import PurchaseScreen from "./PurchaseScreen";
import { User } from "firebase/auth";

interface Props {
  userId: string | undefined;
  authUser: User | null | any;
  examId: string;
  dayNumber: number;
  children: React.ReactNode;
}

export default function PremiumGate({ userId, authUser, examId, dayNumber, children }: Props) {
  const { canAttempt, showPaywall, config } = useExamAccess(userId, examId, dayNumber);
  const [forceShowPaywall, setForceShowPaywall] = useState(false);

  const handleSuccess = () => {
    setForceShowPaywall(false);
    window.location.reload(); // Simple way to refresh all access states
  };

  if (showPaywall || forceShowPaywall) {
    return (
      <PurchaseScreen 
        config={config} 
        user={authUser} 
        onClose={() => setForceShowPaywall(false)} 
        onSuccess={handleSuccess} 
      />
    );
  }

  // If locked but not showing paywall (e.g. initial load or just the day card),
  // we might want to trigger it on click. But for the gate, we just block.
  if (!canAttempt) {
    return (
      <div 
        onClick={() => setForceShowPaywall(true)}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
