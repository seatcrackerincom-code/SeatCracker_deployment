import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  try {
    // 1. Debug Logs
    console.log("--- RAZORPAY DEBUG ---");
    console.log("RAZORPAY_KEY_ID:", KEY_ID ? "PRESENT ✅" : "MISSING ❌");
    console.log("RAZORPAY_KEY_SECRET:", KEY_SECRET ? "PRESENT ✅" : "MISSING ❌");

    if (!KEY_ID || !KEY_SECRET) {
      console.error("Razorpay environment variables are undefined.");
      return NextResponse.json(
        { error: "Razorpay keys not configured on server." },
        { status: 500 }
      );
    }

    const { amount, userId } = await req.json();
    const amountInPaise = Math.round(amount * 100);

    // 2. Initialize instance
    const instance = new Razorpay({
      key_id: KEY_ID,
      key_secret: KEY_SECRET,
    });

    // 3. Create Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_rcpt_${userId || "guest"}_${Date.now()}`,
    };

    console.log("Creating Razorpay order with options:", options);
    const order = await instance.orders.create(options);

    // 4. Return Response
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: KEY_ID, // Frontend needs the ID for the modal
    });
  } catch (err: any) {
    console.error("Razorpay Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
