import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Reference to Job model
    required: true,
  },
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
  status: {
    type: String,
    enum: ['applied', 'phone-screen', 'interview-scheduled', 'in-review', 'final-interview', 'offer', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  recruiterFeedback: {
    type: String,
    default: ''
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});


const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);

export default JobApplication;