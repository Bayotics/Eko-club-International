import mongoose, { type Document, Schema } from "mongoose"

export interface ISubscriber extends Document {
  email: string
  subscriptionDate: Date
  status: "active" | "unsubscribed"
  source?: string
  lastEmailSent?: Date
  ipAddress?: string
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
    },
    subscriptionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
    },
    source: {
      type: String,
      default: "website",
    },
    lastEmailSent: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Create or use existing model
export default mongoose.models.Subscriber || mongoose.model<ISubscriber>("Subscriber", SubscriberSchema)
