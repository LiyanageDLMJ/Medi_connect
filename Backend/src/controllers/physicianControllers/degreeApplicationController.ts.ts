import { Request, Response } from 'express';
import validator from 'validator';
import Degree from '../../models/Degree';
import DegreeApplication from '../../models/DegreeApplication';

interface ApplicationRequestBody {
  name: string;
  email: string;
  phone?: string;
  currentEducation?: string;
  linkedIn?: string;
  portfolio?: string;
  additionalInfo?: string;
  degreeId: number; // Explicit number type
  degreeName: string;
  institution: string;
}

export const submitApplication = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone = '',
      currentEducation = '',
      linkedIn = '',
      portfolio = '',
      additionalInfo = '',
      degreeId,
      degreeName,
      institution
    } = req.body as ApplicationRequestBody;

    // Validate degreeId is a number
    if (typeof degreeId !== 'number' || isNaN(degreeId)) {
      return res.status(400).json({
        success: false,
        message: 'Degree ID must be a valid number'
      });
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'degreeId', 'degreeName', 'institution'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // ... rest of the controller logic remains the same ...
    // Just use degreeId directly (no parsing needed)

    // Create application record
    const applicationData = {
      name,
      email,
      phone,
      currentEducation,
      linkedIn,
      portfolio,
      additionalInfo,
      degreeId, // Using the validated number directly
      degreeName,
      institution,
      submissionDate: new Date(),
      status: 'Submitted'
    };

    const savedApplication = await DegreeApplication.create(applicationData);

    // Update degree statistics
    await Degree.findOneAndUpdate(
      { courseId: degreeId },
      { 
        $inc: { applicantsApplied: 1 },
        $set: { updatedAt: new Date() }
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: savedApplication._id,
        submissionDate: savedApplication.submissionDate,
        degreeName: savedApplication.degreeName,
        institution: savedApplication.institution
      }
    });

  } catch (error: unknown) {
    console.error('Error submitting application:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your application',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};