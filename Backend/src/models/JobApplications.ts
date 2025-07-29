import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  email: String,
  phone: String,
  experience: String,
  cv: String,
  status: {
    type: String,
    default: "Pending",
  },
  recruiterFeedback: {
    type: String,
    default: "",
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const db = mongoose.connection.useDb("MediConnect");
const JobApplication = db.model("JobApplication", jobApplicationSchema, "jobApplications");

export default JobApplication;
