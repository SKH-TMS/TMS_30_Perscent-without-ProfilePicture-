import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOneAndDelete({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
