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
 featured: {
   type: Boolean,
   default: false,
 },
 registrationLink:{
  type: String,
  default: ""
 }
})

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema)

export default Event