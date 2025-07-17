import cloudinary from "../../Config/cloudinaryConfig";
import { Request, Response } from "express";
import JobApplication from "../../models/JobApplication";
import Job from "../../models/Job";
import mongoose from "mongoose";

// Add a new job application
export const addJobApplication = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body); // Add this log
    console.log("Request files:", req.files); // Add this log
    
    const { name, email, phone, experience, jobId } = req.body;
    
    // Add detailed logging
    console.log("Received jobId:", jobId);
    console.log("Type of jobId:", typeof jobId);
    
    // Check if jobId exists and is valid
    if (!jobId || jobId.trim() === "") {
      console.log("Invalid jobId received");
      return res.status(400).json({ message: "Valid Job ID is required" });
    }
    
    // Check if the job exists in your database
    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      console.log("Job not found in database");
      return res.status(400).json({ message: "Job not found" });
    }

    if (!req.file) {
      return res.status(400).json({ 
        message: "CV file is required",
        missingFields: ["cv"]
      });
    }

    console.log("Received application:", { jobId, name, email, phone, experience, cv: req.file?.path });

    // Upload file to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "cvs", 
      resource_type: "raw" 
    });

    // Create new job application with Cloudinary URL
    const newApplication = new JobApplication({
      jobId,
      name,
      email,
      phone,
      experience,
      cv: cloudinaryResponse.secure_url 
    });

    // Save to database
    await newApplication.save();

    // Return success response
    return res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication
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
      .sort({ appliedDate: -1 });
    
    res.status(200).json(applications);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to fetch applications",
      error: error.message 
    });
  }
};

