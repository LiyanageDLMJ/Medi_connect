import express from "express";
import multer from "multer";
import {
  createMedicalCv,
  getMedicalCvByUser,
  updateMedicalCv,
  deleteMedicalCv
} from "../../controllers/medicalStudentControllers/medicalCvController";

const router = express.Router();
const upload = multer({ dest: "uploads/cv/" }); // Make sure this folder exists

// Use multer for file upload
router.post("/", upload.single("cv"), createMedicalCv);

router.get("/:userId", getMedicalCvByUser);
router.put("/:id", updateMedicalCv);
router.delete("/:id", deleteMedicalCv);

export default router;