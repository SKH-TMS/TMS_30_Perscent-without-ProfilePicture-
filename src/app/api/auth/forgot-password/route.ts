import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import sendEmail from "@/lib/sendEmail"; // Ensure this works

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 400 });
    }

    // ✅ Correct JWT Token Generation
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("🟢 Generated Reset Token:", token); // ✅ Debugging

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // ✅ Send Email
    await sendEmail(
      user.email,
      "Password Reset",
      `Click the link: ${resetLink}`
    );

    return NextResponse.json({ message: "Reset email sent!" }, { status: 200 });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
