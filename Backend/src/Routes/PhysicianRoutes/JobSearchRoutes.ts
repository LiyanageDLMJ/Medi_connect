import express, { Request, Response } from 'express';
import { searchJobs, getAllJobs, getJobById } from '../../controllers/physicianControllers/jobSearchController';

const router = express.Router();

router.get('/jobs', searchJobs);
router.get('/viewJobs', getAllJobs);
router.get('/job/:id', getJobById as express.RequestHandler); // Add this route for job details
// Get single job by ID (NEW - add this route)
router.get('/:jobId', getJobById as express.RequestHandler);

export default router;