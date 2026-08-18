import { Resend } from "resend";

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
 * Get or initialize Resend SDK client safely and lazily
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.includes("your_resend_api_key")) {
    return null;
  }
  return new Resend(apiKey);
}

/**
 * Helper function to send email via Resend with default sender notifications@pradocommerce.com
 */
export async function sendEmail(options: SendEmailOptions) {
  const from = options.from || DEFAULT_FROM_EMAIL;
  const resendClient = getResendClient();

  if (!resendClient) {
    console.warn(
      "[Resend] Warning: RESEND_API_KEY is not set or contains placeholder value."
    );
    return {
      success: false,
      error: "RESEND_API_KEY is not configured in environment variables.",
    };
  }

  try {
    const data = await resendClient.emails.send({
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
