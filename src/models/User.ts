import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationExpires: { type: Date, default: null },
  profilePicture: { type: String, default: "/uploads/default-profile.png" }, // ✅ New field
  isAdmin: { type: Boolean, default: false }, // ✅ User Role Field
});

// Create the model and explicitly set the collection name
const User =
  mongoose.models.register_user || mongoose.model("register_user", UserSchema);

export default User;
