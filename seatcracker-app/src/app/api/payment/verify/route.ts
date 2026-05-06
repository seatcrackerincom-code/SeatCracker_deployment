import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import crypto from "crypto";
import { grantPremiumAccess } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature, 
      examId, 
      userId,
      amount 
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Payment verified, grant access in Supabase
    await grantPremiumAccess({
      user_id: userId,
      exam_id: examId,
      is_premium: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      amount_paid: amount,
      purchased_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Payment verified and access granted" });
  } catch (error: any) {
    console.error("[Razorpay] Verify Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Verification failed" }, { status: 500 });
  }
}
