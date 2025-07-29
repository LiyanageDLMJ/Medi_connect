import { Request, Response, NextFunction } from 'express';
import getDegreeModel, { IDegree } from '../../models/Degree';
import getDegreeApplicationModel from '../../models/DegreeApplication';
import { parseTuitionFee } from '../../utils/degreeUtils';
import cloudinary from "../../Config/cloudinaryConfig";
import fs from "fs";

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const createDegree: AsyncRequestHandler = async (req, res, next) => {
  try {
    console.log("=== DEBUG: Create Degree ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("JWT user:", (req as any).user);
    
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    console.log("Institution ID from JWT:", institutionId);
    
    if (!institutionId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated or institution ID not found"
      });
      return;
    }

    // Remove institution from req.body destructuring
    const {
      courseId,
      degreeName,
      status,
      mode,
      duration,
      seatsAvailable,
      applicationDeadline,
      tuitionFee,
      eligibility,
      description,
      skillsRequired,
      perks,
    } = req.body;

    // Validate required fields
    if (!degreeName || !status || !mode || !duration || !seatsAvailable || !applicationDeadline || !tuitionFee || !eligibility) {
      res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
      return;
    }

    // Get institution name (you might want to fetch this from database)
    let institution = "ABC Institute"; // TEMP: fallback for development
    try {
      // You can fetch institution name from database using institutionId
      // const institutionData = await getInstitutionModel().findById(institutionId);
      // institution = institutionData?.name || "ABC Institute";
    } catch (error) {
      console.log("Error fetching institution name, using fallback");
      institution = "ABC Institute"; // TEMP: fallback for development
    }

    // Prepare the degree data
    const degreeData: any = {
      courseId: courseId ? parseInt(courseId) : undefined,
      degreeName,
      institution,
      institutionId,
      status,
      mode,
      duration,
      seatsAvailable: parseInt(seatsAvailable),
      applicantsApplied: 0,
      applicationDeadline: new Date(applicationDeadline),
      tuitionFee,
      eligibility,
      description: description || "",
      skillsRequired: skillsRequired || "",
      perks: perks ? (Array.isArray(perks) ? perks : [perks]) : [],
    };

    // Handle image upload
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "degrees",
          use_filename: true,
        });
        degreeData.image = result.secure_url;
        console.log("Image uploaded successfully:", result.secure_url);
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        res.status(500).json({
          success: false,
          message: "Failed to upload image"
        });
        return;
      }
    }

    console.log("Final degree data:", degreeData);

    // Save to database
    const degree = new (getDegreeModel())(degreeData);
    await degree.save();

    console.log("Degree created successfully:", degree);

    res.status(201).json({
      success: true,
      message: "Degree created successfully",
      degree: {
        _id: degree._id,
        courseId: degree.courseId,
        degreeName: degree.degreeName,
        institution: degree.institution,
        status: degree.status,
        mode: degree.mode,
        duration: degree.duration,
        seatsAvailable: degree.seatsAvailable,
        applicationDeadline: degree.applicationDeadline,
        tuitionFee: degree.tuitionFee,
        eligibility: degree.eligibility,
        description: degree.description,
        skillsRequired: degree.skillsRequired,
        perks: degree.perks,
        image: degree.image,
        createdAt: degree.createdAt,
        updatedAt: degree.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating degree:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create degree",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const updateDegree: AsyncRequestHandler = async (req, res, next) => {
  try {
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    console.log('=== DEBUG: Update Degree ===');
    console.log('JWT user object:', user);
    
    // Try different possible field names for the user ID
    const institutionId = user?._id || user?.id || user?.userId;
    console.log('Extracted institution ID:', institutionId);
    
    if (!institutionId) {
      console.log('No institution ID found in JWT token');
      res.status(401).json({ message: "Unauthorized: institution id missing" });
      return;
    }
    
    const degree = await getDegreeModel().findById(req.params.id);
    if (!degree) {
      res.status(404).json({ message: 'Degree not found' });
      return;
    }
    if (degree.institutionId !== institutionId) {
      res.status(403).json({ message: 'Forbidden: You can only update your own degrees' });
      return;
    }

    const updateData = { ...req.body };

    // Convert string fields to their proper types
    if (updateData.seatsAvailable) {
      updateData.seatsAvailable = parseInt(updateData.seatsAvailable, 10);
    }
    if (updateData.applicationDeadline) {
      updateData.applicationDeadline = new Date(updateData.applicationDeadline);
    }

    // Handle the uploaded image (Cloudinary)
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "degree-images",
          resource_type: "image",
          use_filename: true,
        });
        updateData.image = result.secure_url;
        // Delete the local file after upload
        fs.unlinkSync(req.file.path);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        res.status(500).json({ message: "Failed to upload image to cloud storage" });
        return;
      }
    }

    const updatedDegree = await getDegreeModel().findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    if (!updatedDegree) {
      res.status(404).json({ message: 'Degree not found' });
      return;
    }

    // Calculate actual application count from DegreeApplication collection
    const degreeId = (updatedDegree._id as any).toString();
    const courseId = updatedDegree.courseId;
    
    // Count applications by both _id and courseId to handle any mismatch
    const countById = await getDegreeApplicationModel().countDocuments({ degreeId });
    const countByCourseId = await getDegreeApplicationModel().countDocuments({ degreeId: courseId.toString() });
    const actualCount = countById + countByCourseId;
    
    const degreeWithActualCount = {
      ...updatedDegree.toObject(),
      applicantsApplied: actualCount
    };

    res.status(200).json({ 
      message: 'Degree updated successfully',
      degree: degreeWithActualCount
    });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating degree', error: error.message });
    return;
  }
};

// Other controllers remain unchanged
export const getAllDegrees: AsyncRequestHandler = async (req, res, next) => {
  try {
    const {
      searchQuery = '',
      status = 'all',
      mode = 'all',
      duration = 'all',
      tuitionFee = 'all',
      startDate,
      endDate,
      instituteOnly = 'false',
      institutionId: queryInstitutionId
    } = req.query;

    // Use query parameter if provided, otherwise get from JWT token
    const user = (req as any).user;
    const jwtInstitutionId = user?._id || user?.id || user?.userId;
    const institutionId = queryInstitutionId || jwtInstitutionId;
    const query: any = {};

    console.log('=== DEBUG: Institution Filtering ===');
    console.log('Query institutionId:', queryInstitutionId);
    console.log('JWT user ID:', (req as any).user?._id);
    console.log('Final institutionId used:', institutionId);

    if (searchQuery) {
      query.degreeName = { $regex: searchQuery, $options: 'i' };
    }
    if (status !== 'all') {
      query.status = status;
    }
    if (mode !== 'all') {
      query.mode = mode;
    }
    if (duration !== 'all') {
      query.duration = duration;
    }
    if (tuitionFee !== 'all') {
      const degrees = await getDegreeModel().find();
      query._id = {
        $in: degrees
          .filter((degree: any) => parseTuitionFee(degree.tuitionFee) <= 15000)
          .map((degree: any) => degree._id)
      };
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    // Filter by institution if instituteOnly is true or if we have an institutionId
    if (instituteOnly === 'true' && institutionId) {
      query.institutionId = institutionId;
    }

    console.log('Final query:', JSON.stringify(query, null, 2));

    const degrees = await getDegreeModel().find(query).sort({ createdAt: -1 });
    const total = await getDegreeModel().countDocuments(query);

    // Debug: Log all applications to understand the data structure
    const allApplications = await getDegreeApplicationModel().find({}).select('_id name email degreeId');
    console.log('=== ALL APPLICATIONS IN DATABASE ===');
    console.log('Total applications:', allApplications.length);
    allApplications.forEach((app: any) => {
      console.log(`App: ${app.name} (${app.email}) - degreeId: ${app.degreeId}`);
    });

    // Calculate applicantsApplied for each degree
    const degreesWithCounts = await Promise.all(degrees.map(async (degree: any) => {
      const degreeId = degree._id.toString();
      const courseId = degree.courseId;
      
      // Count applications by both _id and courseId to handle any mismatch
      const countById = await getDegreeApplicationModel().countDocuments({ degreeId });
      const countByCourseId = await getDegreeApplicationModel().countDocuments({ degreeId: courseId.toString() });
      const actualCount = countById + countByCourseId;
      
      // Debug: Check what applications exist for this degree
      const applicationsById = await getDegreeApplicationModel().find({ degreeId }).select('_id name email degreeId');
      const applicationsByCourseId = await getDegreeApplicationModel().find({ degreeId: courseId.toString() }).select('_id name email degreeId');
      
      console.log(`=== DEBUG: ${degree.degreeName} ===`);
      console.log(`degreeId: ${degreeId}, courseId: ${courseId}`);
      console.log(`Applications by degreeId: ${applicationsById.length}`);
      console.log(`Applications by courseId: ${applicationsByCourseId.length}`);
      console.log(`Total count: ${actualCount}`);
      
      return {
        ...degree.toObject(),
        applicantsApplied: actualCount
      };
    }));

    res.status(200).json({
      degrees: degreesWithCounts,
      total,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching degrees', error: error.message });
  }
};

export const getDegreeById: AsyncRequestHandler = async (req, res, next) => {
  try {
    const degree = await getDegreeModel().findById(req.params.id);
    if (!degree) {
      res.status(404).json({ message: 'Degree not found' });
      return;
    }

    // Calculate actual application count from DegreeApplication collection
    const degreeId = (degree._id as any).toString();
    const courseId = degree.courseId;
    
    // Count applications by both _id and courseId to handle any mismatch
    const countById = await getDegreeApplicationModel().countDocuments({ degreeId });
    const countByCourseId = await getDegreeApplicationModel().countDocuments({ degreeId: courseId.toString() });
    const actualCount = countById + countByCourseId;
    
    const degreeWithActualCount = {
      ...degree.toObject(),
      applicantsApplied: actualCount
    };

    res.status(200).json(degreeWithActualCount);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching degree', error: error.message });
  }
};

export const deleteDegree: AsyncRequestHandler = async (req, res, next) => {
  try {
    // Get institution ID from JWT token
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    if (!institutionId) {
      res.status(401).json({ message: "Unauthorized: institution id missing" });
      return;
    }

    const degree = await getDegreeModel().findById(req.params.id);
    if (!degree) {
      res.status(404).json({ message: 'Degree not found' });
      return;
    }

    // Check if the degree belongs to the authenticated institution
    if (degree.institutionId !== institutionId) {
      res.status(403).json({ message: 'Forbidden: You can only delete your own degrees' });
      return;
    }

    await getDegreeModel().findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Degree deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting degree', error: error.message });
  }
};

export const getFilterOptions: AsyncRequestHandler = async (req, res, next) => {
  try {
    const statuses = await getDegreeModel().distinct('status');
    const modes = await getDegreeModel().distinct('mode');
    const durations = await getDegreeModel().distinct('duration');

    res.status(200).json({
      statuses: ['all', ...statuses],
      modes: ['all', ...modes],
      durations: ['all', ...durations],
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching filter options', error: error.message });
  }
};