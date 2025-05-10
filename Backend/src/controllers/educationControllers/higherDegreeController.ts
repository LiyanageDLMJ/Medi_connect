import { Request, Response, NextFunction } from 'express';
import Degree, { IDegree } from '../../models/Degree';
import { parseTuitionFee } from '../../utils/degreeUtils';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const getAllHigherDegrees: AsyncRequestHandler = async (req, res) => {
  try {
    const {
      searchText = '',
      institution = '',
      duration = '',
      mode = '',
      tuitionFee = '',
    } = req.query;

    const query: any = {};

    if (searchText) {
      query.degreeName = { $regex: searchText, $options: 'i' };
    }
    if (institution) {
      query.institution = { $regex: institution, $options: 'i' };
    }
    if (duration) {
      query.duration = { $regex: duration, $options: 'i' };
    }
    if (mode) {
      query.mode = mode;
    }

    if (tuitionFee) {
      const degrees = await Degree.find();
      query._id = {
        $in: degrees
          .filter((degree) => {
            const feeValue = parseTuitionFee(degree.tuitionFee);
            if (tuitionFee === 'Below 10,000') return feeValue <= 10000;
            if (tuitionFee === '10,000-30,000') return feeValue > 10000 && feeValue <= 30000;
            if (tuitionFee === 'Above 30,000') return feeValue > 30000;
            return true;
          })
          .map((degree) => degree._id),
      };
    }

    const total = await Degree.countDocuments(query);
    const degrees = await Degree.find(query);

    res.status(200).json({
      degrees,
      total,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching higher degrees', error: error.message });
  }
};

export const getFilterOptions: AsyncRequestHandler = async (req, res, next) => {
  try {
    const durations = await Degree.distinct('duration');
    const modes = await Degree.distinct('mode');
    res.status(200).json({
      durations: durations.filter((duration: string) => duration),
      modes: modes.filter((mode: string) => mode),
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching filter options', error: error.message });
  }
};