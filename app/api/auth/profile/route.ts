import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pradoAdmin } from "@/lib/prado";

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

    const { firstName, lastName, email } = await request.json();

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { message: "First name, last name, and email are required" },
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

    const updatedSession = {
      ...existingSession,
      firstName,
      lastName,
      email,
    };

    // Sync profile updates with Prado Commerce Customer if available
    try {
      if (existingSession.email) {
        const customers = await pradoAdmin(
          `/api/customers?email=${encodeURIComponent(existingSession.email)}`
        );
        if (Array.isArray(customers) && customers.length > 0) {
          const customerId = customers[0].id;
          await pradoAdmin(`/api/customers/${customerId}`, {
            method: "PATCH",
            body: JSON.stringify({
              firstName,
              lastName,
              first_name: firstName,
              last_name: lastName,
              email,
              name: `${firstName} ${lastName}`.trim(),
            }),
          });
        }
      }
    } catch (pradoErr: any) {
      console.log("[Profile API] Prado customer sync notice:", pradoErr.message || pradoErr);
    }

    const response = NextResponse.json({
      message: "Profile updated successfully",
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
    console.error("[Profile API Error]:", error);
    return NextResponse.json(
      { message: "Internal server error updating profile" },
      { status: 500 }
    );
  }
}
