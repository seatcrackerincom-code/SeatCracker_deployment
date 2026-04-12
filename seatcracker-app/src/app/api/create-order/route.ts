// POST /api/create-order
// Creates a Razorpay order using the REST API directly (no SDK, no compatibility issues).

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const KEY_ID = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  // --- Debug Logs (visible in Vercel logs) ---
  console.log("=== /api/create-order ===");
  console.log("KEY_ID:", KEY_ID ? `PRESENT (${KEY_ID.substring(0, 8)}...)` : "MISSING ❌");
  console.log("KEY_SECRET:", KEY_SECRET ? "PRESENT ✅" : "MISSING ❌");

  if (!KEY_ID || !KEY_SECRET) {
    return NextResponse.json(
      { error: "Razorpay keys not configured on server." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const amount = body.amount ?? 5;
    const userId = body.userId || "guest";
    const amountInPaise = Math.round(Number(amount) * 100);

    console.log("Amount (paise):", amountInPaise, "| UserId:", userId);

    const credentials = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `sc_${userId}_${Date.now()}`.substring(0, 40),
      }),
    });

    const text = await razorpayRes.text();
    console.log("Razorpay API Response Status:", razorpayRes.status);
    console.log("Razorpay API Response Body:", text);

    if (!razorpayRes.ok) {
      const parsed = JSON.parse(text);
      return NextResponse.json(
        { error: parsed?.error?.description || `Razorpay error: ${razorpayRes.status}` },
        { status: razorpayRes.status }
      );
    }

    const order = JSON.parse(text);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: KEY_ID,
    });
  } catch (err: any) {
    console.error("create-order catch:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
