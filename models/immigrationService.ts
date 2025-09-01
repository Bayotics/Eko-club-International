import mongoose from "mongoose"

const ImmigrationServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
    },
    residentialCountry: {
      type: String,
      required: true,
    },
    residentialState: {
      type: String,
      required: true,
    },
    citizenshipCountry: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)



export default mongoose.models.ImmigrationService || mongoose.model("ImmigrationService", ImmigrationServiceSchema)
