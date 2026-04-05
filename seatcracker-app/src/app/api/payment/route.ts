// POST /api/payment
// Creates a Razorpay order. The key_secret never leaves the server.
// Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local

import { NextRequest, NextResponse } from "next/server";

const KEY_ID = process.env.RAZORPAY_KEY_ID ?? "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";

export async function POST(req: NextRequest) {
  try {
    const { amount, userId } = await req.json();
    const amountPaise = Math.round(amount) * 100; // Razorpay uses paise

    if (!KEY_ID || !KEY_SECRET) {
      // Dev mode without real Razorpay keys — return a mock order
      return NextResponse.json({
        orderId: `mock_order_${Date.now()}`,
        key: "rzp_test_placeholder",
        amount: amountPaise,
        currency: "INR",
        note: "Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local",
      });
    }

    const credentials = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `sc_${userId || "guest"}_${Date.now()}`,
        notes: { userId: userId || "guest", product: "EAMCET_ACCESS" },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Razorpay order error:", err);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    const order = await response.json();
    return NextResponse.json({ orderId: order.id, key: KEY_ID, amount: amountPaise, currency: "INR" });
  } catch (err) {
    console.error("Payment route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
