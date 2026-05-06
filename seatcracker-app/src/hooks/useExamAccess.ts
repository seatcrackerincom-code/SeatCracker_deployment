import { useState, useEffect } from "react";
import { getExamConfig } from "@/config/examConfig";

export function useExamAccess(userId: string | undefined, examId: string, dayNumber: number) {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const config = getExamConfig(examId);

  useEffect(() => {
    async function fetchStatus() {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/payment/status?userId=${userId}&examId=${examId}`);
        const data = await res.json();
        setIsPremium(data.isPremium || false);
      } catch (error) {
        console.error("Failed to fetch access status", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatus();
  }, [userId, examId]);

  const isFreeDay = dayNumber <= config.freeDays;
  const canAttempt = !config.isPremium || isPremium || isFreeDay;

  return {
    canAttempt,
    isPremium,
    isLoading,
    showPaywall: !canAttempt && !isLoading,
    config
  };
}
