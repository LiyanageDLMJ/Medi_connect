import express from 'express';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cloudinary from '../Config/cloudinaryConfig';
import User from '../models/UserModel';

const router = express.Router();

// Extend Express request to include userId added by auth middleware
interface AuthRequest extends Request {
  userId?: string;
}

// TODO: replace with proper JWT auth middleware
const mockAuth = (req: Request, _res: Response, next: NextFunction) => {
  // expect header "x-user-id" for simplicity
  (req as AuthRequest).userId = req.header('x-user-id') || undefined;
  next();
};

// Configure multer storage for temporary file upload
const uploadDir = path.join(__dirname, '../../uploads/profile');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${(req as AuthRequest).userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed") as any);
    }
  },
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get current user's profile
router.get('/', mockAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as AuthRequest).userId;
    if (!userId) return res.status(401).json({ message: 'Unauthenticated' });
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Map currentInstitute to school for MedicalStudent
    if (user.userType === 'MedicalStudent' && (user as any).currentInstitute) {
      (user as any).school = (user as any).currentInstitute;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific user's profile by ID (for chat app)
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });
    
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Map currentInstitute to school for MedicalStudent
    if (user.userType === 'MedicalStudent' && (user as any).currentInstitute) {
      (user as any).school = (user as any).currentInstitute;
    }
    
    res.json(user);
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile (with Cloudinary photo upload)
router.put('/', mockAuth, upload.single('photo'), async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as AuthRequest).userId;
    if (!userId) return res.status(401).json({ message: 'Unauthenticated' });
    
    const updateData: any = { ...req.body };
    // Fix: Convert 'resetPasswordExpires' string 'null' to actual null
    if (updateData.resetPasswordExpires === 'null') {
      updateData.resetPasswordExpires = null;
    }
    
    // Handle photo upload to Cloudinary
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile-photos',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
        
        // Delete the temporary file from server
        fs.unlinkSync(req.file.path);
        
        // Update photoUrl with Cloudinary URL
        updateData.photoUrl = result.secure_url;
        
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        
        // Clean up uploaded file if it exists
        if (req.file && req.file.path) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (unlinkError) {
            console.error('Error deleting temporary file:', unlinkError);
          }
        }
        
        return res.status(500).json({ 
          message: 'Failed to upload photo to Cloudinary',
          error: cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown error'
        });
      }
    }
    
    // If user is MedicalStudent and school is provided, update currentInstitute as well
    const user = await User.findById(userId);
    if (user && user.userType === 'MedicalStudent') {
      if (updateData.school) {
        updateData.currentInstitute = updateData.school;
      }
      if (updateData.fieldOfStudy) {
        updateData.field_of_study = updateData.fieldOfStudy;
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).lean();

    // Map currentInstitute to school for MedicalStudent
    if (updatedUser && updatedUser.userType === 'MedicalStudent') {
      if ((updatedUser as any).currentInstitute) {
        (updatedUser as any).school = (updatedUser as any).currentInstitute;
      }
      if ((updatedUser as any).field_of_study) {
        (updatedUser as any).fieldOfStudy = (updatedUser as any).field_of_study;
      }
    }
    
    res.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser,
      photoUploaded: !!req.file
    });
    
  } catch (err) {
    console.error('Profile update error:', err);
    
    // Clean up uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temporary file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      message: 'Server error',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

// Delete current user's account
router.delete('/', mockAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req as AuthRequest).userId;
    const { reason } = req.body;
    if (!userId) return res.status(401).json({ message: 'Unauthenticated' });
    
    // Get user before deletion to clean up Cloudinary image
    const user = await User.findById(userId);
    if (user && user.photoUrl) {
      try {
        // Extract public_id from URL
        const urlParts = user.photoUrl.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];
        const fullPublicId = `profile-photos/${publicId}`;
        
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with account deletion even if Cloudinary deletion fails
      }
    }
    
    // Optionally log the reason for auditing
    if (reason) {
      console.log(`User ${userId} deleted their account. Reason: ${reason}`);
      // You could also save this to a DB collection if needed
    }
    
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Account deleted successfully' });
    
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

export default router;
