import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // Credentials from environment variables
    const EXPECTED_EMAIL = process.env.ADMIN_EMAIL || "admin@seatcracker.com";
    const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || "seatcracker_admin_2025";

    if (email === EXPECTED_EMAIL && password === EXPECTED_PASSWORD) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid Email or Password. Please check your credentials." 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
