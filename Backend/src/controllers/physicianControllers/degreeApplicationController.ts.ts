import { Request, Response } from "express";
import validator from "validator";
import getDegreeModel from "../../models/Degree";
import getDegreeApplicationModel from "../../models/DegreeApplication";
import fs from "fs";
import mongoose from "mongoose";
import { createNotification } from "../../controllers/notificationController";

interface ApplicationRequestBody {
  name: string;
  email: string;
  phone?: string;
  currentEducation?: string;
  linkedIn?: string;
  portfolio?: string;
  additionalInfo?: string;
  degreeId: number;
  degreeName: string;
  institution: string;
  applicantType?: string; // Add applicantType field
}

export const submitApplication = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone = "",
      currentEducation = "",
      linkedIn = "",
      portfolio = "",
      additionalInfo = "",
      degreeId,
      degreeName,
      institution,
      applicantType = "", // Add applicantType with default
    } = req.body as ApplicationRequestBody;

    // Validate required fields
    const requiredFields = ["name", "email", "degreeId", "degreeName", "institution"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
      return;
    }

    // Validate degreeId is a non-empty string
    if (!degreeId || typeof degreeId !== "string") {
      res.status(400).json({
        success: false,
        message: "Degree ID must be a valid string",
      });
      return;
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    // Validate applicantType if provided
    if (applicantType && !['MedicalStudent', 'Doctor', 'Unknown'].includes(applicantType)) {
      res.status(400).json({
        success: false,
        message: "Invalid applicant type. Must be 'MedicalStudent', 'Doctor', or 'Unknown'",
      });
      return;
    }

    // Get the degree to fetch institutionId
    let degree;
    try {
      console.log('=== DEBUG: Degree Lookup ===');
      console.log('degreeId received:', degreeId);
      console.log('degreeId type:', typeof degreeId);
      console.log('Is valid ObjectId:', mongoose.Types.ObjectId.isValid(degreeId));
      
      // First try to find by ObjectId
      if (mongoose.Types.ObjectId.isValid(degreeId)) {
        console.log('Trying to find by ObjectId...');
        degree = await getDegreeModel().findById(degreeId);
        console.log('Found by ObjectId:', degree ? 'Yes' : 'No');
      }
      
      // If not found by ObjectId, try to find by courseId
      if (!degree) {
        // Check if degreeId is a number
        const courseIdNumber = parseInt(degreeId);
        console.log('Parsed courseIdNumber:', courseIdNumber);
        console.log('Is NaN:', isNaN(courseIdNumber));
        
        if (!isNaN(courseIdNumber)) {
          console.log('Trying to find by courseId number...');
          degree = await getDegreeModel().findOne({ courseId: courseIdNumber });
          console.log('Found by courseId number:', degree ? 'Yes' : 'No');
        }
      }
      
      // If still not found, try exact string match
      if (!degree) {
        console.log('Trying to find by exact string match...');
        degree = await getDegreeModel().findOne({ courseId: degreeId });
        console.log('Found by string match:', degree ? 'Yes' : 'No');
      }
    } catch (queryError) {
      console.error('Error querying degree:', queryError);
      res.status(500).json({
        success: false,
        message: "Error finding degree information",
      });
      return;
    }

    if (!degree) {
      res.status(404).json({
        success: false,
        message: "Degree not found",
      });
      return;
    }

    // Handle CV file - store locally instead of Cloudinary
    let cvPath = "";
    if (req.file) {
      try {
        console.log('=== CV Upload Debug (Local Storage) ===');
        console.log('File path:', req.file.path);
        console.log('File mimetype:', req.file.mimetype);
        console.log('File originalname:', req.file.originalname);
        
        // The file is already saved locally by multer
        cvPath = req.file.path;
        
        console.log('CV saved locally at:', cvPath);
      } catch (uploadError) {
        console.error("CV upload error:", uploadError);
        res.status(500).json({
          success: false,
          message: "Failed to upload CV",
        });
        return;
      }
    }

    const applicationData = {
      name,
      email,
      phone,
      currentEducation,
      linkedIn,
      portfolio,
      additionalInfo,
      degreeId,
      degreeName,
      institution,
      institutionId: degree.institutionId, // Add institutionId from degree
      applicantType: applicantType || "Unknown", // Add applicantType with fallback
      cv: cvPath, // Store local file path instead of Cloudinary URL
      submissionDate: new Date(),
    };

    // Validate that all required fields are present
    const requiredFieldsForSave = ['name', 'email', 'degreeId', 'degreeName', 'institution', 'institutionId'];
    const missingRequiredFields = requiredFieldsForSave.filter(field => !applicationData[field as keyof typeof applicationData]);
    
    if (missingRequiredFields.length > 0) {
      console.error('Missing required fields:', missingRequiredFields);
      res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingRequiredFields.join(', ')}`,
      });
      return;
    }

    console.log('=== DEBUG: Application Submission ===');
    console.log('degreeId being stored:', degreeId);
    console.log('degreeId type:', typeof degreeId);
    console.log('institutionId from degree:', degree.institutionId);
    console.log('CV path being stored:', cvPath);

    // Save the application
    const DegreeApplication = getDegreeApplicationModel();
    const newApplication = new DegreeApplication(applicationData);
    const savedApplication = await newApplication.save();

    console.log('Application saved successfully:', savedApplication._id);

    // Create notification for the institute
    if (degree.institutionId) {
      try {
        await createNotification(
          degree.institutionId,
          'Educational Institute',
          'New Degree Application',
          `${name} has applied for ${degreeName} at your institution.`,
          'application_status',
          {
            applicationId: savedApplication._id,
            applicantName: name,
            degreeName: degreeName,
            applicantEmail: email
          }
        );
        console.log('Notification created for institute');
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the application if notification fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: savedApplication
    });

  } catch (error: any) {
    console.error("Error submitting degree application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message
    });
  }
};

// New endpoint to serve CV files with authentication
export const getCvFile = async (req: Request, res: Response) => {
  try {
    console.log('=== CV File Request Debug (Local Storage) ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request params:', req.params);
    console.log('Request headers:', req.headers);
    const { cvUrl } = req.params;
    console.log('Requested CV path:', cvUrl);
    
    if (!cvUrl) {
      return res.status(400).json({ message: "CV path is required" });
    }

    // For local storage, cvUrl is actually the file path
    const filePath = cvUrl;
    console.log('File path to serve:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found at path:', filePath);
      return res.status(404).json({ 
        message: "CV file not found",
        error: "File does not exist on server"
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    console.log('File stats:', {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', 'inline; filename="cv.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
      console.error('Error reading file:', error);
      res.status(500).json({ 
        message: "Error reading CV file",
        error: error.message
      });
    });

    fileStream.pipe(res);

  } catch (error) {
    console.error('Error serving CV file:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};