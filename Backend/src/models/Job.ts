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
    description: {
        type: String,
        required: true
    }
});

const Job = mongoose.model("Job", JobSchema, "Jobdata");
const db=mongoose.connection.useDb('Jobs');
export default Job;


