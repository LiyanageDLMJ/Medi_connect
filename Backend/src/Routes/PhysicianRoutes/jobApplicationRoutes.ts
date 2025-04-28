import express, { Request, Response } from "express";
import upload from "../../middleware/multerConfig"; // Import multer configuration
import {
  addJobApplication,
  getAllJobApplications,
  getJobApplicationById,
  deleteJobApplication,
} from "../../controllers/physicianControllers/jobApplicationController";

const router = express.Router();

// Route to add a new job application with file upload
router.post("/addApplication", upload.single("cv"), addJobApplication as express.RequestHandler);

// Route to get all job applications
router.get("/getApplications", getAllJobApplications);

// Route to get a single job application by ID
router.get("/getApplication/:id", getJobApplicationById as express.RequestHandler);

// Route to delete a job application by ID
router.delete("/deleteApplication/:id", deleteJobApplication as express.RequestHandler);

export default router;