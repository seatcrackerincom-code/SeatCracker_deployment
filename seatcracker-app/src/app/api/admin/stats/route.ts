// GET /api/admin/stats
// Returns aggregate platform metrics: total users, premium users, total revenue.
// Protected by ADMIN_SECRET header — never expose this key client-side.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL    = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const ADMIN_SECRET    = process.env.ADMIN_SECRET || "sc_admin_2024";

export async function GET(req: NextRequest) {
  // ── Auth guard ────────────────────────────────────────
  const secret = req.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // Total users
    const { count: totalUsers, error: e1 } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Premium users
    const { count: premiumUsers, error: e2 } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_premium", true);

    // Total revenue — sum of successful payments
    const { data: payments, error: e3 } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "success");

    const totalRevenue = payments
      ? payments.reduce((sum, p) => sum + (p.amount || 0), 0)
      : 0;

    // Users joined today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: usersJoinedToday, error: eToday } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    // Recent 20 payments
    const { data: recentPayments, error: e4 } = await supabase
      .from("payments")
      .select("user_id, amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    // Recent 20 users
    const { data: recentUsers, error: e5 } = await supabase
      .from("users")
      .select("id, is_premium, purchase_date, plan, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (e1 || e2 || e3 || e4 || e5 || eToday) {
      console.error("[admin/stats] errors:", { e1, e2, e3, e4, e5, eToday });
    }

    return NextResponse.json({
      totalUsers:       totalUsers ?? 0,
      premiumUsers:     premiumUsers ?? 0,
      totalRevenue,
      usersJoinedToday: usersJoinedToday ?? 0,
      recentPayments:   recentPayments ?? [],
      recentUsers:      recentUsers ?? [],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    console.error("[admin/stats] catch:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
