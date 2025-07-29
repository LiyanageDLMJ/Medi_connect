import express from 'express';

import {
    createMedicalCv,
    getMedicalCvByUser,
    updateMedicalCv,
    deleteMedicalCv
} from '../../controllers/medicalStudentControllers/medicalCvController';

const router = express.Router();

// POST /medicalStudentCv  – create or upsert CV for current student
router.post('/', createMedicalCv);

// GET /medicalStudentCv/user/:userId – fetch single CV by userId
router.get('/user/:userId', getMedicalCvByUser);

// PUT /medicalStudentCv/:id – replace
router.put('/:id', updateMedicalCv);

// DELETE /medicalStudentCv/:id – remove
router.delete('/:id', deleteMedicalCv);

export default router; 