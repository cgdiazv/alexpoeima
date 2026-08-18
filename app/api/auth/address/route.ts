import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("alexpoeima_session");

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in first" },
        { status: 401 }
      );
    }

    const { address1, address2, city, state, postalCode, country } = await request.json();

    if (!address1 || !city || !state || !postalCode || !country) {
      return NextResponse.json(
        { message: "Address line 1, city, state, postal code, and country are required" },
        { status: 400 }
      );
    }

    let existingSession: any = {};
    try {
      existingSession = JSON.parse(
        Buffer.from(sessionCookie.value, "base64").toString("utf-8")
      );
    } catch {
      existingSession = {};
    }

    const newAddress = {
      address1,
      address2: address2 || "",
      city,
      state,
      postalCode,
      country,
    };

    const updatedSession = {
      ...existingSession,
      address: newAddress,
    };

    const response = NextResponse.json({
      message: "Shipping address updated successfully",
      address: newAddress,
      user: updatedSession,
    });

    response.cookies.set({
      name: "alexpoeima_session",
      value: Buffer.from(JSON.stringify(updatedSession)).toString("base64"),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error: any) {
    console.error("[Address API Error]:", error);
    return NextResponse.json(
      { message: "Internal server error updating address" },
      { status: 500 }
    );
  }
}
