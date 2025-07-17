import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./Routes/PhysicianRoutes/BasicRoutes";
import CvDocRouter from "./Routes/PhysicianRoutes/CvDoctorRoutes";
import RecuiterJobPost from "./Routes/RecuiterRoutes/JobPostRoutes";
import connectDB from "./Config/db";
import JobSearch from "./Routes/PhysicianRoutes/JobSearchRoutes";
import jobApplicationRoutes from "./Routes/PhysicianRoutes/jobApplicationRoutes";
import DegreeApplicationRoutes from "./Routes/PhysicianRoutes/degreeApplicationRoutes";
import viewDegreeApplicationRoutes from "./Routes/EducationRoutes/ViewDegreeApplicationRoutes";
import degreeListingRoutes from './Routes/EducationRoutes/DegreeListingRoutes';
import higherEducationRoutes from './Routes/EducationRoutes/higherEducationRoutes';
import jobApplicationContolByRecuiterRoutes from './Routes/RecuiterRoutes/jobApplicationcontolByRecuiterRoutes';
import fs from "fs";
import path from "path";
import LoginRegisterRoutes from "./Routes/LoginRegisterRoutes";

connectDB(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Fix CORS configuration - Add PATCH method and more headers
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Add PATCH method
    allowedHeaders: [
        'Content-Type', 
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods'
    ]
}));

// Add explicit OPTIONS handler for preflight requests
app.options('*', cors());

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
app.use("/degrees", degreeListingRoutes);
app.use("/higherDegrees", higherEducationRoutes);
app.use('/degreeApplications', DegreeApplicationRoutes);
app.use('/viewDegreeApplications', viewDegreeApplicationRoutes);
app.use('/jobApplicationControl', jobApplicationContolByRecuiterRoutes);
app.use('/image', express.static(path.join(__dirname, "../image")));

// Start the server
app.use("/auth", LoginRegisterRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

