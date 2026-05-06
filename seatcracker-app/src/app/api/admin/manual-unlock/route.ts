import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== (process.env.ADMIN_SECRET || "sc_admin_2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { adminEmail, targetUserId, targetExamId, actionType, reason, note } = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const isPremium = actionType === "grant";
    
    const { data: existing } = await supabase
      .from("user_exam_access")
      .select("id")
      .eq("user_id", targetUserId)
      .eq("exam_id", targetExamId)
      .single();

    if (existing) {
      await supabase
        .from("user_exam_access")
        .update({
          is_premium: isPremium,
          payment_id: isPremium ? `MANUAL_GRANT_${Date.now()}` : null,
          amount_paid: isPremium ? 0 : null,
          purchased_at: isPremium ? new Date().toISOString() : null
        })
        .eq("id", existing.id);
    } else if (isPremium) {
      await supabase
        .from("user_exam_access")
        .insert({
          user_id: targetUserId,
          exam_id: targetExamId,
          is_premium: true,
          payment_id: `MANUAL_GRANT_${Date.now()}`,
          amount_paid: 0,
          purchased_at: new Date().toISOString()
        });
    }

    await supabase
      .from("admin_actions")
      .insert({
        admin_email: adminEmail || "unknown",
        action_type: actionType,
        target_user_id: targetUserId,
        target_exam_id: targetExamId,
        reason: reason || "",
        note: note || ""
      });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
