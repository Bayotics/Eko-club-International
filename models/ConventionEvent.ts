import mongoose from "mongoose"

const SectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    video: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true },
)

const ConventionEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    dateFrom: {
      type: Date,
      required: true,
    },
    dateTo: {
      type: Date,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Single", "Sectioned"],
      required: true,
    },
    // For Single type events
    title: {
      type: String,
      trim: true,
    },
    video: {
      type: String,
      trim: true,
    },
    // For Sectioned type events
    sections: [SectionSchema],
  },
  {
    timestamps: true,
  },
)

// Validation to ensure proper data based on type
ConventionEventSchema.pre("save", function (next) {
  if (this.type === "Single") {
    if (!this.title || !this.video) {
      return next(new Error("Title and video are required for Single type events"))
    }
    this.sections = []
  } else if (this.type === "Sectioned") {
    if (!this.sections || this.sections.length === 0) {
      return next(new Error("At least one section is required for Sectioned type events"))
    }
    this.title = undefined
    this.video = undefined
  }
  next()
})

export default mongoose.models.ConventionEvent || mongoose.model("ConventionEvent", ConventionEventSchema)
