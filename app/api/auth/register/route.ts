import { NextResponse } from "next/server";
import { pradoClient } from "@/lib/prado";
import { sendEmail, DEFAULT_FROM_EMAIL } from "@/lib/resend";
import { unmarkAccountDeleted } from "@/lib/deletedAccounts";

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

    const storeId = process.env.NEXT_PUBLIC_PRADO_STORE_ID;

    // 1. Create Customer in Prado Commerce Storefront Database
    let customer = null;
    try {
      const pradoRes = await pradoClient("/api/storefront/auth", {
        method: "POST",
        body: JSON.stringify({
          storeId,
          email,
          password,
          firstName,
          lastName,
          action: "signup",
        }),
      });

      if (pradoRes?.customer) {
        customer = pradoRes.customer;
        unmarkAccountDeleted(email);
        console.log("[Register] Prado Customer created successfully:", customer.id);
      } else if (pradoRes?.error) {
        return NextResponse.json(
          { message: pradoRes.error },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error("[Register] Customer creation error in Prado Commerce:", error.message || error);
      return NextResponse.json(
        { message: error.message || "Failed to create account in Prado Commerce" },
        { status: 400 }
      );
    }

    // 2. Send Welcome Email to Buyer via Resend
    try {
      const emailResult = await sendEmail({
        to: email,
        from: DEFAULT_FROM_EMAIL,
        subject: "Welcome to Alexpoeima Fine Art!",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #18181b; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 28px; font-weight: 700; tracking-tight: -0.02em; margin: 0 0 8px 0; color: #09090b;">ALEXPOEIMA</h1>
              <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin: 0;">Fine Art & Commerce</p>
            </div>
            
            <div style="border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; padding: 24px 0; margin-bottom: 32px;">
              <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">Welcome, ${firstName}!</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #3f3f46; margin: 0 0 16px 0;">
                Thank you for registering your buyer account with Alexpoeima Fine Art. We're thrilled to have you as part of our creative community.
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #3f3f46; margin: 0;">
                From your account dashboard, you can track order status, manage your saved shipping details, and view your purchase history for fine art pieces, original paintings, prints, and live event bookings.
              </p>
            </div>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="https://www.alexpoeima.com/account" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; transition: background-color 0.2s;">
                View Your Account
              </a>
            </div>

            <div style="font-size: 13px; color: #a1a1aa; text-align: center; border-top: 1px solid #f4f4f5; padding-top: 24px;">
              <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} Alexpoeima Art. All rights reserved.</p>
              <p style="margin: 0;">Need assistance? Reply directly to this email or contact support.</p>
            </div>
          </div>
        `,
        text: `Welcome to Alexpoeima Fine Art, ${firstName}!\n\nThank you for creating your account. You can view your account details at https://www.alexpoeima.com/account.\n\nBest regards,\nAlexpoeima`,
      });

      if (emailResult.success) {
        console.log("[Register] Welcome email sent successfully to", email);
      } else {
        console.warn("[Register] Welcome email dispatch note:", emailResult.error);
      }
    } catch (emailErr: any) {
      console.error("[Register] Error sending welcome email:", emailErr.message || emailErr);
    }

    // 3. Set Session Cookie and Return Success
    const response = NextResponse.json({ message: "Success", customer });
    
    response.cookies.set({
      name: "alexpoeima_session",
      value: Buffer.from(JSON.stringify({ 
        id: customer?.id, 
        email: customer?.email || email, 
        firstName: customer?.firstName || firstName, 
        lastName: customer?.lastName || lastName 
      })).toString("base64"),
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

