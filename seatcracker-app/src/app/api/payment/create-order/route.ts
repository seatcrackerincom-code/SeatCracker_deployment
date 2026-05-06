import { NextResponse } from "next/server";
import Razorpay from "razorpay";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });
    const { amount, currency = "INR", examId, userId } = await req.json();

    if (!amount || !examId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency,
      receipt: `receipt_${examId}_${userId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("[Razorpay] Create Order Error:", error);
    return NextResponse.json({ error: error.message || "Order creation failed" }, { status: 500 });
  }
}
