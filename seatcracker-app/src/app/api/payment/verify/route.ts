// POST /api/payment/verify
// Verifies Razorpay payment signature server-side.

import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = await req.json();

    if (!KEY_SECRET) {
      // Dev mode — auto-approve
      return NextResponse.json({ success: true, dev: true });
    }

    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(message)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Signature mismatch" }, { status: 400 });
    }

    // Signature valid — caller (client) will activate premium via access.ts
    return NextResponse.json({ success: true, userId });
  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
