// POST /api/payment/verify
// Verifies Razorpay payment signature and activates premium in Supabase.

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = await req.json();

    console.log("=== /api/payment/verify ===");
    console.log("order_id:", razorpay_order_id);
    console.log("payment_id:", razorpay_payment_id);
    console.log("userId:", userId);

    // 1. Verify HMAC signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    console.log("Signature valid:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // 2. Activate premium in Supabase
    if (userId && userId !== "guest" && userId !== "sc_user" && SUPABASE_URL && SUPABASE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { error } = await supabase
        .from("user_access")
        .upsert(
          {
            user_id: userId,
            is_premium: true,
            purchase_date: new Date().toISOString(),
            product_id: "EAMCET_FULL_ACCESS",
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("Supabase upsert error:", error.message);
        // Don't block — payment is verified, just log the DB error
      } else {
        console.log("Premium activated in Supabase for userId:", userId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Verify route error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
