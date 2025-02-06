import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const authToken = req.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // ✅ Fix: Explicitly cast `decoded` as `JwtPayload`
    const decoded = jwt.verify(authToken, JWT_SECRET) as JwtPayload;

    if (!decoded.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    // Fetch user from database
    const user = await User.findById(decoded.id).select("-password"); // Exclude password field
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 403 }
    );
  }
}
