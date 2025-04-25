/*
import express, { Request, Response } from "express";
import JobPost from "../../models/Job";

// View all job posts
export const viewJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await JobPost.find();
        res.status(200).send({
            "Message": `${jobs.length} Jobs found`,
            "Jobs": jobs
        });
    } catch (error) {
        res.status(500).send({ "Message": "Error retrieving jobs", "Error": error });
    }
};

// Add a new job post
export const addJob = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const job = new JobPost(data);
        const result = await job.save();
        res.status(201).send({
            "Message": "Job posted successfully",
            "Job ID": result._id
        });
    } catch (error) {
        res.status(500).send({ "Message": "Job not posted", "Error": error });
    }
};

// Update a job post
export const updateJob = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await JobPost.findByIdAndUpdate(id, data, { new: true });
        if (result) {
            res.status(200).send({
                "Message": "Job updated successfully",
                "Job": result
            });
        } else {
            res.status(404).send({ "Message": "Job not found" });
        }
    } catch (error) {
        res.status(500).send({ "Message": "Job not updated", "Error": error });
    }
};

// Delete a job post
export const deleteJob = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await JobPost.findByIdAndDelete(id);
        if (result) {
            res.status(200).send({
                "Message": "Job deleted successfully",
                "Job ID": result._id
            });
        } else {
            res.status(404).send({ "Message": "Job not found" });
        }
    } catch (error) {
        res.status(500).send({ "Message": "Job not deleted", "Error": error });
    }
};
*/
import { Request, Response } from "express";
import JobPost from "../../models/Job";

// Helper to get status color dynamically
const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "OPEN":
      return "green";
    case "PENDING":
      return "orange";
    case "INTERVIEW":
      return "blue";
    case "REJECTED":
      return "red";
    default:
      return "gray";
  }
};

// View all job posts
export const viewJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await JobPost.find();

    // Append statusColor dynamically
    const jobsWithColors = jobs.map((job) => ({
      ...job.toObject(),
      statusColor: getStatusColor(job.status),
    }));

    res.status(200).json(jobsWithColors);
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

