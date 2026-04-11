import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Expert EAMCET planner. Output JSON: {"roadmap": [Day0, Day1, ...]}.
RULES:
1. Engineering (MPC): 4 tasks/day. Order: Math(33% time), Phys(25%), Chem(25%), Math(17%).
2. Ag/Pharmacy (BiPC): 4 tasks/day. Order: Botany(25%), Zoo(25%), Phys(25%), Chem(25%).
3. Assign incomplete topics from Syllabus. Max 2h/task. Group small topics with " + ".
4. Day 0: Include ALL 'Completed Topics' with time:"0h (Done)", completed:true.
5. Strategy 'good_score': Heavy priority on High/Med; skip Low if time insufficient. 'full': include all.
6. Generate EXACTLY total_days in the array. If you run out of syllabus topics, pad remaining days with topic "Practise high, med, low priority questions" under subject "Practice".`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { syllabus, total_days, daily_hours, priority_order, course, strategy, completed_topics } = body;

    if (!syllabus || !total_days || !daily_hours || !priority_order || !course) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const keys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4
    ].filter(Boolean);

    if (keys.length === 0) {
      return NextResponse.json({ error: "Missing GROQ API Keys in env" }, { status: 500 });
    }

    const userMessage = `Generate a day-wise roadmap with these inputs:
Course: ${course}
Strategy: ${strategy === 'good_score' ? 'Good Score (Drop low priority if tight time)' : 'Full Syllabus'}
Total days: ${total_days} (CRITICAL: YOU MUST GENERATE EXACTLY ${total_days} DAYS IN THE ARRAY. DO NOT STOP EARLY!)
Daily study hours: ${daily_hours}
Priority order: ${JSON.stringify(priority_order)}
Completed Topics: ${JSON.stringify(completed_topics || [])}

Syllabus:
${JSON.stringify(syllabus)}
`;

    let groqRes;
    let lastError = "";

    // FAILOVER LOOP: Try each key sequentially if we hit limits
    for (let i = 0; i < keys.length; i++) {
      const apiKey = keys[i];
      try {
        groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: SYSTEM_PROMPT + "\n\nCRITICAL: Return a JSON object with a 'roadmap' key containing the array." },
              { role: "user", content: userMessage },
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
            max_tokens: 4000,
          }),
        });

        // SUCCESS
        if (groqRes.ok) break;

        // RETRYABLE ERROR? (Rate limit, size error on this tier, or server error)
        if (groqRes.status === 429 || groqRes.status === 400 || groqRes.status >= 500) {
          const errBody = await groqRes.json().catch(() => ({}));
          lastError = `Key ${i + 1} failed (${groqRes.status}): ${errBody.error?.message || "Unknown"}`;
          console.warn(lastError);
          // Only retry if it's a rate/size limit or server error
          continue; 
        }

        // NON-RETRYABLE ERROR
        const errText = await groqRes.text();
        return NextResponse.json({ error: `AI error: ${errText}` }, { status: groqRes.status });

      } catch (err: any) {
        lastError = `Exception with Key ${i + 1}: ${err.message}`;
        console.error(lastError);
        continue;
      }
    }

    if (!groqRes || !groqRes.ok) {
      return NextResponse.json({ error: "All 4 API keys reached limits. Please try again later." }, { status: 502 });
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
