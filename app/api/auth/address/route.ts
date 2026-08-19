import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pradoClient } from "@/lib/prado";

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

    // Sync address update with Prado Commerce
    try {
      const storeId = process.env.NEXT_PUBLIC_PRADO_STORE_ID;
      if (existingSession.email && storeId) {
        await pradoClient("/api/storefront/auth", {
          method: "POST",
          body: JSON.stringify({
            storeId,
            email: existingSession.email,
            address: newAddress,
            action: "update",
          }),
        }).catch((err) => console.log("[Address API] Prado sync notice:", err.message));
      }
    } catch (pradoErr: any) {
      console.log("[Address API] Error syncing address to Prado Commerce:", pradoErr.message || pradoErr);
    }

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
