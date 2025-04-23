import mongoose, { Schema } from "mongoose"

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      default: "pdf",
    },
    meantFor: {
      type: [String],
      default: ["admin", "exco", "member"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema)
