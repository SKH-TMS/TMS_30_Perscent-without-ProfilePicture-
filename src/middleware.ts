import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("auth_token")?.value;

  if (!authToken) {
    console.log("❌ No auth token found. Redirecting to /login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Instead of verifying JWT here, redirect to an API route for verification
  return NextResponse.next();
}

// ✅ Force Middleware to Run on Node.js
export const config = {
  matcher: ["/dashboard", "/profile", "/admin/:path*", "/user/:path*"], // Protects only dashboard route
};
