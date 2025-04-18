import mongoose, { Schema } from "mongoose"

const PaymentSchema = new Schema(
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
    transactionReference: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    comment: {
      type: String,
      required: false,
    },
    donationType: {
      type: String,
      required: true,
      enum: ["one-off", "recurring"],
    },
    recognitionPreference: {
      type: String,
      required: false,
      enum: ["full", "partial", "anonymous"],
      default: "anonymous",
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)
