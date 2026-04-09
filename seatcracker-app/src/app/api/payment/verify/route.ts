// POST /api/payment/verify
// 1. Verifies Razorpay HMAC signature
// 2. Activates premium in user_access (existing)
// 3. Upserts into `users` table (analytics)
// 4. Inserts into `payments` table (revenue tracking)
// Backend-only — never trust the frontend for premium activation.

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const KEY_SECRET  = process.env.RAZORPAY_KEY_SECRET!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount = 149,
    } = await req.json();

    console.log("=== /api/payment/verify ===");
    console.log("order_id:",   razorpay_order_id);
    console.log("payment_id:", razorpay_payment_id);
    console.log("userId:",     userId);

    // ── 1. Verify HMAC signature ──────────────────────────
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSig === razorpay_signature;
    console.log("Signature valid:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // ── 2–4. Supabase writes (after signature verified) ───
    const isRealUser =
      userId && userId !== "guest" && userId !== "sc_user";

    if (isRealUser && SUPABASE_URL && SUPABASE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const now = new Date().toISOString();

      // 2. Activate premium in legacy user_access table
      const { error: accessErr } = await supabase
        .from("user_access")
        .upsert(
          {
            user_id:       userId,
            is_premium:    true,
            purchase_date: now,
            product_id:    "EAMCET_FULL_ACCESS",
          },
          { onConflict: "user_id" }
        );
      if (accessErr) console.error("user_access upsert error:", accessErr.message);

      // 3. Upsert analytics `users` table
      const { error: userErr } = await supabase
        .from("users")
        .upsert(
          {
            id:            userId,
            is_premium:    true,
            purchase_date: now,
            plan:          "EAMCET_FULL_ACCESS",
          },
          { onConflict: "id" }
        );
      if (userErr) console.error("users upsert error:", userErr.message);
      else console.log("users table updated for:", userId);

      // 4. Insert payment record
      const { error: payErr } = await supabase.from("payments").insert({
        user_id:    userId,
        amount:     Number(amount),
        status:     "success",
      });
      if (payErr) console.error("payments insert error:", payErr.message);
      else console.log("Payment record inserted — amount:", amount);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    console.error("Verify route error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
