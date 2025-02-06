import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, "firstName lastName email");

    return NextResponse.json({ users });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
