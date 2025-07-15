import { Request, Response } from 'express';
import Job from '../../models/Job';

// Fetch jobs based on filters
export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { searchText, hospital, location, type, salary, status } = req.query;
    
    const filter: any = {};
    if (searchText) filter.title = { $regex: searchText, $options: 'i' };
    if (hospital) filter.hospital = hospital;
    if (location) filter.location = location;
    if (type) filter.type = type;
    if (salary) filter.salary = salary;
    if (status) filter.status = status;

    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Get all jobs (existing)
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.status(200).json(jobs);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to fetch jobs", 
      error: error.message 
    });
  }
};

// Get single job by ID (NEW - this was missing)
export const getJobById = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    console.log(`Fetching job with ID: ${jobId}`);
    
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }
    
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.status(200).json(job);
  } catch (error: any) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ 
      message: "Failed to fetch job details", 
      error: error.message 
    });
  }
};