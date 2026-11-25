import cloudinary from "../../Config/cloudinaryConfig";
import { Request, Response } from "express";
import JobApplication from "../../models/JobApplication";
import Job from "../../models/Job";
import mongoose from "mongoose";

// Add a new job application
export const addJobApplication = async (req: Request, res: Response) => {
  try {
    // Get userId from authentication middleware (recommended)
    // const userId = req.user.id;

    // TEMPORARY: If you don't have auth, get userId from frontend (not secure, but works for now)
    const userId = req.body.userId;

    console.log("Request body:", req.body);
    
    const { name, email, phone, experience, jobId } = req.body;
    
    // Check if jobId exists
    if (!jobId || jobId.trim() === "") {
      return res.status(400).json({ message: "Valid Job ID is required" });
    }
    
    // Find job using jobId field (not _id)
    const job = await Job.findOne({ jobId: jobId });
    if (!job) {
      console.log("Job not found with jobId:", jobId);
      return res.status(400).json({ message: "Job not found" });
    }
    
    console.log("Job found:", job);
    
    // Create the job application
    const newApplication = new JobApplication({
      name,
      email,
      phone,
      experience,
      jobId: job._id, // Store as string, matching your Job model
      cv: req.file ? req.file.path : null,
      appliedDate: new Date(),
      status: 'applied',
      userId, // <-- ADD THIS LINE
    });
    
    const savedApplication = await newApplication.save();
    
    res.status(201).json({
      message: "Application submitted successfully",
      application: savedApplication
    });
    
  } catch (error: any) {
    console.error("Error in addJobApplication:", error);
    res.status(500).json({ 
      message: "Failed to submit application", 
      error: error.message 
    });
  }
};

// Get all job applications
export const getAllJobApplications = async (req: Request, res: Response) => {
  try {
    const applications = await JobApplication.find();
    res.status(200).json(applications);
  } catch (error: any) {
    console.error("Error fetching job applications:", error.message);
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};

// Get a single job application by ID
export const getJobApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error: any) {
    console.error("Error fetching job application:", error.message);
    res.status(500).json({ message: "Failed to fetch application", error: error.message });
  }
};

// Delete a job application by ID
export const deleteJobApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedApplication = await JobApplication.findByIdAndDelete(id);

    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting job application:", error.message);
    res.status(500).json({ message: "Failed to delete application", error: error.message });
  }
};

// Add a new endpoint to get applications by user email
export const getApplicationsByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const applications = await JobApplication.find({ email })
      .sort({ appliedDate: -1 });
    
    res.status(200).json(applications);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to fetch applications", 
      error: error.message 
    });
  }
};

// Get all applications for a specific user
export const getUserApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const applications = await JobApplication.find({ userId })
      .populate('jobId') // <-- This will fetch the job details!
      .sort({ appliedDate: -1 });
    res.status(200).json(applications);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to fetch applications",
      error: error.message 
    });
  }
};

