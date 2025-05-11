import mongoose from "mongoose"
import { Schema } from "mongoose"

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
    default: "",
  },
  role: {
    type: String,
    enum: ["admin", "member", "superadmin"],
    default: "member",
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
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
