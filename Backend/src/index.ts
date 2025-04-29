import express from "express";
import cors from "cors"; // Import cors
import mongoose from "mongoose";
import router from "./Routes/PhysicianRoutes/BasicRoutes";
import CvDocRouter from "./Routes/PhysicianRoutes/CvDoctorRoutes";
import RecuiterJobPost from "./Routes/RecuiterRoutes/JobPostRoutes";
import connectDB from "./Config/db";
import JobSearch from "./Routes/PhysicianRoutes/JobSearchRoutes";
import jobApplicationRoutes from "./Routes/PhysicianRoutes/jobApplicationRoutes";
import degreePostRoutes from './Routes/EducationRoutes/DegreePostRoutes';
import fs from "fs";
import path from "path";

import LoginRegisterRoutes from "./Routes/LoginRegisterRoutes";
connectDB();

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", router);
app.use("/CvdoctorUpdate", CvDocRouter);
app.use("/JobPost", RecuiterJobPost);
app.use("/JobSearch", JobSearch);
app.use("/JobApplication", jobApplicationRoutes);
app.use('/api/degrees', degreePostRoutes);
// Start the server
app.use("/auth", LoginRegisterRoutes); // Use the centralized login/register routes
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

