import { Request, Response } from "express";
import JobApplication from "../../models/JobApplication";

// Add a new job application
export const addJobApplication = async (req: Request, res: Response) => {
  try {
    // Extract fields from req.body
    const { name, email, phone, experience } = req.body;

    // Extract file from req.file (multer adds this)
    const cv = req.file ? req.file.path : null; // Store the file path

    // Validate required fields
    const requiredFields = { name, email, phone, experience, cv };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields,
      });
    }

    // Create new job application
    const newApplication = new JobApplication({ name, email, phone, experience, cv });
    const savedApplication = await newApplication.save();

    res.status(201).json({ message: "Application submitted successfully", application: savedApplication });
  } catch (error: any) {
    console.error("Error adding job application:", error.message);
    res.status(500).json({ message: "Failed to submit application", error: error.message });
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