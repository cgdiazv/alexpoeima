import { NextResponse } from "next/server";
import { sendEmail, DEFAULT_FROM_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html, text, from, replyTo } = body;

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and html or text" },
        { status: 400 }
      );
    }

    // Default to notifications@pradocommerce.com if from is not explicitly specified
    const senderEmail = from || DEFAULT_FROM_EMAIL;

    const result = await sendEmail({
      to,
      subject,
      html,
      text,
      from: senderEmail,
      replyTo,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email via Resend" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      from: senderEmail,
      data: result.data,
    });
  } catch (error: any) {
    console.error("API /api/send-email error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
