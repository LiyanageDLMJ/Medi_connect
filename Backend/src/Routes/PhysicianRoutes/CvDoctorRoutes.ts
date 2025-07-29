import express from 'express';
import path from 'path';
import { mkdirp } from 'mkdirp';

import CvDoctorUpdate from '../../models/CvUpdate';
const router = express.Router();
const multer = require("multer");
const upload = multer();
const docCvController=require('../../controllers/physicianControllers/cvController');

router.get("/viewDoctorsCv",docCvController.viewDoctorsCv);
router.get("/getDoctorCv", docCvController.getDoctorCv);
router.post("/addDoctorCv",upload.single('resume'),docCvController.addDoctorCv);
router.put("/ReplaceCv/:id",docCvController.ReplaceCv);
router.patch("/updateCv/:id",docCvController.updateCv);
router.delete("/deleteCv/:id",docCvController.deleteCv);

export default router;