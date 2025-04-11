import express from 'express';
import CvDoctorUpdate from '../models/CvUpdate';
const router = express.Router();
const docCvController=require('../controllers/cvController');

router.get("/viewDoctorsCv",docCvController.viewDoctorsCv);
router.post("/addDoctorCv",docCvController.addDoctorCv);
router.put("/ReplaceCv/:id",docCvController.ReplaceCv);
router.patch("/updateCv/:id",docCvController.updateCv);
router.delete("/deleteCv/:id",docCvController.deleteCv);

export default router;