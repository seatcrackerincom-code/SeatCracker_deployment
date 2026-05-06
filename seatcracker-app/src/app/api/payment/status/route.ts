import { NextResponse } from "next/server";
import { checkUserAccess } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const examId = searchParams.get("examId");

  if (!userId || !examId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const access = await checkUserAccess(userId, examId);

  return NextResponse.json({
    isPremium: access?.is_premium || false,
    purchasedAt: access?.purchased_at || null,
  });
}
