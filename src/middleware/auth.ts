import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function authMiddleware(req: NextRequest) {
  // Debug: Log all cookies
  console.log("Request Cookies:", req.cookies.getAll());

  // Extract token from cookies
  const token = req.cookies.get("auth_token")?.value;

  // Debug: Check if token is extracted
  console.log("Extracted Token:", token);

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized access! No token found." },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    console.log("Decoded User:", decoded); // Debugging log
    return NextResponse.next();
  } catch (error) {
    console.error("JWT Error:", error);
    return NextResponse.json(
      { message: "Invalid or expired token!" },
      { status: 401 }
    );
  }
}
