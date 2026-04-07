// POST /api/admin/register-user
// 1. Ensures user exists in `users` table
// 2. Saves/Updates user's persistent progress (step, exam, course)
// 3. Returns the saved state for session resume

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { userId, last_step, exam, course } = await req.json();

    if (!userId || userId === "guest" || userId === "sc_user") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ ok: true, error: "Env missing" });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // ── Upsert user progress ─────────────────────────────────
    // We use `upsert` with `onConflict: 'id'`. 
    // IMPORTANT: We do NOT include is_premium in the upsert if the user already exists 
    // to prevent accidentally resetting their paid status.
    
    // First, check if they exist
    const { data: existing, error: fetchErr } = await supabase
      .from("users")
      .select("id, last_step, exam, course, is_premium")
      .eq("id", userId)
      .single();

    if (fetchErr && fetchErr.code !== "PGRST116") {
      throw fetchErr;
    }

    let finalData;

    if (!existing) {
      // New user registration
      const { data, error } = await supabase
        .from("users")
        .insert({
          id: userId,
          last_step: last_step || 1,
          exam: exam || null,
          course: course || null,
          is_premium: false,
        })
        .select()
        .single();
      
      if (error) throw error;
      finalData = data;
    } else {
      // Update existing user progress
      // Only update if new values are provided
      const updateObj: any = {};
      if (last_step !== undefined) updateObj.last_step = last_step;
      if (exam !== undefined)      updateObj.exam = exam;
      if (course !== undefined)    updateObj.course = course;

      if (Object.keys(updateObj).length > 0) {
        const { data, error } = await supabase
          .from("users")
          .update(updateObj)
          .eq("id", userId)
          .select()
          .single();
        
        if (error) throw error;
        finalData = data;
      } else {
        finalData = existing;
      }
    }

    return NextResponse.json({
      ok: true,
      state: {
        last_step: finalData.last_step,
        exam:      finalData.exam,
        course:    finalData.course,
        is_premium: finalData.is_premium,
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    console.error("[register-user] error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
