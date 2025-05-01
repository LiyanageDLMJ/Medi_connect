import { Request, Response } from 'express';
import validator from 'validator';
import Degree from '../../models/Degree';
import DegreeApplication from '../../models/DegreeApplication';

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
    } = req.body;

 // Validate degreeId is a number
 const parsedDegreeId = Number(degreeId);
 if (isNaN(parsedDegreeId)) {
   return res.status(400).json({
     success: false,
     message: 'Degree ID must be a number'
   });
 }

    // Validate required fields
    if (!name || !email || !degreeId || !degreeName || !institution) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, degreeId, degreeName, institution'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // // Validate degreeId format (must be a number)
    // const parsedDegreeId = parseInt(degreeId);
    // if (isNaN(parsedDegreeId)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Invalid degree ID format: must be a number'
    //   });
    // }

    // Check for duplicate application
    const existingApplication = await DegreeApplication.findOne({
      email,
      degreeId: parsedDegreeId
    });
    
    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this degree'
      });
    }

    // Verify degree exists
    const degree = await Degree.findOne({ courseId: parsedDegreeId });
    if (!degree) {
      console.log(`Degree not found with courseId: ${parsedDegreeId}`);
      return res.status(404).json({
        success: false,
        message: 'Degree program not found'
      });
    }

    // Check degree status and deadline
    const currentDate = new Date();
    if (degree.status === 'Closed') {
      return res.status(403).json({
        success: false,
        message: 'Applications are currently closed for this degree'
      });
    }

    if (degree.applicationDeadline && degree.applicationDeadline < currentDate) {
      return res.status(403).json({
        success: false,
        message: 'The application deadline has passed'
      });
    }

    // Create application record
    const applicationData = {
      name,
      email,
      phone,
      currentEducation,
      linkedIn,
      portfolio,
      additionalInfo,
      degreeId: parsedDegreeId,
      degreeName,
      institution,
      submissionDate: currentDate,
      status: 'Submitted'
    };

    const savedApplication = await DegreeApplication.create(applicationData);

    // Update degree statistics
    await Degree.findOneAndUpdate(
      { courseId: parsedDegreeId },
      { 
        $inc: { applicantsApplied: 1 },
        $set: { updatedAt: currentDate }
      }
    );

    // Successful response
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