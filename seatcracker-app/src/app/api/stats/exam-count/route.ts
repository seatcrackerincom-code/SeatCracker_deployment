import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get("exam");

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ count: 0 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    let query = supabase.from("users").select("*", { count: "exact", head: true });
    
    if (exam) {
      if (exam === "EAMCET") {
        query = query.in("exam", ["AP", "TS"]);
      } else {
        query = query.eq("exam", exam);
      }
    }

    const { count, error } = await query;
    if (error) throw error;

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("Exam Count Error:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
