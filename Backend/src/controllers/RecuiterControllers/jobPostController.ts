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

