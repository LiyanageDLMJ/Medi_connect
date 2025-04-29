import express from "express";
import {
  viewJobs,
  addJob,
  updateJob,
  deleteJob,
  getJobById,
} from "../../controllers/RecuiterControllers/jobPostController";

const router = express.Router();

// Helper to handle async errors
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route to view all job posts
router.get("/viewJobs", asyncHandler(viewJobs));

// Route to view a job post by ID
router.get("/viewJobs/:id", asyncHandler(getJobById));

// Route to add a new job post
router.post("/postJobs", asyncHandler(addJob));

// Route to update a job post by ID
router.put("/updateJobs/:id", asyncHandler(updateJob));

// Route to delete a job post by ID
router.delete("/deleteJobs/:id", asyncHandler(deleteJob));

export default router;
