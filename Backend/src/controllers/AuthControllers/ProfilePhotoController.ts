import { Request, Response } from 'express';
import cloudinary from '../../Config/cloudinaryConfig';
import User from '../../models/UserModel';
import fs from 'fs';
import path from 'path';

export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const userId = req.params.userId || req.body.userId;
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Upload to Cloudinary (most permissive)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile-photos',
      resource_type: 'image',
      // allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // removed for permissiveness
      // transformation: [ ... ] // removed for permissiveness
    });

    // Delete the temporary file from server
    fs.unlinkSync(req.file.path);

    // Update user's photoUrl in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { photoUrl: result.secure_url },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        photoUrl: result.secure_url,
        publicId: result.public_id,
        user: {
          id: updatedUser?._id,
          name: updatedUser?.name,
          email: updatedUser?.email,
          userType: updatedUser?.userType
        }
      }
    });

  } catch (error) {
    console.error('Profile photo upload error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temporary file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload profile photo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteProfilePhoto = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // If user has a photoUrl, delete from Cloudinary
    if (user.photoUrl) {
      try {
        // Extract public_id from URL
        const urlParts = user.photoUrl.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];
        const fullPublicId = `profile-photos/${publicId}`;
        
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database update even if Cloudinary deletion fails
      }
    }

    // Update user's photoUrl to empty string
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { photoUrl: '' },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile photo deleted successfully',
      data: {
        user: {
          id: updatedUser?._id,
          name: updatedUser?.name,
          email: updatedUser?.email,
          userType: updatedUser?.userType,
          photoUrl: updatedUser?.photoUrl
        }
      }
    });

  } catch (error) {
    console.error('Profile photo deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile photo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getProfilePhoto = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const user = await User.findById(userId).select('photoUrl name');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        photoUrl: user.photoUrl,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Get profile photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile photo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 