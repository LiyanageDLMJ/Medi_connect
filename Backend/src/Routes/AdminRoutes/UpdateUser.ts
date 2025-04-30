import { Router, Request, Response } from 'express';
import Job from '../../models/AdminModels/JobListing';  
import User from '../../models/AdminModels/AdminDoctorModel';







const router = Router();


// New endpoint to get jobs from MongoDB
router.get("/jobs", async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// New route to get only doctors
router.get("/doctors", async (req: Request, res: Response) => {
  try {
    const doctors = await User.find({ userType: 'Doctor' });
    res.json(doctors);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;