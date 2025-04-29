import { Request, Response, NextFunction } from 'express';
import Degree, { IDegree } from '../../models/Degree';

// Define a custom type for async handlers
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// Create a new degree
export const createDegree = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
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
    } = req.body;

    const newDegree: IDegree = new Degree({
      degreeName,
      status,
      mode,
      applicationDeadline,
      eligibility,
      seatsAvailable,
      applicantsApplied,
      duration,
      tuitionFee,
    });

    const savedDegree = await newDegree.save();
    res.status(201).json(savedDegree);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating degree', error: error.message });
  }
};

// Get all degrees with filtering, pagination, and search
export const getAllDegrees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      searchQuery = '',
      status = 'all',
      mode = 'all',
      duration = 'all',
      tuitionFee = 'all',
      startDate,
      endDate,
      page = '1',
      limit = '5',
      instituteOnly = 'false', // This parameter is irrelevant now but can be kept for future use
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
      const numericFee = (fee: string) => parseFloat(fee.replace(/[^0-9.]/g, '')) || 0;
      const degrees = await Degree.find();
      query._id = {
        $in: degrees
          .filter((degree) => {
            const feeValue = numericFee(degree.tuitionFee);
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

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Degree.countDocuments(query);
    const degrees = await Degree.find(query)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      degrees,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching degrees', error: error.message });
  }
};

// Get a degree by ID
export const getDegreeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

// Update a degree by ID
export const updateDegree = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const degree = await Degree.findById(req.params.id);
    if (!degree) {
      res.status(404).json({ message: 'Degree not found' });
      return;
    }

    const updatedDegree = await Degree.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedDegree);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating degree', error: error.message });
  }
};

// Delete a degree by ID
export const deleteDegree = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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