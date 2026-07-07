import mongoose, { Schema } from "mongoose"

const ChapterPresidentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "President name is required"],
      trim: true,
    },
    chapter: {
      type: String,
      required: [true, "Chapter is required"],
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.ChapterPresident || mongoose.model("ChapterPresident", ChapterPresidentSchema)
