import cloudinary from "../../Config/cloudinaryConfig";
import { Request, Response } from "express";
import JobApplication from "../../models/JobApplication";

// Add a new job application
export const addJobApplication = async (req: Request, res: Response) => {
  try {
    // Extract fields from req.body
    const { name, email, phone, experience } = req.body;

    
    if (!req.file) {
      return res.status(400).json({ 
        message: "CV file is required",
        missingFields: ["cv"]
      });
    }

    // Upload file to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "cvs", 
      resource_type: "raw" 
    });

    // Create new job application with Cloudinary URL
    const newApplication = new JobApplication({
      name,
      email,
      phone,
      experience,
      cv: cloudinaryResponse.secure_url 
    });

    // Save to database
    await newApplication.save();

    // Return success response
    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication
    });

  } catch (error: any) {
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

// Update application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, recruiterFeedback } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { 
        status,
        recruiterFeedback,
        lastUpdate: new Date()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update application status",
      error: error.message
    });
  }
};

// Get application details
export const getApplicationDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch application details",
      error: error.message
    });
  }
};