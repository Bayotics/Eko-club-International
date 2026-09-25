import mongoose, { Schema } from "mongoose"

const MagazineSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    issueNumber: { type: String, default: "", trim: true },
    publishedDate: { type: Date, required: [true, "Publication date is required"] },
    description: { type: String, default: "", trim: true },
    coverImage: { type: String, default: "" },
    pdfUrl: { type: String, required: [true, "Magazine PDF is required"] },
    pdfPublicId: { type: String, default: "" },
  },
  { timestamps: true },
)

export default mongoose.models.Magazine || mongoose.model("Magazine", MagazineSchema)
