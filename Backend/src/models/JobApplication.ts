import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  cv: {
    type: String, // Store the file path or URL of the uploaded CV
    required: true,
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
});

const db = mongoose.connection.useDb("Jobs");
const JobApplication = db.model("JobApplication", JobApplicationSchema, "JobApplicantData");

export default JobApplication;