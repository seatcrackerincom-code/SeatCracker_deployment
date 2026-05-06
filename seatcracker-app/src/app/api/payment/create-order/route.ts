import { NextResponse } from "next/server";
import Razorpay from "razorpay";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    const { amount, currency = "INR", examId, userId } = await req.json();
    console.log("[Razorpay] Received Request:", { amount, examId, userId });

    if (!amount || !examId || !userId) {
      console.error("[Razorpay] Missing Fields");
      return NextResponse.json({ error: "Missing required fields (amount, examId, or userId)" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("[Razorpay] Missing API Keys in Environment");
      return NextResponse.json({ error: "Razorpay API keys are not configured on the server." }, { status: 500 });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: `receipt_${examId}_${userId}_${Date.now()}`,
    };

    console.log("[Razorpay] Creating Order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("[Razorpay] Order Created Successfully:", order.id);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId
    });
  } catch (error: any) {
    console.error("[Razorpay] Order Creation Crash:", error);
    return NextResponse.json({ 
      error: error.message || "Order creation failed",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
