import mongoose from "mongoose"

export interface ISponsor {
  _id?: string
  name: string
  description?: string
  pic?: string
  contribution: {
    type: "monetary" | "in-kind" | "both"
    monetaryAmount?: number
    inKindDescription?: string
  }
  websiteLink?: string
  createdAt?: Date
  updatedAt?: Date
}

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sponsor name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    pic: {
      type: String,
      trim: true,
    },
    contribution: {
      type: {
        type: String,
        enum: ["monetary", "in-kind", "both"],
        required: [true, "Contribution type is required"],
      },
      monetaryAmount: {
        type: Number,
        min: [0, "Monetary amount must be positive"],
        validate: {
          validator: function (this: ISponsor, value: number) {
            return this.contribution.type === "monetary" || this.contribution.type === "both" ? value > 0 : true
          },
          message: "Monetary amount is required for monetary contributions",
        },
      },
      inKindDescription: {
        type: String,
        trim: true,
        maxlength: [300, "In-kind description cannot exceed 300 characters"],
        validate: {
          validator: function (this: ISponsor, value: string) {
            return this.contribution.type === "in-kind" || this.contribution.type === "both"
              ? value && value.length > 0
              : true
          },
          message: "In-kind description is required for in-kind contributions",
        },
      },
    },
    websiteLink: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => {
          if (!value) return true
          const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
          return urlRegex.test(value)
        },
        message: "Please enter a valid website URL",
      },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
sponsorSchema.index({ name: 1 })
sponsorSchema.index({ "contribution.type": 1 })
sponsorSchema.index({ createdAt: -1 })

export default mongoose.models.Sponsor || mongoose.model<ISponsor>("Sponsor", sponsorSchema)
