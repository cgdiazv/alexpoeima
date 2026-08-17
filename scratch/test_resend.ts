import { sendEmail, DEFAULT_FROM_EMAIL } from "../lib/resend";

console.log("DEFAULT_FROM_EMAIL:", DEFAULT_FROM_EMAIL);

async function runTest() {
  console.log("Testing Resend sendEmail helper...");
  const res = await sendEmail({
    to: "notifications@pradocommerce.com",
    subject: "Test Email from Resend Setup",
    html: "<p>Hello! This is a test email sent from <strong>notifications@pradocommerce.com</strong>.</p>",
  });

  console.log("Result:", JSON.stringify(res, null, 2));
}

runTest();
