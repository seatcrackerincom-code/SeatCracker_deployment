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
    
    // Define "live" as active in the last 15 minutes
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    let query = supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gt("last_active", fifteenMinsAgo);
    
    if (exam) {
      if (exam === "JEE") {
        query = query.eq("exam", "JEE");
      } else if (exam === "EAMCET") {
        query = query.in("exam", ["AP", "TS", "EAMCET"]);
      }
    }

    const { count, error } = await query;
    if (error) throw error;

    // Add a base offset to make it look "populated" if there are few real users, 
    // but keep it proportional to real activity.
    // However, the user said "real counting not dummy", so I will stick to real count 
    // but maybe add a small "guest" factor if they want.
    // Let's stick to real count for now.
    
    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("Live Count Error:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
