import { NextResponse } from "next/server";
import Razorpay from "razorpay";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "alive",
    hasKeyId: !!(process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
    hasSecret: !!(process.env.RAZORPAY_KEY_SECRET || process.env.NEXT_RAZORPAY_KEY_SECRET),
  });
}

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.NEXT_RAZORPAY_KEY_SECRET || "";

    if (!keyId || !keySecret) {
      return NextResponse.json({ 
        error: `KEYS_MISSING: (ID: ${!!keyId}, Secret: ${!!keySecret})` 
      }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { amount, currency = "INR", examId, userId } = body;

    if (!amount || !examId || !userId) {
      return NextResponse.json({ error: "PAYLOAD_MISSING" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "CRASH" }, { status: 500 });
  }
}
