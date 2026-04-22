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

// ─── Users table ──────────────────────────────────────────
// Schema:
//   id           text  (firebase uid)  PK
//   is_premium   boolean
//   purchase_date timestamp
//   plan         text

export interface DbUser {
  id: string;
  is_premium: boolean;
  purchase_date: string | null;
  plan: string | null;
  policies_accepted: boolean;
  name?: string;
  xp?: number;
  target_rank?: number;
  applied_codes?: string[];
  unlocked_features?: string[];
  cinema_seen?: boolean;
  rules_seen?: boolean;
  theme?: string;
  last_submit_time?: string;
  daily_submits?: number[];
}

/** Upsert a user record (safe to call on every login). */
export async function upsertUser(data: DbUser) {
  if (!supabase) return;
  const { error } = await supabase.from("users").upsert(data, { onConflict: "id" });
  if (error) console.error("[supabase] upsertUser error:", error.message);
}

/** Fetch a single user record. */
export async function fetchUser(uid: string): Promise<DbUser | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("users").select("*").eq("id", uid).single();
  if (error) return null;
  return data as DbUser;
}

/** Explicitly update policy acceptance. */
export async function updatePolicyStatus(uid: string, accepted: boolean) {
  if (!supabase) return;
  const { error } = await supabase.from("users").upsert({ id: uid, policies_accepted: accepted }, { onConflict: "id" });
  if (error) console.error("[supabase] updatePolicyStatus error:", error.message);
}

/** Upate User Profile fully */
export async function updateUserProfile(uid: string, updates: Partial<DbUser>) {
  if (!supabase) return;
  const { error } = await supabase.from("users").upsert({ id: uid, ...updates }, { onConflict: "id" });
  if (error) console.error("[supabase] updateUserProfile error:", error.message);
}

// ─── Mock Attempts ────────────────────────────────────────

export interface MockAttempt {
  id?: string;
  user_id: string;
  mock_id: string;
  responses: any;
  questions_snapshot?: any;
  score: number;
  total: number;
  accuracy: number;
  submitted_at: string;
}

/** Save a mock exam completion. */
export async function saveMockAttempt(data: MockAttempt) {
  if (!supabase) return null;
  const { data: result, error } = await supabase.from("mock_attempts").insert(data);
  if (error) console.error("[supabase] saveMockAttempt error:", error.message);
  return result;
}

/** Fetch mock history for the current user. */
export async function fetchMockAttempts(userId: string): Promise<MockAttempt[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("mock_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });
  if (error) console.error("[supabase] fetchMockAttempts error:", error.message);
  return data || [];
}

// ─── Payments table ───────────────────────────────────────
// Schema:
//   id          uuid  default gen_random_uuid()  PK
//   user_id     text
//   amount      int
//   status      text  ('success' | 'failed')
//   created_at  timestamp  default now()

export interface DbPayment {
  user_id: string;
  amount: number;
  status: "success" | "failed";
}

/** Insert a new payment record. */
export async function insertPayment(data: DbPayment) {
  if (!supabase) return;
  const { error } = await supabase.from("payments").insert(data);
  if (error) console.error("[supabase] insertPayment error:", error.message);
}
