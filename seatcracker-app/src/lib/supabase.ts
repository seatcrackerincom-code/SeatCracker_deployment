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

// ─── JEE Advanced Results ─────────────────────────────────
// Supabase SQL — Run this in your Supabase dashboard:
// ---------------------------------------------------------
// CREATE TABLE jee_results (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id text NOT NULL,
//   day_number int NOT NULL CHECK (day_number BETWEEN 1 AND 10),
//   paper1_physics int DEFAULT 0,
//   paper1_chemistry int DEFAULT 0,
//   paper1_maths int DEFAULT 0,
//   paper1_total int DEFAULT 0,
//   paper2_physics int DEFAULT 0,
//   paper2_chemistry int DEFAULT 0,
//   paper2_maths int DEFAULT 0,
//   paper2_total int DEFAULT 0,
//   physics_total int DEFAULT 0,
//   chemistry_total int DEFAULT 0,
//   maths_total int DEFAULT 0,
//   grand_total int DEFAULT 0,
//   total_correct int DEFAULT 0,
//   total_wrong int DEFAULT 0,
//   total_unattempted int DEFAULT 0,
//   accuracy_percent numeric(4,1) DEFAULT 0,
//   overall_percentile numeric(5,2) DEFAULT 0,
//   physics_percentile numeric(5,2) DEFAULT 0,
//   chemistry_percentile numeric(5,2) DEFAULT 0,
//   maths_percentile numeric(5,2) DEFAULT 0,
//   rank_estimate int DEFAULT 0,
//   performance_tag text DEFAULT '',
//   strong_subjects text[] DEFAULT '{}',
//   weak_subjects text[] DEFAULT '{}',
//   paper1_submitted_at timestamptz,
//   paper2_submitted_at timestamptz,
//   result_generated_at timestamptz DEFAULT now(),
//   UNIQUE(user_id, day_number)
// );
// CREATE INDEX idx_jee_results_user ON jee_results(user_id);
// CREATE INDEX idx_jee_results_day ON jee_results(day_number);

export interface JEEResult {
  user_id: string;
  day_number: number;
  paper1_physics: number;
  paper1_chemistry: number;
  paper1_maths: number;
  paper1_total: number;
  paper2_physics: number;
  paper2_chemistry: number;
  paper2_maths: number;
  paper2_total: number;
  physics_total: number;
  chemistry_total: number;
  maths_total: number;
  grand_total: number;
  total_correct: number;
  total_wrong: number;
  total_unattempted: number;
  accuracy_percent: number;
  overall_percentile?: number;
  physics_percentile?: number;
  chemistry_percentile?: number;
  maths_percentile?: number;
  rank_estimate?: number;
  performance_tag: string;
  strong_subjects: string[];
  weak_subjects: string[];
  paper1_submitted_at?: string;
  paper2_submitted_at?: string;
  result_generated_at?: string;
}

/** Upsert a JEE Advanced result (one per user per day). */
export async function saveJEEResult(data: JEEResult) {
  if (!supabase) {
    console.warn("[supabase] No client — saving JEE result to localStorage only.");
    return null;
  }
  const { data: result, error } = await supabase
    .from("jee_results")
    .upsert(data, { onConflict: "user_id,day_number" });
  if (error) console.error("[supabase] saveJEEResult error:", error.message);
  return result;
}

/** Fetch a single day's JEE result for a user. */
export async function fetchJEEResult(userId: string, dayNumber: number): Promise<JEEResult | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("jee_results")
    .select("*")
    .eq("user_id", userId)
    .eq("day_number", dayNumber)
    .single();
  if (error) return null;
  return data as JEEResult;
}

/** Fetch all JEE results for a user (for 10-day progress tracker). */
export async function fetchAllJEEResults(userId: string): Promise<JEEResult[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("jee_results")
    .select("*")
    .eq("user_id", userId)
    .order("day_number", { ascending: true });
  if (error) {
    console.error("[supabase] fetchAllJEEResults error:", error.message);
    return [];
  }
  return data || [];
}

/** Fetch all students' scores for a specific day (for percentile calculation). */
export async function fetchAllDayScores(dayNumber: number): Promise<
  { grand_total: number; physics_total: number; chemistry_total: number; maths_total: number }[]
> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("jee_results")
    .select("grand_total, physics_total, chemistry_total, maths_total")
    .eq("day_number", dayNumber);
  if (error) {
    console.error("[supabase] fetchAllDayScores error:", error.message);
    return [];
  }
  return data || [];
}

/** Update percentile and rank for a specific result. */
export async function updateJEEPercentile(
  userId: string,
  dayNumber: number,
  percentiles: {
    overall_percentile: number;
    physics_percentile: number;
    chemistry_percentile: number;
    maths_percentile: number;
    rank_estimate: number;
  }
) {
  if (!supabase) return;
  const { error } = await supabase
    .from("jee_results")
    .update(percentiles)
    .eq("user_id", userId)
    .eq("day_number", dayNumber);
  if (error) console.error("[supabase] updateJEEPercentile error:", error.message);
}
// ─── User Exam Access ─────────────────────────────────────

export interface UserExamAccess {
  id?: string;
  user_id: string;
  exam_id: string;
  is_premium: boolean;
  payment_id?: string;
  order_id?: string;
  amount_paid?: number;
  purchased_at?: string;
}

/** Check if a user has premium access to a specific exam. */
export async function checkUserAccess(userId: string, examId: string): Promise<UserExamAccess | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("user_exam_access")
    .select("*")
    .eq("user_id", userId)
    .eq("exam_id", examId)
    .single();
  
  if (error) return null;
  return data as UserExamAccess;
}

/** Grant premium access to an exam after verified payment. */
export async function grantPremiumAccess(data: Omit<UserExamAccess, "id">) {
  if (!supabase) return;
  const { error } = await supabase
    .from("user_exam_access")
    .upsert(data, { onConflict: "user_id,exam_id" });
  
  if (error) console.error("[supabase] grantPremiumAccess error:", error.message);
}
