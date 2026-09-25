import mongoose, { Schema } from "mongoose"

const MemorialSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    photo: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
    dateOfPassing: { type: Date, required: [true, "Date of passing is required"] },
    chapter: { type: String, default: "", trim: true },
    role: { type: String, default: "", trim: true },
    biography: { type: String, default: "" },
    gallery: { type: [String], default: [] },
  },
  { timestamps: true },
)

export default mongoose.models.Memorial || mongoose.model("Memorial", MemorialSchema)
