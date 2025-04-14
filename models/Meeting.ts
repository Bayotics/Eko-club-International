import mongoose from "mongoose"

const MeetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    meantFor: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
)

const Meeting = mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema)

export default Meeting
