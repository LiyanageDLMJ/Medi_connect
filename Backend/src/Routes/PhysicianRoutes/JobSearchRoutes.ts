import express from 'express';
import { searchJobs } from '../../controllers/physicianControllers/jobSearchController';

const router = express.Router();

router.get('/jobs', searchJobs);

export default router;