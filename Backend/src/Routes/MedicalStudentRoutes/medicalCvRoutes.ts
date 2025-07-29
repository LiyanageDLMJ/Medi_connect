import express from "express";
import {
  createMedicalCv,
  getMedicalCvByUser,
  updateMedicalCv,
  deleteMedicalCv
} from "../../controllers/medicalStudentControllers/medicalCvController";

const router = express.Router();

router.post("/", createMedicalCv);
router.get("/:userId", getMedicalCvByUser);
router.put("/:id", updateMedicalCv);
router.delete("/:id", deleteMedicalCv);

export default router;