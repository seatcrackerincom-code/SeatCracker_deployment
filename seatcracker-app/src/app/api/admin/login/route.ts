import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();
    const ADMIN_SECRET = process.env.ADMIN_SECRET || "seatcracker_admin_2025";

    if (secret === ADMIN_SECRET) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid Secret Key" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
