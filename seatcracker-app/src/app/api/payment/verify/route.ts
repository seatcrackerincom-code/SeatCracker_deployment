// POST /api/payment/verify
// Verifies Razorpay payment signature server-side and ACTIVATES premium status.

import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import { supabase } from "@/lib/supabase";

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
      console.warn("RAZORPAY_KEY_SECRET is missing. Payment verification skipped (Dev Mode).");
      return NextResponse.json({ success: true, dev: true });
    }

    // 1. Verify Signature
    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(message)
      .digest("hex");

    if (expected !== razorpay_signature) {
      console.error("Signature mismatch. Payment verification failed.");
      return NextResponse.json({ success: false, error: "Signature mismatch" }, { status: 400 });
    }

    // 2. Signature valid -> ACTIVATE PREMIUM in Supabase
    if (supabase && userId) {
      const { error } = await supabase
        .from("user_access")
        .upsert({ 
          user_id: userId, 
          is_premium: true, 
          purchase_date: new Date().toISOString(),
          product_id: "EAMCET_FULL_ACCESS" // Tagged specifically for EAMCET
        }, { onConflict: "user_id" });

      if (error) {
        console.error("Database activation error:", error);
        return NextResponse.json({ success: false, error: "Failed to update access record" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, userId });
  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
