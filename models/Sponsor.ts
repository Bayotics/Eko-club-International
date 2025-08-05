import mongoose, { Schema, type Document } from "mongoose"

export interface ISponsor extends Document {
  _id: string
  name: string
  description?: string
  pic?: string
  sponsorshipType: "regular" | "corporate"
  contribution?: {
    type: "monetary" | "in-kind" | "both"
    monetaryAmount?: number
    inKindDescription?: string
  }
  websiteLink?: string
  createdAt: Date
  updatedAt: Date
}

const contributionSchema = new Schema({
  type: {
    type: String,
    enum: ["monetary", "in-kind", "both"],
  },
  monetaryAmount: {
    type: Number,
    min: [0, "Monetary amount must be positive"],
  },
  inKindDescription: {
    type: String,
    maxlength: [300, "In-kind description cannot exceed 300 characters"],
  },
})

const sponsorSchema = new Schema<ISponsor>(
  {
    name: {
      type: String,
      required: [true, "Sponsor name is required"],
      trim: true,
      maxlength: [100, "Sponsor name cannot exceed 100 characters"],
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
    sponsorshipType: {
      type: String,
      enum: ["regular", "corporate"],
      required: [true, "Sponsorship type is required"],
      default: "regular",
    },
    contribution: {
      type: contributionSchema,
      required: false, // Made optional
    },
    websiteLink: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => {
          if (!v) return true // Optional field
          return /^https?:\/\/.+/.test(v)
        },
        message: "Website link must be a valid URL",
      },
    },
  },
  {
    timestamps: true,
  },
)

// Pre-save validation - only validate if contribution exists
sponsorSchema.pre("save", function (next) {
  const sponsor = this as ISponsor

  // Only validate contribution if it exists
  if (sponsor.contribution) {
    // Validate contribution based on type
    if (sponsor.contribution.type === "monetary" || sponsor.contribution.type === "both") {
      if (!sponsor.contribution.monetaryAmount || sponsor.contribution.monetaryAmount <= 0) {
        return next(new Error("Monetary amount is required and must be greater than 0 for monetary contributions"))
      }
    }

    if (sponsor.contribution.type === "in-kind" || sponsor.contribution.type === "both") {
      if (!sponsor.contribution.inKindDescription || sponsor.contribution.inKindDescription.trim().length === 0) {
        return next(new Error("In-kind description is required for in-kind contributions"))
      }
    }
  }

  next()
})

// Pre-update validation - only validate if contribution exists
sponsorSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate() as any

  if (update.contribution) {
    const contribution = update.contribution

    // Validate contribution based on type
    if (contribution.type === "monetary" || contribution.type === "both") {
      if (!contribution.monetaryAmount || contribution.monetaryAmount <= 0) {
        return next(new Error("Monetary amount is required and must be greater than 0 for monetary contributions"))
      }
    }

    if (contribution.type === "in-kind" || contribution.type === "both") {
      if (!contribution.inKindDescription || contribution.inKindDescription.trim().length === 0) {
        return next(new Error("In-kind description is required for in-kind contributions"))
      }
    }
  }

  next()
})

// Create indexes
sponsorSchema.index({ name: 1 })
sponsorSchema.index({ sponsorshipType: 1 })
sponsorSchema.index({ "contribution.type": 1 })
sponsorSchema.index({ createdAt: -1 })

const Sponsor = mongoose.models.Sponsor || mongoose.model<ISponsor>("Sponsor", sponsorSchema)

export default Sponsor
