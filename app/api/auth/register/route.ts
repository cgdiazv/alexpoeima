import { NextResponse } from "next/server";
import { pradoAdmin } from "@/lib/prado";

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Attempt to create customer in Prado Commerce
    // If the customer already exists, Prado API might return 400 or 409, 
    // or we might need to fetch the customer first. 
    // For simplicity, we just try to create.
    let customer;
    try {
      customer = await pradoAdmin("/api/customers", {
        method: "POST",
        body: JSON.stringify({ email, firstName, lastName }),
      });
    } catch (error: any) {
      // If customer exists, we just ignore the error for this simple implementation
      // and assume they are "logged in". 
      // Ideally, we would fetch the existing customer.
      console.log("Customer creation failed (might already exist):", error.message);
    }

    const response = NextResponse.json({ message: "Success" });
    
    // Set a simple, insecure cookie for demo purposes
    // In production, use NextAuth or JWTs.
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
