import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendEmail, DEFAULT_FROM_EMAIL } from "@/lib/resend";
import { pradoAdmin } from "@/lib/prado";

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("alexpoeima_session");

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { message: "Unauthorized: No active session found" },
        { status: 401 }
      );
    }

    let sessionData: any = {};
    try {
      sessionData = JSON.parse(
        Buffer.from(sessionCookie.value, "base64").toString("utf-8")
      );
    } catch {
      sessionData = {};
    }

    const { email, firstName } = sessionData;

    // 1. Delete Customer record from Prado Commerce backend
    if (email) {
      try {
        const customers = await pradoAdmin(`/api/customers?email=${encodeURIComponent(email)}`);
        if (Array.isArray(customers) && customers.length > 0) {
          for (const cust of customers) {
            if (cust.id) {
              await pradoAdmin(`/api/customers/${cust.id}`, { method: "DELETE" });
            }
          }
        }
      } catch (pradoErr: any) {
        console.log("[Delete Account] Prado customer removal notice:", pradoErr.message || pradoErr);
      }
    }

    // 2. Send Account Deletion Confirmation Email via Resend
    if (email) {
      try {
        await sendEmail({
          to: email,
          from: DEFAULT_FROM_EMAIL,
          subject: "Account Deletion Confirmation - Alexpoeima Fine Art",
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #18181b; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 28px; font-weight: 700; tracking-tight: -0.02em; margin: 0 0 8px 0; color: #09090b;">ALEXPOEIMA</h1>
                <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin: 0;">Fine Art & Commerce</p>
              </div>
              
              <div style="border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; padding: 24px 0; margin-bottom: 32px;">
                <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">Account Deleted</h2>
                <p style="font-size: 15px; line-height: 1.6; color: #3f3f46; margin: 0 0 16px 0;">
                  Hello ${firstName || "Valued Customer"}, your account on Alexpoeima Fine Art has been successfully deleted upon your request.
                </p>
                <p style="font-size: 14px; line-height: 1.6; color: #71717a; margin: 0;">
                  Your login credentials and active browser sessions have been cleared. Should you wish to make future purchases, you are welcome to register a new buyer account at any time.
                </p>
              </div>

              <div style="font-size: 13px; color: #a1a1aa; text-align: center; border-top: 1px solid #f4f4f5; padding-top: 24px;">
                <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} Alexpoeima Art. All rights reserved.</p>
                <p style="margin: 0;">If you did not request this deletion, please contact support immediately.</p>
              </div>
            </div>
          `,
          text: `Hello ${firstName || "Valued Customer"},\n\nYour account at Alexpoeima Fine Art has been successfully deleted. Your active sessions have been removed.\n\nBest regards,\nAlexpoeima Fine Art`,
        });
      } catch (emailErr: any) {
        console.error("[Delete Account] Confirmation email dispatch error:", emailErr.message || emailErr);
      }
    }


    // Delete session cookie
    cookieStore.delete("alexpoeima_session");

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("[Delete Account API Error]:", error);
    return NextResponse.json(
      { message: "Internal server error deleting account" },
      { status: 500 }
    );
  }
}
