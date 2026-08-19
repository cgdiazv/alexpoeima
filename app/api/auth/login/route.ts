import { NextResponse } from "next/server";
import { pradoClient } from "@/lib/prado";
import { isAccountDeleted } from "@/lib/deletedAccounts";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (isAccountDeleted(email)) {
      return NextResponse.json(
        { message: "This account has been deleted. Please register a new account if you wish to shop with us." },
        { status: 401 }
      );
    }

    const storeId = process.env.NEXT_PUBLIC_PRADO_STORE_ID;

    let customer = null;
    try {
      const pradoRes = await pradoClient("/api/storefront/auth", {
        method: "POST",
        body: JSON.stringify({
          storeId,
          email,
          password,
        }),
      });

      if (pradoRes?.customer) {
        customer = pradoRes.customer;
      } else if (pradoRes?.error) {
        return NextResponse.json(
          { message: pradoRes.error },
          { status: 401 }
        );
      }
    } catch (error: any) {
      console.error("[Login] Prado customer auth error:", error.message || error);
      return NextResponse.json(
        { message: error.message || "Invalid email or password" },
        { status: 401 }
      );
    }

    const firstName = customer?.firstName || customer?.first_name || "";
    const lastName = customer?.lastName || customer?.last_name || "";

    const response = NextResponse.json({ message: "Success", customer });

    response.cookies.set({
      name: "alexpoeima_session",
      value: Buffer.from(JSON.stringify({ 
        id: customer?.id, 
        email: customer?.email || email, 
        firstName, 
        lastName 
      })).toString("base64"),
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

