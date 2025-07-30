import { Request, Response } from "express";
import validator from "validator";
import getDegreeModel from "../../models/Degree";
import getDegreeApplicationModel from "../../models/DegreeApplication";
import cloudinary from "../../Config/cloudinaryDegreeConfig";
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

    // Create application record
    let cvUrl = "";
    if (req.file) {
      try {
        console.log('=== CV Upload Debug ===');
        console.log('File path:', req.file.path);
        console.log('File mimetype:', req.file.mimetype);
        
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "degree-cvs",
          resource_type: "raw", // Use raw for PDF files
          use_filename: true,
          access_mode: "public",
          public_id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          // Ensure the file is publicly accessible
          type: "upload",
          overwrite: false,
          // Add additional parameters for better accessibility
          flags: "attachment",
          format: "pdf"
        });
        
        console.log('Cloudinary upload result:', result);
        console.log('Secure URL:', result.secure_url);
        
        cvUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        res.status(500).json({
          success: false,
          message: "Failed to upload CV to cloud storage",
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
      cv: cvUrl,
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
    console.log('degree found:', degree.degreeName, 'at', degree.institution);
    console.log('applicantType received:', applicantType);
    console.log('applicantType type:', typeof applicantType);
    console.log('Application data:', applicationData);
    console.log('Application data applicantType:', applicationData.applicantType);

    // Try to save the application with detailed error handling
    let savedApplication;
    try {
      console.log('Attempting to save application to database...');
      console.log('Database connection state:', mongoose.connection.readyState);
      console.log('Current database:', mongoose.connection.db?.databaseName);
      
      savedApplication = await getDegreeApplicationModel().create(applicationData);
      console.log('Application saved successfully!');
    } catch (dbError) {
      console.error('Database save error:', dbError);
      console.error('Database error details:', {
        message: dbError instanceof Error ? dbError.message : "Unknown database error",
        stack: dbError instanceof Error ? dbError.stack : "No stack trace",
        name: dbError instanceof Error ? dbError.name : "Unknown error name"
      });
      res.status(500).json({
        success: false,
        message: "Failed to save application to database",
        error: process.env.NODE_ENV === "development" ? (dbError instanceof Error ? dbError.message : "Unknown database error") : undefined,
      });
      return;
    }

    console.log('=== DEBUG: Application Saved ===');
    console.log('Saved application ID:', savedApplication._id);
    console.log('Saved institutionId:', savedApplication.institutionId);
    console.log('Saved degreeId:', savedApplication.degreeId);

    // Create notification for the institution
    if (degree?.institutionId) {
      try {
        await createNotification(
          degree.institutionId,
          'Educational Institute',
          'New Degree Application',
          `${name} has applied for ${degreeName} at ${institution}`,
          'application_status',
          {
            degreeId: degreeId,
            applicationId: savedApplication._id,
            institutionId: degree.institutionId,
            applicantName: name,
            applicantEmail: email
          }
        );
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the application if notification fails
      }
    }

    // Create notification for the applicant
    // Get user ID from JWT token instead of header
    const userId = (req as any).user?._id;
    if (userId) {
      try {
        await createNotification(
          userId,
          applicantType === 'MedicalStudent' ? 'Medical Student' : 'Professional Doctor',
          'Application Submitted',
          `Your application for ${degreeName} at ${institution} has been submitted successfully`,
          'application_status',
          {
            degreeId: degreeId,
            applicationId: savedApplication._id,
            institutionId: degree?.institutionId,
            degreeName: degreeName,
            institution: institution
          }
        );
      } catch (notificationError) {
        console.error('Error creating applicant notification:', notificationError);
        // Don't fail the application if notification fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationId: savedApplication._id,
        submissionDate: savedApplication.submissionDate,
        degreeName: savedApplication.degreeName,
        institution: savedApplication.institution,
      },
    });
  } catch (error: unknown) {
    console.error("Error submitting application:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      name: error instanceof Error ? error.name : "Unknown error name"
    });
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your application",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// New endpoint to serve CV files with authentication
export const getCvFile = async (req: Request, res: Response) => {
  try {
    console.log('=== CV File Request Debug ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request params:', req.params);
    console.log('Request headers:', req.headers);
    const { cvUrl } = req.params;
    console.log('Requested CV URL:', cvUrl);
    
    if (!cvUrl) {
      return res.status(400).json({ message: "CV URL is required" });
    }

    // If it's a Cloudinary URL, use Cloudinary SDK directly
    if (cvUrl.includes('cloudinary.com')) {
      console.log('Detected Cloudinary URL, using Cloudinary SDK...');
      try {
        // Extract public_id from the URL
        console.log('Full CV URL:', cvUrl);
        
        let publicId = '';
        
        // Method 1: Extract the full public_id including folder and extension
        if (cvUrl.includes('/degree-cvs/')) {
          const degreeCvsIndex = cvUrl.indexOf('/degree-cvs/');
          const afterDegreeCvs = cvUrl.substring(degreeCvsIndex + '/degree-cvs/'.length);
          publicId = 'degree-cvs/' + afterDegreeCvs; // Include folder prefix and extension
          console.log('Method 1 - Extracted public_id:', publicId);
          console.log('Debug - degreeCvsIndex:', degreeCvsIndex);
          console.log('Debug - afterDegreeCvs:', afterDegreeCvs);
          console.log('Debug - final publicId:', publicId);
        }
        
        if (!publicId) {
          throw new Error('Could not extract public_id from URL');
        }
        
        // Use Cloudinary SDK to get the file
        const result = await cloudinary.api.resource(publicId, {
          resource_type: 'raw',
          type: 'upload'
        });
        
        console.log('Cloudinary SDK result:', result);
        
        // Try to use the derived transformation URL from the SDK result
        console.log('Attempting to use derived transformation URL...');
        
        try {
          // Check if there's a derived transformation with fl_attachment
          const derivedTransformation = result.derived?.find(d => d.transformation === 'fl_attachment');
          
          if (derivedTransformation) {
            console.log('Found derived transformation with fl_attachment');
            const derivedUrl = derivedTransformation.secure_url;
            console.log('Using derived URL:', derivedUrl);
            
            // Fetch the file using the derived URL
            const derivedResponse = await fetch(derivedUrl);
            console.log('Derived response status:', derivedResponse.status);
            
            if (derivedResponse.ok) {
              console.log('Derived URL successful, processing...');
              const derivedArrayBuffer = await derivedResponse.arrayBuffer();
              const derivedBuffer = Buffer.from(derivedArrayBuffer);
              
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Length', derivedBuffer.length);
              res.setHeader('Content-Disposition', 'inline; filename="cv.pdf"');
              res.setHeader('Cache-Control', 'public, max-age=3600');
              
              res.send(derivedBuffer);
            } else {
              console.error("Derived URL failed:", derivedResponse.status, derivedResponse.statusText);
              
              // Fallback: try the original secure_url
              console.log('Trying original secure_url...');
              const originalResponse = await fetch(result.secure_url);
              console.log('Original response status:', originalResponse.status);
              
              if (originalResponse.ok) {
                console.log('Original URL successful, processing...');
                const originalArrayBuffer = await originalResponse.arrayBuffer();
                const originalBuffer = Buffer.from(originalArrayBuffer);
                
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Length', originalBuffer.length);
                res.setHeader('Content-Disposition', 'inline; filename="cv.pdf"');
                res.setHeader('Cache-Control', 'public, max-age=3600');
                
                res.send(originalBuffer);
              } else {
                console.error("Original URL also failed:", originalResponse.status, originalResponse.statusText);
                res.status(404).json({ 
                  message: "CV file not found or not accessible",
                  error: `Both derived and original URLs failed. Derived: ${derivedResponse.status}, Original: ${originalResponse.status}`
                });
              }
            }
          } else {
            console.log('No derived transformation found, trying original secure_url...');
            const originalResponse = await fetch(result.secure_url);
            console.log('Original response status:', originalResponse.status);
            
            if (originalResponse.ok) {
              console.log('Original URL successful, processing...');
              const originalArrayBuffer = await originalResponse.arrayBuffer();
              const originalBuffer = Buffer.from(originalArrayBuffer);
              
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Length', originalBuffer.length);
              res.setHeader('Content-Disposition', 'inline; filename="cv.pdf"');
              res.setHeader('Cache-Control', 'public, max-age=3600');
              
              res.send(originalBuffer);
            } else {
              console.error("Original URL failed:", originalResponse.status, originalResponse.statusText);
              res.status(404).json({ 
                message: "CV file not found or not accessible",
                error: `Original URL failed: ${originalResponse.status}`
              });
            }
          }
        } catch (downloadError) {
          console.error("Download approach failed:", downloadError);
          res.status(404).json({ 
            message: "CV file not found or not accessible",
            error: `Download approach failed: ${downloadError instanceof Error ? downloadError.message : 'Unknown error'}`
          });
        }
      } catch (sdkError) {
        console.error("Cloudinary SDK failed:", sdkError);
        res.status(404).json({ 
          message: "CV file not found or not accessible",
          error: `Cloudinary SDK failed: ${sdkError instanceof Error ? sdkError.message : 'Unknown error'}`
        });
      }
    } else {
      console.log('Not a Cloudinary URL:', cvUrl);
      res.status(400).json({ message: "Invalid CV URL - must be a Cloudinary URL" });
    }
  } catch (error) {
    console.error("Error serving CV file:", error);
    res.status(500).json({ 
      message: "Failed to serve CV file",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};