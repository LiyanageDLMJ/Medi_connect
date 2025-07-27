import { Request, Response, NextFunction } from 'express';
import Degree, { IDegree } from '../../models/Degree';
import { parseTuitionFee } from '../../utils/degreeUtils';
import cloudinary from "../../Config/cloudinaryConfig";
import fs from "fs";

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const createDegree: AsyncRequestHandler = async (req, res, next) => {
  try {
    console.log("Received degree data:", req.body);
    console.log("Received file:", req.file);

    // Remove institution from req.body destructuring
    const {
      degreeName,
      status,
      mode,
      applicationDeadline,
      eligibility,
      seatsAvailable,
      applicantsApplied,
      duration,
      tuitionFee,
      description,
      skillsRequired,
      perks,
    } = req.body;

    // Get institution from logged-in user (adjust as needed for your auth system)
    // Quick fix: cast req as any to access user
    let institution = (req as any).user?.institution || (req as any).user?.instituteName;
    if (!institution) {
      institution = "ABC Institute"; // TEMP: fallback for development
    }

    const institutionId = req.headers['x-user-id'] || (req as any).user?._id;
    if (!institutionId) {
      res.status(401).json({ message: "Unauthorized: institution id missing" });
      return;
    }

    // Prepare the degree data
    const degreeData = {
      degreeName,
      institution, // Set automatically
      institutionId,
      status,
      mode,
      applicationDeadline: new Date(applicationDeadline), // Convert string to Date
      eligibility,
      seatsAvailable: parseInt(seatsAvailable, 10), // Convert string to number
      applicantsApplied: parseInt(applicantsApplied || "0", 10), // Default to 0 if not provided
      duration,
      tuitionFee,
      description,
      skillsRequired,
      perks,
    } as Partial<IDegree>;

    // Convert perks to array if needed
    let perksArray = req.body.perks;
    if (typeof perksArray === 'string') {
      perksArray = perksArray.split(/,|\n/).map((p: string) => p.trim()).filter(Boolean);
    }
    if (Array.isArray(perksArray)) {
      degreeData.perks = perksArray;
    }

    // Handle the uploaded image
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "degree-images",
          resource_type: "image",
          use_filename: true,
        });
        degreeData.image = result.secure_url;
        // Delete the local file after upload
        fs.unlinkSync(req.file.path);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        res.status(500).json({ message: "Failed to upload image to cloud storage" });
        return;
      }
    }

    const newDegree: IDegree = new Degree(degreeData);
    console.log("Degree object before save:", newDegree);
    

    const savedDegree = await newDegree.save();
    console.log("Degree saved successfully:", savedDegree);

    res.status(201).json(savedDegree);
  } catch (error: any) {
    console.error("Error creating degree:", error);
    res.status(500).json({ message: 'Error creating degree', error: error.message });
    return;
  }
};

export const updateDegree: AsyncRequestHandler = async (req, res, next) => {
  try {
    const institutionId = req.headers['x-user-id'] || (req as any).user?._id;
    if (!institutionId) {
      res.status(401).json({ message: "Unauthorized: institution id missing" });
      return;
    }
    const degree = await Degree.findById(req.params.id);
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
    if (updateData.applicantsApplied) {
      updateData.applicantsApplied = parseInt(updateData.applicantsApplied, 10);
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

    await Degree.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: 'Degree updated successfully' });
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

    const institutionId = queryInstitutionId || req.headers['x-user-id'];
    const query: any = {};

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
      const degrees = await Degree.find();
      query._id = {
        $in: degrees
          .filter((degree) => {
            const feeValue = parseTuitionFee(degree.tuitionFee);
            if (tuitionFee === 'upTo10000') return feeValue <= 10000;
            if (tuitionFee === '10001to15000') return feeValue > 10000 && feeValue <= 15000;
            if (tuitionFee === 'above15000') return feeValue > 15000;
            return true;
          })
          .map((degree) => degree._id),
      };
    }
    if (startDate && endDate) {
      query.applicationDeadline = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }
    if (institutionId) {
      query.institutionId = institutionId;
    }

    const total = await Degree.countDocuments(query);
    const degrees = await Degree.find(query);

    res.status(200).json({
      degrees,
      total,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching degrees', error: error.message });
  }
};

export const getDegreeById: AsyncRequestHandler = async (req, res, next) => {
  try {
    const degree = await Degree.findById(req.params.id);
    if (!degree) {
      res.status(404).json({ message: 'Degree not found' });
      return;
    }
    res.status(200).json(degree);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching degree', error: error.message });
  }
};

export const deleteDegree: AsyncRequestHandler = async (req, res, next) => {
  try {
    const degree = await Degree.findById(req.params.id);
    if (!degree) {
      res.status(404).json({ message: 'Degree not found' });
      return;
    }

    await Degree.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Degree deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting degree', error: error.message });
  }
};

export const getFilterOptions: AsyncRequestHandler = async (req, res, next) => {
  try {
    const statuses = await Degree.distinct('status');
    const modes = await Degree.distinct('mode');
    const durations = await Degree.distinct('duration');

    res.status(200).json({
      statuses: ['all', ...statuses],
      modes: ['all', ...modes],
      durations: ['all', ...durations],
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching filter options', error: error.message });
  }
};