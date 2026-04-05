import { UserProgress } from "./supabase";

export interface GlobalStats {
  avgAccuracy: number;
  avgPace: number; // seconds per question
  progressPercent: number;
}

/**
 * Calculates global stats based on the list of topic progresses.
 */
export function calculateGlobalStats(progressList: UserProgress[]): GlobalStats {
  if (!progressList || progressList.length === 0) {
    return { avgAccuracy: 0, avgPace: 0, progressPercent: 0 };
  }

  // Filter for completed/attempted topics
  const attempted = progressList.filter(p => p.accuracy > 0 || (p.attempts ?? 0) > 0);
  
  if (attempted.length === 0) {
    return { avgAccuracy: 0, avgPace: 0, progressPercent: 0 };
  }

  const totalAccuracy = attempted.reduce((sum, p) => sum + p.accuracy, 0);
  const totalPace = attempted.reduce((sum, p) => sum + p.avg_time, 0);

  // For progress percentage, let's assume a rough target of total topics.
  // In a real app, this would be totalChapters.count. 
  // For now, let's use the number of attempted topics vs a nominal "complete" target (e.g. 50 topics)
  // or just use the ratio of practiced topics in the list.
  const progressPercent = Math.min(100, Math.round((attempted.length / 40) * 100)); // Sample 40 topics target

  return {
    avgAccuracy: Math.round(totalAccuracy / attempted.length),
    avgPace: Number((totalPace / attempted.length).toFixed(1)),
    progressPercent
  };
}
