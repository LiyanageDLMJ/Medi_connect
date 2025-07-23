import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./Routes/PhysicianRoutes/BasicRoutes";
import CvDocRouter from "./Routes/PhysicianRoutes/CvDoctorRoutes";
import RecuiterJobPost from "./Routes/RecuiterRoutes/JobPostRoutes";
import CandidateRoutes from "./Routes/RecuiterRoutes/CandidateRoutes";
import connectDB from "./Config/db";
import JobSearch from "./Routes/PhysicianRoutes/JobSearchRoutes";
import jobApplicationRoutes from "./Routes/PhysicianRoutes/jobApplicationRoutes";
import chatUploadRoutes from './Routes/ChatUploadRoutes';
import profilePhotoRoutes from './Routes/ProfilePhotoRoutes';
import DegreeApplicationRoutes from "./Routes/PhysicianRoutes/degreeApplicationRoutes";
import viewDegreeApplicationRoutes from "./Routes/EducationRoutes/ViewDegreeApplicationRoutes";
import degreeListingRoutes from './Routes/EducationRoutes/DegreeListingRoutes';
import higherEducationRoutes from './Routes/EducationRoutes/higherEducationRoutes';
import LoginRegisterRoutes from "./Routes/LoginRegisterRoutes";
import jobApplicationContolByRecuiterRoutes from './Routes/RecuiterRoutes/jobApplicationcontolByRecuiterRoutes';
import fs from "fs";
import path from "path";
import userListRoutes from "./Routes/UserListRoutes";
import { createServer } from "http";
import { attachSocket } from "./socketServer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database with error handling - ONLY ONCE
connectDB().catch(err => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
    'x-user-id'
  ]
}));

app.options('*', cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Static files
app.use('/image', express.static(path.join(__dirname, "../image")));

// Routes - ORDER MATTERS! More specific routes should come first
app.use("/auth", LoginRegisterRoutes);
app.use("/api/recruiter/candidates", CandidateRoutes);
app.use("/api", router);
app.use("/CvdoctorUpdate", CvDocRouter);
app.use("/physician", CvDocRouter);
app.use("/JobPost", RecuiterJobPost);
app.use("/JobSearch", JobSearch);
app.use("/JobApplication", jobApplicationRoutes);
app.use("/degrees", degreeListingRoutes);
app.use("/higherDegrees", higherEducationRoutes);
app.use('/degreeApplications', DegreeApplicationRoutes);
app.use('/viewDegreeApplications', viewDegreeApplicationRoutes);
app.use('/jobApplicationControl', jobApplicationContolByRecuiterRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Create HTTP server from existing Express app
const httpServer = createServer(app);

// Attach Socket.IO to this server
attachSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server and Socket.IO are running on port ${PORT}`);
});

export default app;