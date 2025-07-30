import express, { Request, Response } from "express";
import CvDoctorUpdate from '../../models/CvUpdate';
import { supabase } from "../../utils/supabase";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

exports.viewDoctorsCv = async (req: Request, res: Response) => {
    try {
        const { yourName } = req.query; // Get the name query parameter (e.g., "mok")
        if (!yourName) {
            return res.status(400).json({ message: 'Name query is required' });
        }

        // Use regex to find names that start with the input (case-insensitive)
        const users = await CvDoctorUpdate.find(
            { yourName: { $regex: `^${yourName}`, $options: 'i' } }, // Match yourName field
            { yourName: 1, _id: 0 } // Only return the yourName field
        ).limit(5); // Limit to 5 suggestions for performance

        const names = users.map(user => user.yourName); // Extract yourName into an array
        res.status(200).json(names);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDoctorCv = async (req: Request, res: Response) => {
    try {
        const { yourName } = req.query;
        if (!yourName) {
            return res.status(400).json({ message: 'Name query is required' });
        }

        const user = await CvDoctorUpdate.findOne({ yourName });
        if (!user) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addDoctorCv = async (req: Request, res: Response) => {
    try {
        console.log("Received CV data:", req.body);
  
        const { resumeRawUrl, certificationInput: certInput, userId, ...bodyData } = req.body;

        // Validate required fields
        const requiredFields = [
            'yourName', 'professionalTitle', 'currentLocation', 'careerSummary',
            'contactPhone', 'contactEmail', 'medicalDegree', 'university',
            'specialization', 'experience', 'medicalLicenseNumber',
            'medicalLicenseIssuer', 'jobTitle', 'hospitalInstitution', 'employmentPeriod'
        ];

        const missingFields = requiredFields.filter(field => !bodyData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                fields: missingFields
            });
        }

        // Validate resumeRawUrl (should be a Supabase storage URL)
        if (!resumeRawUrl) {
            return res.status(400).json({
                message: "Resume file URL is required"
            });
        }

        // Verify it's a Supabase URL and not Cloudinary
        if (resumeRawUrl.includes('cloudinary.com')) {
            return res.status(400).json({
                message: "Cloudinary URLs are not allowed. Please use Supabase storage."
            });
        }

        if (!resumeRawUrl.includes('supabase.co')) {
            return res.status(400).json({
                message: "Invalid storage URL. Only Supabase URLs are allowed."
            });
        }

        console.log("Resume URL validation passed:", resumeRawUrl);

        // Handle certification input
        let certificationInput: string[] = [];
        if (certInput) {
            try {
                const parsed = typeof certInput === 'string'
                    ? JSON.parse(certInput)
                    : certInput;
                certificationInput = Array.isArray(parsed) ? parsed : [String(parsed)];
            } catch (e) {
                certificationInput = [String(certInput)];
            }
        }

        // Create doctor data
        const doctorData = {
            ...bodyData,
            resumeRawUrl, // This should be the Supabase URL
            certificationInput,
            userId // Add userId to the CV data
        };

        console.log("Saving doctor data to MongoDB:", doctorData);

        // Save to database
        const doctor = new CvDoctorUpdate(doctorData);
        const result = await doctor.save();

        console.log("Doctor CV saved successfully:", result._id);

        res.status(201).json({
            message: "Doctor CV added successfully",
            doctorId: result._id,
            resumeRawUrl, // Return the Supabase URL
            data: result
        });

    } catch (error) {
        console.error("Error adding Doctor CV:", error);
        res.status(500).json({
            message: "Failed to add Doctor CV",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

exports.ReplaceCv = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const data = req.body;

        // If there's a new resume file, the frontend should handle Supabase upload
        // and send the new URL in the request body
        
        const result = await CvDoctorUpdate.findOneAndReplace({ _id: id }, data, { new: true });
        
        if (result) {
            res.status(200).json({
                message: "Doctor CV updated successfully",
                doctorId: result._id,
                data: result
            });
        } else {
            res.status(404).json({
                message: "Doctor CV not found"
            });
        }
    } catch (error) {
        console.error("Error replacing Doctor CV:", error);
        res.status(500).json({
            message: "Doctor CV not updated",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// Get CV data by userId
exports.getCvByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        console.log("Searching for CV with userId:", userId);

        // First try to find CV by userId
        let cvData = await CvDoctorUpdate.findOne({ 
            userId: userId 
        }).sort({ createdAt: -1 });

        // If not found by userId, try to find by user's email (fallback for existing records)
        if (!cvData) {
            console.log("CV not found by userId, trying to find by email...");
            
            // Get user's email from the user collection
            const User = require('../../models/UserModel').default;
            const user = await User.findById(userId);
            
            if (user && user.email) {
                console.log("Searching for CV with email:", user.email);
                cvData = await CvDoctorUpdate.findOne({ 
                    contactEmail: user.email 
                }).sort({ createdAt: -1 });
            }
            
            // If still not found, try to find by user's name (another fallback)
            if (!cvData && user && user.name) {
                console.log("CV not found by email, trying to find by name:", user.name);
                cvData = await CvDoctorUpdate.findOne({ 
                    yourName: user.name 
                }).sort({ createdAt: -1 });
            }
        }

        if (!cvData) {
            console.log("No CV found for user");
            return res.status(404).json({ 
                message: 'No CV found for this user',
                hasCv: false 
            });
        }

        console.log("CV found:", cvData.yourName, "with resume URL:", cvData.resumeRawUrl);

        res.status(200).json({
            message: 'CV data retrieved successfully',
            hasCv: true,
            cvData: {
                resumeRawUrl: cvData.resumeRawUrl,
                yourName: cvData.yourName,
                contactEmail: cvData.contactEmail,
                contactPhone: cvData.contactPhone,
                experience: cvData.experience
            }
        });

    } catch (error) {
        console.error("Error getting CV by userId:", error);
        res.status(500).json({
            message: "Failed to get CV data",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

exports.updateCv = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const data = req.body;

        // If there's a new resume file, the frontend should handle Supabase upload
        // and send the new URL in the request body
        
        const result = await CvDoctorUpdate.findByIdAndUpdate(id, data, { new: true });
        
        if (result) {
            res.status(200).json({
                message: "Doctor CV updated successfully",
                doctorId: result._id,
                data: result
            });
        } else {
            res.status(404).json({
                message: "Doctor CV not found"
            });
        }
    } catch (error) {
        console.error("Error updating Doctor CV:", error);
        res.status(500).json({
            message: "Doctor CV not updated",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

exports.deleteCv = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        
        // First get the CV to extract the file URL for deletion
        const cv = await CvDoctorUpdate.findById(id);
        
        if (!cv) {
            return res.status(404).json({
                message: "Doctor CV not found"
            });
        }

        // Extract file path from Supabase URL and delete the file
        if (cv.resumeRawUrl) {
            try {
                // Extract the file path from the Supabase URL
                const url = new URL(cv.resumeRawUrl);
                const pathParts = url.pathname.split('/');
                const bucketIndex = pathParts.findIndex(part => part === 'cvdata');
                
                if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
                    const filePath = pathParts.slice(bucketIndex + 1).join('/');
                    
                    // Delete the file from Supabase storage
                    const { error: deleteError } = await supabase.storage
                        .from('cvdata')
                        .remove([filePath]);
                    
                    if (deleteError) {
                        console.error("Error deleting file from Supabase:", deleteError);
                    }
                }
            } catch (error) {
                console.error("Error parsing Supabase URL:", error);
            }
        }

        // Delete the CV document from database
        const result = await CvDoctorUpdate.findByIdAndDelete(id);
        
        res.status(200).json({
            message: "Doctor CV deleted successfully",
            doctorId: result?._id
        });
        
    } catch (error) {
        console.error("Error deleting Doctor CV:", error);
        res.status(500).json({
            message: "Doctor CV not deleted",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const profile = async (req: Request, res: Response) => {
    try {
        const physician = await CvDoctorUpdate.findById(req.params.id);
        if (!physician) return res.status(404).json({ message: "Not found" });
        res.json(physician);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};