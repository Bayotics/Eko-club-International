import mongoose, { Schema } from "mongoose"

const SubscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      enum: ["NGN", "USD"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["paystack", "flutterwave", "paypal"],
    },
    paymentToken: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "paused", "cancelled"],
      default: "active",
    },
    lastBillingDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
    recognitionPreference: {
      type: String,
      required: false,
      enum: ["full", "partial", "anonymous"],
      default: "anonymous",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema)
