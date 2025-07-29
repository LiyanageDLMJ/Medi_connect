import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./Routes/PhysicianRoutes/BasicRoutes";
import CvDocRouter from "./Routes/PhysicianRoutes/CvDoctorRoutes";
import RecuiterJobPost from "./Routes/RecuiterRoutes/JobPostRoutes";
import connectDB from "./Config/db";
import JobSearch from "./Routes/PhysicianRoutes/JobSearchRoutes";
import jobApplicationRoutes from "./Routes/PhysicianRoutes/jobApplicationRoutes";
import chatUploadRoutes from './Routes/ChatUploadRoutes';
import profilePhotoRoutes from './Routes/ProfilePhotoRoutes';
import DegreeApplicationRoutes from "./Routes/PhysicianRoutes/degreeApplicationRoutes";
import viewDegreeApplicationRoutes from "./Routes/EducationRoutes/ViewDegreeApplicationRoutes";
import degreeListingRoutes from './Routes/EducationRoutes/DegreeListingRoutes';
import higherEducationRoutes from './Routes/EducationRoutes/higherEducationRoutes';
import jobApplicationContolByRecuiterRoutes from './Routes/RecuiterRoutes/jobApplicationcontolByRecuiterRoutes';
import feedbackRoutes from './Routes/feedbackRoutes';
import notificationRoutes from './Routes/notificationRoutes';
import fs from "fs";
import path from "path";
import LoginRegisterRoutes from "./Routes/LoginRegisterRoutes";
import userListRoutes from "./Routes/UserListRoutes";
import { createServer } from "http";
import { attachSocket } from "./socketServer";
import faqRoutes from "./Routes/FAQRoutes";
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS with specific options
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
    'x-user-id',
    'x-user-type',
    'x-user-email',
    'x-user-name'
  ]
}));

app.options('*', cors());

// Middleware to parse JSON
app.use(express.json({ limit: '10mb' }));

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api", router);
app.use("/CvdoctorUpdate", CvDocRouter);
app.use("/JobPost", RecuiterJobPost);
app.use("/JobSearch", JobSearch);
app.use("/JobApplication", jobApplicationRoutes);
app.use('/profile', require('./Routes/ProfileRoutes').default);
app.use('/profile-photo', profilePhotoRoutes);
app.use('/chat', chatUploadRoutes);
app.use('/messages', require('./Routes/MessageRoutes').default);
app.use('/users', userListRoutes);
app.use("/degrees", degreeListingRoutes);
app.use("/higherDegrees", higherEducationRoutes);
app.use('/degreeApplications', DegreeApplicationRoutes);
app.use('/viewDegreeApplications', viewDegreeApplicationRoutes);
app.use('/jobApplicationControl', jobApplicationContolByRecuiterRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/notifications', notificationRoutes);
app.use("/api/faqs", faqRoutes);
// app.use('/images', express.static('src/image'));
app.use('/image', express.static(path.join(__dirname, "../image")));

app.use("/auth", LoginRegisterRoutes);

// Create HTTP server from existing Express app
const httpServer = createServer(app);

// Attach Socket.IO to this server
attachSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server and Socket.IO are running on port ${PORT}`);
});