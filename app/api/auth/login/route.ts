import { NextResponse } from "next/server";
import { pradoAdmin } from "@/lib/prado";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    let customer = null;
    try {
      const customers = await pradoAdmin(`/api/customers?email=${encodeURIComponent(email)}`);
      if (Array.isArray(customers) && customers.length > 0) {
        customer = customers[0];
      }
    } catch (error: any) {
      console.log("Customer fetch attempt:", error.message);
    }

    const firstName = customer?.firstName || customer?.first_name || "";
    const lastName = customer?.lastName || customer?.last_name || "";

    const response = NextResponse.json({ message: "Success", customer });


    response.cookies.set({
      name: "alexpoeima_session",
      value: Buffer.from(JSON.stringify({ email, firstName, lastName })).toString("base64"),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
