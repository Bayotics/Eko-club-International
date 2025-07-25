import mongoose from "mongoose"
import { Schema } from "mongoose"

function generateMembershipId(length = 19) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
const UserSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
    unique: true,
    // Add a default value for existing users
    default: "Not provided",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  chapterName: {
    type: String,
    default: "",
  },
  membershipId: {
    type: String,
    default: generateMembershipId(),
  },
  role: {
    type: String,
    enum: ["admin", "member", "exco", "superadmin", "pending", "blocked"],
    default: "pending",
  },
  profileImage: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
