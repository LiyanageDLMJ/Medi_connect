import { Router, Request, Response } from 'express';
import Job from '../../models/AdminModels/JobListing';  
import User from '../../models/AdminModels/AdminDoctorModel';
import MedicalStudent from '../../models/AdminModels/AdminStudentModel';
import Institute from '../../models/AdminModels/AdminInstitute';







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

// New route to get only medical students
router.get("/MedicalStudent", async (req: Request, res: Response) => {
  try {
    const medicalStudents = await MedicalStudent.find({ userType: 'MedicalStudent' });
    res.json(medicalStudents);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// New route to get only institutes
router.get("/institutes", async (req: Request, res: Response) => {
  try {
    const institutes = await Institute.find({ userType: 'EducationalInstitute' });
    res.json(institutes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;