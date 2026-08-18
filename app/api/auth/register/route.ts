import { NextResponse } from "next/server";
import { pradoAdmin } from "@/lib/prado";
import { sendEmail, DEFAULT_FROM_EMAIL } from "@/lib/resend";

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

    // 1. Attempt to create Customer in Prado Commerce Dashboard
    let customer = null;
    try {
      customer = await pradoAdmin("/api/customers", {
        method: "POST",
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          first_name: firstName,
          last_name: lastName,
          name: `${firstName} ${lastName}`.trim(),
        }),
      });
      console.log("[Register] Prado Customer created successfully:", customer?.id || customer);
    } catch (error: any) {
      console.error("[Register] Customer creation attempt in Prado Commerce:", error.message || error);
    }

    // 2. Send Welcome Email to Buyer via Resend
    try {
      const emailResult = await sendEmail({
        to: email,
        from: DEFAULT_FROM_EMAIL,
        subject: "Welcome to Alex Poeima Fine Art!",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #18181b; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 28px; font-weight: 700; tracking-tight: -0.02em; margin: 0 0 8px 0; color: #09090b;">ALEX POEIMA</h1>
              <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin: 0;">Fine Art & Commerce</p>
            </div>
            
            <div style="border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; padding: 24px 0; margin-bottom: 32px;">
              <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">Welcome, ${firstName}!</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #3f3f46; margin: 0 0 16px 0;">
                Thank you for registering your buyer account with Alex Poeima Fine Art. We're thrilled to have you as part of our creative community.
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
              <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} Alex Poeima Art. All rights reserved.</p>
              <p style="margin: 0;">Need assistance? Reply directly to this email or contact support.</p>
            </div>
          </div>
        `,
        text: `Welcome to Alex Poeima Fine Art, ${firstName}!\n\nThank you for creating your account. You can view your account details at https://www.alexpoeima.com/account.\n\nBest regards,\nAlex Poeima`,
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

