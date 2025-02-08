import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const email = formData.get("email") as string;

    if (!file || !email) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate file path
    const fileName = `${Date.now()}-${email}.jpg`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    // Save file to public/uploads
    await writeFile(filePath, buffer);

    // Update user profile picture in DB
    const user = await User.findOneAndUpdate(
      { email },
      { profilePicture: `/uploads/${fileName}` },
      { new: true }
    );

    return NextResponse.json({ profilePicture: user.profilePicture });
  } catch (error) {
    console.error("❌ Error uploading profile picture:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
