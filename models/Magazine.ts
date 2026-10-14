import mongoose, { Schema } from "mongoose"

const MagazineSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    issueNumber: { type: String, default: "", trim: true },
    publishedDate: { type: Date, required: [true, "Publication date is required"] },
    description: { type: String, default: "", trim: true },
    coverImage: { type: String, default: "" },
    // Page-1 render generated at upload time; used when no custom cover is set.
    pdfCoverImage: { type: String, default: "" },
    // Older editions live on Cloudinary (pdfUrl/pdfPublicId); new ones live in a private R2 bucket (pdfKey).
    pdfStorage: { type: String, enum: ["cloudinary", "r2"], default: "cloudinary" },
    pdfUrl: { type: String, default: "" },
    pdfPublicId: { type: String, default: "" },
    pdfKey: { type: String, default: "" },
  },
  { timestamps: true },
)

export default mongoose.models.Magazine || mongoose.model("Magazine", MagazineSchema)
