import { Request, Response } from "express";
import JobPost from "../../models/Job";



// View all job posts (for current recruiter)
export const viewJobs = async (req: Request, res: Response) => {
  try {
    // Get recruiter/hospital id from headers (as set by frontend)
    const recruiterId = req.headers['x-user-id'];
    if (!recruiterId) {
      return res.status(401).json({ message: "Unauthorized: recruiter id missing" });
    }
    // Find jobs posted by this recruiter
    const jobs = await JobPost.find({ recruiterId });
    res.status(200).json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// Add a new job post
export const addJob = async (req: Request, res: Response) => {
  try {
    const jobData = req.body;
    // Attach recruiterId from headers
    const recruiterId = req.headers['x-user-id'];
    if (!recruiterId) {
      return res.status(401).json({ message: "Unauthorized: recruiter id missing" });
    }
    jobData.recruiterId = recruiterId;
    // Auto-generate a jobId (you can improve this later)
    jobData.jobId = Math.floor(Math.random() * 100000);
    const newJob = new JobPost(jobData);
    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob, });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to post job", error: error.message });
  }
};

// Update a job post
export const updateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedJob = await JobPost.findOneAndUpdate(
      { jobId: parseInt(id) }, // Find by jobId instead of _id
      req.body,
      { new: true }
    );
    
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update job", error: error.message });
  }
};

// Delete a job post
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedJob = await JobPost.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete job", error: error.message });
  }
};

// Get a single job by ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Extract the jobId from the URL
    console.log("Fetching job with ID:", id); // Debug log

    // Query the database using the jobId field
    const job = await JobPost.findOne({ jobId: id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error: any) {
    console.error("Error fetching job by ID:", error.message);
    res.status(500).json({ message: "Failed to fetch job details", error: error.message });
  }
};

// View all jobs (for job and internship page, not filtered by recruiter)
export const viewAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await JobPost.find();
    res.status(200).json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch all jobs", error: error.message });
  }
};


