import { Request, Response, NextFunction } from 'express';
import getDegreeModel, { IDegree } from '../../models/Degree';
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
      institutionId: queryInstitutionId
    } = req.query;

    // Use query parameter if provided, otherwise get from JWT token
    const institutionId = queryInstitutionId || (req as any).user?._id;
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
    if (institutionId) {
      query.institutionId = institutionId;
    }

    if (tuitionFee) {
      const degrees = await getDegreeModel().find();
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

    const total = await getDegreeModel().countDocuments(query);
    const degrees = await getDegreeModel().find(query);

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
    const durations = await getDegreeModel().distinct('duration');
    const modes = await getDegreeModel().distinct('mode');
    res.status(200).json({
      durations: durations.filter((duration: string) => duration),
      modes: modes.filter((mode: string) => mode),
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching filter options', error: error.message });
  }
};