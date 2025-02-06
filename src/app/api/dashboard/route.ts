import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";

export async function GET(req: Request) {
  const authResponse = authMiddleware(req as any);
  if (authResponse.status === 401) return authResponse;

  return NextResponse.json({
    message: "Welcome to the Dashboard!",
    user: (req as any).user,
  });
}
