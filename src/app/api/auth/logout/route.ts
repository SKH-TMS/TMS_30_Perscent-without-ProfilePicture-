import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logout successful!" });

    // Clear the authentication cookie
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration to remove cookie
    });

    return response;
  } catch (error) {
    console.error("❌ Error during logout:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
