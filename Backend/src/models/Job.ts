import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    jobId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    hospital: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    salary: {
        type: String,  // Keeping it as String to accommodate "Above 300000"
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["PENDING", "APPROVED", "REJECTED"] // Enum for predefined values
    },
    statusColor: {
        type: String,
        required: true
    },
   
    
});

const db = mongoose.connection.useDb('Jobs');
const Job = db.model("Job", JobSchema, "Jobdata");
export default Job;


