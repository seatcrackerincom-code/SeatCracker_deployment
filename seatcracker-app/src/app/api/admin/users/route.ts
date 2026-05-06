import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== (process.env.ADMIN_SECRET || "sc_admin_2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ users: [] });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Search by ID since email is rarely saved in users directly without admin role lookup, 
  // but let's try querying by id or email if the column exists
  let queryBuilder = supabase.from("users").select("*");
  
  // Try ID first
  const { data: users, error } = await queryBuilder.ilike("id", `%${query}%`).limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get access for these users
  const enriched = await Promise.all(users.map(async (u: any) => {
    const { data: accessData } = await supabase
      .from("user_exam_access")
      .select("exam_id, is_premium")
      .eq("user_id", u.id);
      
    const access: any = {};
    if (accessData) {
      accessData.forEach((a: any) => {
        access[a.exam_id] = a.is_premium;
      });
    }
    
    return { ...u, access };
  }));

  return NextResponse.json({ users: enriched });
}
