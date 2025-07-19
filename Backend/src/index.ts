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
import chatUploadRoutes from './Routes/ChatUploadRoutes';
import profilePhotoRoutes from './Routes/ProfilePhotoRoutes';
import fs from "fs";
import path from "path";

import LoginRegisterRoutes from "./Routes/LoginRegisterRoutes";
import userListRoutes from "./Routes/UserListRoutes";
import { createServer } from "http";
import { attachSocket } from "./socketServer";
connectDB();

const app = express();
const PORT = (process.env.PORT as number | undefined) || 3000;

// Configure CORS with specific options
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl) or any localhost:* in dev
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost')) return callback(null, true);
    // add prod domain if needed
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
}));

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
app.use('/degrees', degreePostRoutes);
app.use('/profile', require('./Routes/ProfileRoutes').default);
app.use('/profile-photo', profilePhotoRoutes);
app.use('/chat', chatUploadRoutes);
app.use('/messages', require('./Routes/MessageRoutes').default);
app.use('/users', userListRoutes);
// Start the server
app.use("/auth", LoginRegisterRoutes); // Use the centralized login/register routes

// Create HTTP server from existing Express app
const httpServer = createServer(app);

// Attach Socket.IO to this server
attachSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server and Socket.IO are running on port ${PORT}`);
});

