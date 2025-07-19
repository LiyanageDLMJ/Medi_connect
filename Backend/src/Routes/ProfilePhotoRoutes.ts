import express from 'express';
import { uploadProfilePhoto, deleteProfilePhoto, getProfilePhoto } from '../controllers/AuthControllers/ProfilePhotoController';
import profilePhotoUpload from '../middleware/profilePhotoUpload';

const router = express.Router();

// Upload profile photo
router.post('/upload/:userId', profilePhotoUpload.single('profilePhoto'), uploadProfilePhoto);

// Upload profile photo (alternative route with userId in body)
router.post('/upload', profilePhotoUpload.single('profilePhoto'), uploadProfilePhoto);

// Delete profile photo
router.delete('/:userId', deleteProfilePhoto);

// Get profile photo
router.get('/:userId', getProfilePhoto);

export default router; 