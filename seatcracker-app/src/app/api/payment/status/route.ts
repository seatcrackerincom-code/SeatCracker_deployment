import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const examId = searchParams.get("examId");

  if (!userId || !examId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. Check exam-specific access
  const { data: access } = await supabase
    .from("user_exam_access")
    .select("*")
    .eq("user_id", userId)
    .eq("exam_id", examId)
    .single();

  let isPremium = access?.is_premium || false;
  let purchasedAt = access?.purchased_at || null;

  // 2. Fallback: Check the main 'users' table (especially for users who bought before the multi-exam split)
  if (!isPremium) {
    const { data: user } = await supabase
      .from("users")
      .select("is_premium, purchase_date, plan")
      .eq("id", userId)
      .single();
    
    if (user?.is_premium && (user.plan === "JEE_ADVANCED" || examId === "eamcet")) {
      isPremium = true;
      purchasedAt = user.purchase_date;
    }
  }

  return NextResponse.json({
    isPremium,
    purchasedAt,
  });
}
