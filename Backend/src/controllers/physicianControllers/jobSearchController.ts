import Job from '../../models/Job';
import { Request, Response } from 'express';

// Fetch jobs based on filters
export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { searchText, hospital, location, type, salary, status } = req.query;
    
    const filter: any = {};
    if (searchText) filter.title = { $regex: searchText, $options: 'i' };
    if (hospital) filter.hospital = hospital;
    if (location) filter.location = location;
    if (type) filter.type = type;
    if (salary) filter.salary = salary;
    if (status) filter.status = status;

    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};