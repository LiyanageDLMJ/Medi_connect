import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true,
  },
  recruiterId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Internship"],
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  salaryRange: {
    type: String,
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["OPEN", "INTERVIEW", "PENDING", "CLOSED"],
    default: "OPEN",
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  urgent: {
    type: Boolean,
    default: false,
  },
});

// Ensure the correct database is used
const Job = mongoose.model("Job", JobSchema ); // Ensure the correct collection is used

export default Job;


