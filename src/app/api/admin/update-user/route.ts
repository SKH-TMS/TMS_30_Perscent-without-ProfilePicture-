import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { _id, firstName, lastName } = await req.json();

    // Ensure the user exists
    const user = await User.findById(_id);
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    // Update user details
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    await user.save();

    return NextResponse.json({ message: "User updated successfully!" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user", error },
      { status: 500 }
    );
  }
}
