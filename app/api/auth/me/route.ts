import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pradoAdmin } from "@/lib/prado";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("alexpoeima_session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ loggedIn: false });
    }

    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    );

    let orders: any[] = [];


    try {
      if (sessionData.email) {
        const res = await pradoAdmin(`/api/orders?email=${encodeURIComponent(sessionData.email)}`);
        if (Array.isArray(res)) {
          orders = res;
        } else if (res?.data && Array.isArray(res.data)) {
          orders = res.data;
        }
      }
    } catch (err: any) {
      console.log("Orders fetch error:", err.message);
    }

    return NextResponse.json({
      loggedIn: true,
      user: sessionData,
      orders,
    });
  } catch (error) {
    console.error("Auth Me Error:", error);
    return NextResponse.json({ loggedIn: false });
  }
}
