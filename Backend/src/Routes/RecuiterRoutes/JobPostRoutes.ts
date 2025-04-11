import express from "express";
import * as jobPostController from "../../controllers/RecuiterControllers/jobPostController";

const router = express.Router();

// Route to view all job posts
router.get("/Veiwjobs", jobPostController.viewJobs);

// Route to add a new job post
router.post("/Postjobs", jobPostController.addJob);

// Route to update a job post
router.put("/Updatejobs", jobPostController.updateJob);

// Route to delete a job post
router.delete("Deletejobs", jobPostController.deleteJob);

export default router;
