import express from 'express';
import path from 'path';
import { mkdirp } from 'mkdirp';

import CvDoctorUpdate from '../../models/CvUpdate';
const router = express.Router();
const multer = require("multer");



// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../../uploads');
mkdirp.sync(uploadDir);

// Configure multer
const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      cb(null, uploadDir);
    },
  
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

const upload = multer({ storage: storage });

const docCvController = require('../../controllers/physicianControllers/cvController');

router.get("/viewDoctorsCv",docCvController.viewDoctorsCv);
router.get("/getDoctorCv", docCvController.getDoctorCv);
router.get("/getCvByUserId/:userId", docCvController.getCvByUserId);
router.post("/addDoctorCv",upload.single('resume'),docCvController.addDoctorCv);
router.put("/ReplaceCv/:id",docCvController.ReplaceCv);
router.patch("/updateCv/:id",docCvController.updateCv);
router.delete("/deleteCv/:id",docCvController.deleteCv);

export default router;