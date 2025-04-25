import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
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
      jobDescription: {
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

const db = mongoose.connection.useDb('Jobs');
const Job = db.model("Job", JobSchema, "Jobdata");
export default Job;


