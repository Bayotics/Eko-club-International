import mongoose from "mongoose"

const MinuteSchema = new mongoose.Schema(
  {
    meetingId:{
        type: String,
        required: [true, "Meeting ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    date: {
      type: String,
      required: false
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    meantFor: {
      type: [String],
      default: [],
    },
    createdAt: {type: String},
    updatedAt: {type: String},
    createdBy:  {type: String},// User ID of the creator
    updatedBy: {type: String}, // User ID of the last person to update
    isPublished: {type: Boolean}, // Whether the minutes are visible to members
    attachments: Array<{
        name: string
        url: string
        type: string
        size: number
        uploadedAt: string
        uploadedBy: string
    }>,
    tags: {type: [String], default: []}
  },
  { timestamps: true },
)

const Minute = mongoose.models.Minute || mongoose.model("Minute", MinuteSchema)

export default Minute
