import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const authToken = req.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // ✅ Now, JWT verification runs in an API route (Node.js runtime)
    const decoded = jwt.verify(authToken, JWT_SECRET);
    console.log("✅ JWT Verified:", decoded);

    return NextResponse.json({ message: "Token is valid", user: decoded });
  } catch (error) {
    console.error("❌ JWT Verification Failed:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 403 }
    );
  }
}
