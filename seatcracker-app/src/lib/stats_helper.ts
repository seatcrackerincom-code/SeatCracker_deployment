import { UserProgress } from "./supabase";

export interface GlobalStats {
  avgAccuracy: number;
  avgPace: number; // seconds per question
  progressPercent: number;
  bpm: number; // bits per minute (Effective Mastery Rate)
}

/**
 * Calculates global stats based on the list of topic progresses.
 */
export function calculateGlobalStats(progressList: UserProgress[]): GlobalStats {
  if (!progressList || progressList.length === 0) {
    return { avgAccuracy: 0, avgPace: 0, progressPercent: 0, bpm: 0 };
  }

  // Filter for completed/attempted topics
  const attempted = progressList.filter(p => p.accuracy > 0 || (p.attempts ?? 0) > 0);
  
  if (attempted.length === 0) {
    return { avgAccuracy: 0, avgPace: 0, progressPercent: 0, bpm: 0 };
  }

  const totalAccuracy = attempted.reduce((sum, p) => sum + p.accuracy, 0);
  const totalPace = attempted.reduce((sum, p) => sum + p.avg_time, 0);

  // BPM = Bits (Questions) per Minute * Mastery (%)
  // If avgPace = 45s (0.75 min), then Questions/Min = 1 / 0.75 = 1.33. 
  // If Accuracy = 80%, BPM = 1.33 * 0.8 = 1.06
  const avgPaceSec = totalPace / attempted.length;
  const avgAccuracyFactor = (totalAccuracy / attempted.length) / 100;
  
  const bpm = avgPaceSec > 0 
    ? Number(((60 / avgPaceSec) * avgAccuracyFactor).toFixed(2))
    : 0;

  const progressPercent = Math.min(100, Math.round((attempted.length / 40) * 100)); // Sample 40 topics target

  return {
    avgAccuracy: Math.round(totalAccuracy / attempted.length),
    avgPace: Number(avgPaceSec.toFixed(1)),
    progressPercent,
    bpm
  };
}
