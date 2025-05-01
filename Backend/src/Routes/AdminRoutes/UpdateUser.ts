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


router.get("/allUsers", async (req: Request, res: Response) => {
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




router.get("/jobCount", async (req: Request, res: Response) => {
  try {
    const jobs = await Job.countDocuments();
    const fullTimeCount = await Job.countDocuments({ jobType: "Full-Time" });
    const partTimeCount = await Job.countDocuments({ jobType: "Part-Time" });
    const internCount = await Job.countDocuments({ jobType: "Internship" });
    
    const CardiologistCount = await Job.countDocuments({ title: "Cardiologist" });
    const PediatricianCount = await Job.countDocuments({ title: "Pediatrician" });
    const GeneralPhysicianCount = await Job.countDocuments({ title: "General Physician" });
    const PulmonologistCount = await Job.countDocuments({ title: "Neurosurgeon" });
    const OrthopedicsCount = await Job.countDocuments({ title: "Orthopedics" });
     
    
    res.json({
      totalJobs: jobs,
      fullTimeCount,
      partTimeCount,
      internCount,
      CardiologistCount,
      PediatricianCount,
      GeneralPhysicianCount,
      PulmonologistCount,
      OrthopedicsCount
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/users/count", async (req: Request, res: Response) => {
  try {
    const total = await User.countDocuments();
    const doctorCount = await User.countDocuments({ userType: "Doctor" });
    const studentCount = await User.countDocuments({ userType: "MedicalStudent" });
    const instituteCount = await User.countDocuments({ userType: "EducationalInstitute" });
    const recruiterCount = await User.countDocuments({ userType: "Recruiter" });
    
    const CardiologistCount = await User.countDocuments({ specialty: "Cardiologist" });
    const PediatricianCount = await User.countDocuments({ specialty: "Pediatrician" });
    const GeneralPhysicianCount = await User.countDocuments({ specialty: "GeneralPhysician" });
    const PulmonologistCount = await User.countDocuments({ specialty: "Pulmonologist" });
    const EndocrinologistCount = await User.countDocuments({ specialty: "Endocrinologist" });
    
    const BiomedicineCount = await User.countDocuments({ fieldOfStudy: "Biomedicine" });
    const DentistryCount = await User.countDocuments({ fieldOfStudy: "Dentistry" });
    const ClinicalChemistryCount = await User.countDocuments({ fieldOfStudy: "ClinicalChemistry" });
    const GeneralMedicineCount = await User.countDocuments({ fieldOfStudy: "General Medicine" });


    res.json({
      total,
      doctorCount,
      studentCount,
      instituteCount,
      recruiterCount,
      CardiologistCount,
      PediatricianCount,
      GeneralPhysicianCount,
      PulmonologistCount,
      EndocrinologistCount,
      BiomedicineCount,
      DentistryCount,
      ClinicalChemistryCount,
      GeneralMedicineCount,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});





export default router;