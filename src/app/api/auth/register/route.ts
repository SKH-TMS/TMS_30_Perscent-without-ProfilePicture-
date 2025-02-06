import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { firstName, lastName, email, password, contact } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists!" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token (random string)
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Set token expiry (24 hours)
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    // Create new user (unverified)
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contact,
      verificationToken,
      verificationExpires,
      isVerified: false,
    });

    await newUser.save();

    console.log("✅ User registered, sending verification email...");

    // Send verification email
    const emailResponse = await resend.emails.send({
      from: "Team Management System <onboarding@resend.dev>", // Ensure this is a valid sender email
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click <a href="http://localhost:3000/api/auth/verify-email?token=${verificationToken}">here</a> to verify your email.</p>`,
    });

    console.log("✅ Email sent:", emailResponse);

    return NextResponse.json(
      { message: "User registered successfully! Please verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

// Function to send verification email using Resend
async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "Team Management System <onboarding@resend.dev>", // Use a verified sender domain
    to: email,
    subject: "Verify Your Email",
    html: `<p>Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}">Verify Email</a>
           <p>This link will expire in 24 hours.</p>`,
  });
}
