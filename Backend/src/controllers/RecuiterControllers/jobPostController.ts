  import { Request, Response } from "express";
import JobPost from "../../models/Job";


// View all job posts
export const viewJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await JobPost.find();
    console.log("Jobs Fetched:", jobs); // Debug log
    res.status(200).json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// Add a new job post
export const addJob = async (req: Request, res: Response) => {
  try {
    const jobData = req.body;

    // Auto-generate a jobId (you can improve this later)
    jobData.jobId = Math.floor(Math.random() * 100000);

    const newJob = new JobPost(jobData);
    await newJob.save();

    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to post job", error: error.message });
  }
}; 

// Update a job post
export const updateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedJob = await JobPost.findByIdAndUpdate(id, req.body, { new: true });

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
    const { id } = req.params;
    const job = await JobPost.findById(id); // Use findById to fetch by _id

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch job details", error: error.message });
  }
};

