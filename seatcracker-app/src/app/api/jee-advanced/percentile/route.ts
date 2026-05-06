import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = supabaseUrl.startsWith("http") && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * POST /api/jee-advanced/percentile
 * Body: { dayNumber: number, userId: string }
 * 
 * Calculates percentile for a specific student on a specific day
 * using the NTA Standard Formula against all students.
 */
export async function POST(req: Request) {
  try {
    const { dayNumber, userId } = await req.json();

    if (!dayNumber || !userId) {
      return NextResponse.json(
        { error: "Missing dayNumber or userId" },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 503 }
      );
    }

    // Fetch all students' scores for this day
    const { data: allScores, error: scoresError } = await supabase
      .from("jee_results")
      .select("user_id, grand_total, physics_total, chemistry_total, maths_total")
      .eq("day_number", dayNumber);

    if (scoresError) {
      console.error("[percentile] fetch error:", scoresError.message);
      return NextResponse.json(
        { error: "Failed to fetch scores" },
        { status: 500 }
      );
    }

    if (!allScores || allScores.length === 0) {
      return NextResponse.json({
        overall: 100.00,
        physics: 100.00,
        chemistry: 100.00,
        maths: 100.00,
        rankEstimate: 1,
        totalStudents: 1,
      });
    }

    // Find this student's scores
    const studentData = allScores.find((s) => s.user_id === userId);
    if (!studentData) {
      return NextResponse.json(
        { error: "Student result not found" },
        { status: 404 }
      );
    }

    const totalStudents = allScores.length;

    // NTA Formula: percentile = (students scoring <= this student / total) * 100
    const calcPercentile = (studentScore: number, allValues: number[]) => {
      if (allValues.length <= 1) return 100.00;
      const equalOrBelow = allValues.filter((s) => s <= studentScore).length;
      return Math.round((equalOrBelow / allValues.length) * 10000) / 100;
    };

    const overall = calcPercentile(
      studentData.grand_total,
      allScores.map((s) => s.grand_total)
    );
    const physics = calcPercentile(
      studentData.physics_total,
      allScores.map((s) => s.physics_total)
    );
    const chemistry = calcPercentile(
      studentData.chemistry_total,
      allScores.map((s) => s.chemistry_total)
    );
    const maths = calcPercentile(
      studentData.maths_total,
      allScores.map((s) => s.maths_total)
    );

    // Rank = number of students who scored higher + 1
    const studentsAbove = allScores.filter(
      (s) => s.grand_total > studentData.grand_total
    ).length;
    const rankEstimate = studentsAbove + 1;

    // Update the student's result row with new percentile
    await supabase
      .from("jee_results")
      .update({
        overall_percentile: overall,
        physics_percentile: physics,
        chemistry_percentile: chemistry,
        maths_percentile: maths,
        rank_estimate: rankEstimate,
      })
      .eq("user_id", userId)
      .eq("day_number", dayNumber);

    return NextResponse.json({
      overall,
      physics,
      chemistry,
      maths,
      rankEstimate,
      totalStudents,
    });
  } catch (err) {
    console.error("[percentile] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
