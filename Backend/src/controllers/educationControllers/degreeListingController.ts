import { Request, Response, NextFunction } from 'express';
import Degree, { IDegree } from '../../models/Degree';
import { parseTuitionFee } from '../../utils/degreeUtils';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const createDegree: AsyncRequestHandler = async (req, res, next) => {
  try {
    console.log("Received degree data:", req.body);
    console.log("Received file:", req.file);

    const {
      degreeName,
      institution, // Added since it's required in the schema
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

    // Prepare the degree data
    const degreeData: Partial<IDegree> = {
      degreeName,
      institution,
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
    };

    // Handle the uploaded image
    if (req.file) {
      degreeData.image = `/image/${req.file.filename}`; // Save the path to the image
    }

    const newDegree: IDegree = new Degree(degreeData);
    console.log("Degree object before save:", newDegree);
    

    const savedDegree = await newDegree.save();
    console.log("Degree saved successfully:", savedDegree);

    res.status(201).json(savedDegree);
  } catch (error: any) {
    console.error("Error creating degree:", error);
    res.status(500).json({ message: 'Error creating degree', error: error.message });
  }
};

export const updateDegree: AsyncRequestHandler = async (req, res, next) => {
  try {
    const degree = await Degree.findById(req.params.id);
    if (!degree) {
      res.status(404).json({ message: 'Degree not found' });
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

    // Handle the uploaded image
    if (req.file) {
      updateData.image = `/image/${req.file.filename}`;
    }

    const updatedDegree = await Degree.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedDegree);
  } catch (error: any) {
    console.error("Error updating degree:", error);
    res.status(500).json({ message: 'Error updating degree', error: error.message });
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
    } = req.query;

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