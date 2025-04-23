import mongoose from "mongoose";

const JobPostSchema = new mongoose.Schema({
  jobId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["full-time", "part-time", "contract", "locum"], // Predefined job types
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  salary: {
    type: String, // Keeping it as String to accommodate ranges like "$200,000 - $250,000"
    required: false,
  },
  urgent: {
    type: Boolean,
    default: false,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
});

const db = mongoose.connection.useDb("Jobs");
const JobPost = db.model("JobPost", JobPostSchema, "JobPosts");
export default JobPost;