import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName || "db9rhbyij",
  api_key: apiKey || "884286557911137",
  api_secret: apiSecret || "ohshmCYeCPvFNXCMWaHboDHB7vI",
  secure: true,
});

// Utility functions for PDF URLs (now using default image resource_type)
export const generatePdfUrl = (publicId: string) => {
  return cloudinary.url(publicId, {
    resource_type: 'image',
    type: 'upload',
    flags: 'attachment', // Forces download
    secure: true
  });
};

export const generatePdfPreviewUrl = (publicId: string) => {
  return cloudinary.url(publicId, {
    resource_type: 'image',
    type: 'upload',
    secure: true
  });
};

// Helper to extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  if (!url || !url.includes('cloudinary')) return null;
  
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload'
    const afterUpload = urlParts.slice(uploadIndex + 1);
    let publicId = afterUpload.join('/');
    
    // Remove version number if present
    publicId = publicId.replace(/^v\d+\//, '');
    
    // Remove file extension
    publicId = publicId.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

export default cloudinary;