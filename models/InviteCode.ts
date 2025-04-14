import mongoose from "mongoose"

const InviteCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  code: {
    type: String,
    required: [true, "Invite code is required"],
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: [true, "Expiration date is required"],
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Check if the model exists before creating it
const InviteCode = mongoose.models.InviteCode || mongoose.model("InviteCode", InviteCodeSchema)

export default InviteCode
