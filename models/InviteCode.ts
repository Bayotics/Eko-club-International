import mongoose from "mongoose"

const InviteCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Check if the model already exists to prevent OverwriteModelError
const InviteCode = mongoose.models.InviteCode || mongoose.model("InviteCode", InviteCodeSchema)

export default InviteCode
