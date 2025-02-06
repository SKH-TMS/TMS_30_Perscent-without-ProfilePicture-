import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { token, newPassword } = await req.json();

    console.log("🟢 Received Reset Token:", token);
    console.log("🟢 New Password:", newPassword);

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Token and new password are required." },
        { status: 400 }
      );
    }

    // ✅ Ensure Token is a Valid JWT Format
    if (!token.includes(".") || token.split(".").length !== 3) {
      console.error("❌ Token format incorrect (not a JWT)");
      return NextResponse.json(
        { message: "Invalid token format." },
        { status: 400 }
      );
    }

    let decoded: JwtPayload | null = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (jwtError) {
      console.error("❌ JWT Verification Failed:", jwtError);
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    console.log("🟢 Decoded Token Data:", decoded);

    if (!decoded.email) {
      return NextResponse.json(
        { message: "Invalid token structure." },
        { status: 400 }
      );
    }

    // ✅ Find User by Email
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 400 });
    }

    // ✅ Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("🟢 Password updated successfully!");

    return NextResponse.json(
      { message: "Password reset successful! Please log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
