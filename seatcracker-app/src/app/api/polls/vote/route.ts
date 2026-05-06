import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pollId = searchParams.get("pollId");

  if (!pollId) return NextResponse.json({ error: "pollId required" }, { status: 400 });
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: poll, error: pollError } = await supabase.from("polls").select("*").eq("id", pollId).single();
  if (pollError || !poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });

  const { data: votes, error: voteError } = await supabase.from("poll_votes").select("selected_option").eq("poll_id", pollId);
  if (voteError) return NextResponse.json({ error: voteError.message }, { status: 500 });

  const results = poll.options.map((opt: any, idx: number) => ({
    ...opt,
    votes: votes.filter((v: any) => v.selected_option === idx).length
  }));

  return NextResponse.json({ poll: { ...poll, results, totalVotes: votes.length } });
}

export async function POST(req: Request) {
  const { pollId, userId, optionIdx } = await req.json();
  if (!pollId || !userId || optionIdx === undefined) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { error } = await supabase.from("poll_votes").insert({
    poll_id: pollId,
    user_id: userId,
    selected_option: optionIdx
  });

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: "Already voted" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
