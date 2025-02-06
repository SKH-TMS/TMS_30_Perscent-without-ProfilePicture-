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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Decode JWT token
    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(authToken, JWT_SECRET);
    } catch (error) {
      console.error("❌ Invalid token:", error);
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    // ✅ Ensure `decoded` is a JwtPayload before accessing `.id`
    if (typeof decoded !== "object" || !decoded.id) {
      return NextResponse.json(
        { message: "Invalid token structure" },
        { status: 403 }
      );
    }

    // Fetch user from database
    const user = await User.findById(decoded.id).select(
      "firstName lastName email isAdmin"
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
