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
import DegreeApplicationRoutes from "./Routes/PhysicianRoutes/degreeApplicationRoutes";
import viewDegreeApplicationRoutes from "./Routes/EducationRoutes/ViewDegreeApplicationRoutes";
import degreeListingRoutes from './Routes/EducationRoutes/DegreeListingRoutes';
import higherEducationRoutes from './Routes/EducationRoutes/higherEducationRoutes';
import LoginRegisterRoutes from "./Routes/LoginRegisterRoutes";
import jobApplicationContolByRecuiterRoutes from './Routes/RecuiterRoutes/jobApplicationcontolByRecuiterRoutes';
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Connect to database with error handling
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
        'Access-Control-Allow-Methods'
    ]
}));

// Add explicit OPTIONS handler for preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (err) {
        console.error("Failed to create uploads directory:", err);
    }
}

// Route definitions
const routes = [
    { path: "/api/recruiter/candidates", router: CandidateRoutes },
    { path: "/CvdoctorUpdate", router: CvDocRouter },
    { path: "/JobPost", router: RecuiterJobPost },
    { path: "/api", router },
    { path: "/JobSearch", router: JobSearch },
    { path: "/JobApplication", router: jobApplicationRoutes },
    { path: "/degrees", router: degreeListingRoutes },
    { path: "/higherDegrees", router: higherEducationRoutes },
    { path: "/degreeApplications", router: DegreeApplicationRoutes },
    { path: "/viewDegreeApplications", router: viewDegreeApplicationRoutes },
    { path: "/jobApplicationControl", router: jobApplicationContolByRecuiterRoutes },
    { path: "/auth", router: LoginRegisterRoutes }
];

// Register all routes
routes.forEach(({ path, router }) => {
    app.use(path, router);
});

// Additional routes
app.use('/physician', CvDocRouter);
app.use('/image', express.static(path.join(__dirname, "../image")));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err: Error) => {
    console.error("Failed to start server:", err);
});

export default app;