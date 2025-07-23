import express from 'express';
import multer from 'multer';
import path from 'path';
import mkdirp from 'mkdirp';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../../uploads');
mkdirp.sync(uploadDir);

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

const docCvController = require('../../controllers/physicianControllers/cvController');
router.get("/profile/:id", docCvController.profile);
router.get("/viewDoctorsCv", docCvController.viewDoctorsCv);
router.get("/getDoctorCv", docCvController.getDoctorCv);
router.post("/addDoctorCv", upload.single('resume'), docCvController.addDoctorCv);
router.put("/ReplaceCv/:id", docCvController.ReplaceCv);
router.patch("/updateCv/:id", docCvController.updateCv);
router.delete("/deleteCv/:id", docCvController.deleteCv);

export default router;