import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(
  to: string,
  subject: string,
  text: string
) {
  try {
    const { error } = await resend.emails.send({
      from: "Team Management System <onboarding@resend.dev>", // Update with your domain
      to,
      subject,
      text,
    });

    if (error) {
      console.error("❌ Error sending email:", error);
      return false;
    }

    console.log("🟢 Email sent successfully to:", to);
    return true;
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return false;
  }
}
