import { NextResponse } from "next/server";
import { pradoAdmin } from "@/lib/prado";

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, password } = await request.json();

    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    let customer;
    try {
      customer = await pradoAdmin("/api/customers", {
        method: "POST",
        body: JSON.stringify({ email, firstName, lastName }),
      });
    } catch (error: any) {
      console.log("Customer creation attempt:", error.message);
    }

    const response = NextResponse.json({ message: "Success" });
    
    response.cookies.set({
      name: "alexpoeima_session",
      value: Buffer.from(JSON.stringify({ email, firstName, lastName })).toString("base64"),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
