import mongoose from "mongoose"

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  time: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  category: {
    type: String,
    enum: ["Medical", "Cultural", "Education", "Youth", "Business", "Fundraising", "Convention", "General"],
    default: "General",
  },
  image: {
    type: String,
    default: "",
  },
  imageGroups: {
    type: [
      {
        albumTitle: { type: String, default: "" },
        media: {
          type: [
            {
              url: { type: String, required: true },
              type: { type: String, enum: ["image", "video"], default: "image" },
              _id: false,
            },
          ],
          default: [],
        },
        _id: false,
      },
    ],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  registrationLink: {
    type: String,
    default: "",
  },
})

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema)

export default Event
