import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret_placeholder";

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Connect to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Record payment
    const { error: paymentError } = await supabase.from("payments").insert({
      user_id: userId,
      amount: 39,
      status: "success",
      transaction_id: razorpay_payment_id,
      created_at: new Date().toISOString()
    });

    if (paymentError) console.error("Payment insert error:", paymentError);

    // Update user to premium
    const { error: userError } = await supabase
      .from("users")
      .update({
        is_premium: true,
        plan: "JEE_ADVANCED",
        purchase_date: new Date().toISOString()
      })
      .eq("id", userId);

    if (userError) console.error("User update error:", userError);
    
    // ALSO update user_exam_access table for specific exam access checks
    const { error: accessError } = await supabase
      .from("user_exam_access")
      .upsert({
        user_id: userId,
        exam_id: "jee-advanced",
        is_premium: true,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount_paid: 39,
        purchased_at: new Date().toISOString()
      }, { onConflict: "user_id,exam_id" });

    if (accessError) console.error("Access record error:", accessError);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
