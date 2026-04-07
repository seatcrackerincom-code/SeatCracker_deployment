// POST /api/admin/register-user
// Called on every successful login to ensure the user exists in the `users` table.
// Does NOT overwrite is_premium — safe to call repeatedly.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId || userId === "guest" || userId === "sc_user") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Only insert if not already present — do NOT overwrite premium status
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existing) {
      const { error } = await supabase.from("users").insert({
        id:            userId,
        is_premium:    false,
        purchase_date: null,
        plan:          null,
      });
      if (error) console.error("[register-user] insert error:", error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
