// Supabase client stub — works safely without env vars.
// Once you've completed SUPABASE_SETUP_GUIDE.txt steps, this activates automatically.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl.startsWith("http") && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface UserProgress {
  id?: string;
  user_id: string;
  topic: string;
  subject: string;
  accuracy: number;
  avg_time: number;
  completed: boolean;
  created_at?: string;
  seen_question_ids?: number[];
  attempts?: number;
  last_attempt_at?: string;
}

export async function saveProgress(data: Omit<UserProgress, "id" | "created_at">) {
  if (!supabase) return null;
  const { data: result, error } = await supabase
    .from("user_progress")
    .upsert(data, { onConflict: "user_id,topic" });
  if (error) console.error("Supabase save error:", error);
  return result;
}

export async function fetchProgress(userId: string): Promise<UserProgress[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error("Supabase fetch error:", error);
  return data || [];
}
