import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are an expert EAMCET preparation planner.

Generate a JSON object containing a 'roadmap' key which maps to an array of day objects.

---
STRICT RULES:

1. SUBJECT DISTRIBUTION & DAILY STRUCTURE:
If Engineering (MPC): Create EXACTLY 4 tasks per day.
Order and ratios: Mathematics (33.3% time), Physics (25% time), Chemistry (25% time), Mathematics (16.7% time).
Total Maths = 50%.

If Agriculture / Pharmacy (BiPC): Create EXACTLY 4 tasks per day.
Order and ratios: Botany (25%), Zoology (25%), Physics (25%), Chemistry (25%).

2. TOPIC HANDLING:
* Pick incomplete topics sequentially from the provided syllabus list
* Group small topics if needed using " + "
* NEVER assign >2h to a single task slot

3. COMPLETED TOPICS (CRITICAL):
You will receive a list of completed_topics strings ("Subject::Topic").
Remove these from the main scheduling pool.
Instead, create a special Day 0 object before Day 1:
{
  "day": 0,
  "tasks": [
    { "subject": "Subject", "topic": "Topic Name", "priority": "High/Med/Low", "time": "0h (Done)", "completed": true }
  ]
}

4. STRATEGY EXECUTION:
* If Strategy = 'good_score', prioritize High and Medium yield topics heavily. Skip Low priority topics entirely if the time available is insufficient.
* If Strategy = 'full', cram everything in, but respect the daily sequence.

5. FORMAT RESPONSE STRICTLY IN JSON matching the rules above.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { syllabus, total_days, daily_hours, priority_order, course, strategy, completed_topics } = body;

    if (!syllabus || !total_days || !daily_hours || !priority_order || !course) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const userMessage = `Generate a day-wise roadmap with these inputs:
Course: ${course}
Strategy: ${strategy === 'good_score' ? 'Good Score (Drop low priority if tight time)' : 'Full Syllabus'}
Total days: ${total_days}
Daily study hours: ${daily_hours}
Priority order: ${JSON.stringify(priority_order)}
Completed Topics: ${JSON.stringify(completed_topics || [])}

Syllabus:
${JSON.stringify(syllabus)}
`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + "\n\nCRITICAL: Return a JSON object with a 'roadmap' key containing the array." },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 8000,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq error:", errText);
      return NextResponse.json({ error: "AI service error. Try again." }, { status: 502 });
    }

    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      console.error("JSON parse failed:", rawContent.slice(0, 500));
      return NextResponse.json({ error: "AI returned invalid format. Please retry." }, { status: 422 });
    }

    const roadmap = parsed.roadmap || parsed;
    return NextResponse.json({ roadmap });
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
