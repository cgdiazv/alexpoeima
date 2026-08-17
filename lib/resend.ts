import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";

// Initialize Resend SDK client
export const resend = new Resend(resendApiKey);

// Default sender email as specified
export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "notifications@pradocommerce.com";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

/**
 * Helper function to send email via Resend with default sender notifications@pradocommerce.com
 */
export async function sendEmail(options: SendEmailOptions) {
  const from = options.from || DEFAULT_FROM_EMAIL;

  if (!resendApiKey || resendApiKey.includes("your_resend_api_key")) {
    console.warn(
      "[Resend] Warning: RESEND_API_KEY is not set or contains placeholder value."
    );
  }

  try {
    const data = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html || `<p>${options.text || ""}</p>`,
      text: options.text,
      replyTo: options.replyTo,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("[Resend] Error sending email:", error);
    return { success: false, error: error.message || error };
  }
}
