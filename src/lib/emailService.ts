import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email: string, resetURL: string) {
  try {
    await resend.emails.send({
      from: "Team Management System <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
    });
  } catch (error) {
    console.error("Error sending reset email:", error);
  }
}
