import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  chapterName: {
    type: String,
    default: "",
  },
  membershipId: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "member", "chapter_leader"],
    default: "member",
  },
  profileImage: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
})

// Check if model already exists to prevent overwriting during hot reloads
const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User
