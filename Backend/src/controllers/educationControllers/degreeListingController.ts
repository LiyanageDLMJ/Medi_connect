import { Request, Response, NextFunction } from 'express';
import Degree, { IDegree } from '../../models/Degree';
import { parseTuitionFee } from '../../utils/degreeUtils';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const createDegree: AsyncRequestHandler = async (req, res, next) => {
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

export const updateDegree: AsyncRequestHandler = async (req, res, next) => {
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