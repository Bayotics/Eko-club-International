import mongoose from "mongoose"
import { Schema } from "mongoose"

const RegistrationSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  chapterName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Prefer not to say"],
    required: true,
  },
  shirtSize: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    required: true,
  },
  attendanceDays: [
    {
      type: String,
      enum: ["thursday", "friday", "saturday", "sunday", "economic-session"],
    },
  ],
  registrationCategory: {
    type: String,
    enum: ["youth", "adult", "senior"],
    required: true,
  },
  dietaryRestrictions: {
    type: String,
    default: "",
  },
  membershipStatus: {
    type: String,
    enum: ["member", "non-member"],
    required: true,
  },
  membershipId: {
    type: String,
    default: "",
  },
  registrationType: {
    type: String,
    enum: ["full-convention", "economic-session-only"],
    required: true,
  },
  paymentId: {
    type: String,
    default: "",
  },
  registrationId: {
    type: String,
    required: true,
    unique: true,
  },
  registrationStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema)
