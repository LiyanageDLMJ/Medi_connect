import { Request, Response } from 'express';
import DegreeApplication from '../../models/DegreeApplication';
import Degree from '../../models/Degree';

// GET /insights/popular-courses
export const getPopularCourses = async (req: Request, res: Response) => {
  try {
    // Aggregate applications by degreeName
    const result = await DegreeApplication.aggregate([
      { $group: { _id: '$degreeName', applications: { $sum: 1 } } },
      { $sort: { applications: -1 } },
      { $limit: 10 },
      { $project: { name: '$_id', applications: 1, _id: 0 } }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular courses' });
  }
};

// GET /insights/application-trends
export const getApplicationTrends = async (req: Request, res: Response) => {
  try {
    const { dateRange, courseType } = req.query;
    const match: any = {};

    // Filter by courseType
    if (courseType && courseType !== 'All') match.degreeName = courseType;

    // Filter by dateRange (example: "Last 30 days" or "2024-07-01 to 2024-07-31")
    if (dateRange && typeof dateRange === 'string') {
      if (dateRange.startsWith('Last ')) {
        const days = parseInt(dateRange.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(days)) {
          const fromDate = new Date();
          fromDate.setDate(fromDate.getDate() - days);
          match.submissionDate = { $gte: fromDate };
        }
      } else if (dateRange.includes('to')) {
        const [start, end] = dateRange.split('to').map(s => s.trim());
        if (start && end) {
          match.submissionDate = { $gte: new Date(start), $lte: new Date(end) };
        }
      }
    }

    const result = await DegreeApplication.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            yearMonth: { $dateToString: { format: '%Y-%m', date: '$submissionDate' } },
            degreeName: '$degreeName',
          },
          applications: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.yearMonth',
          courses: {
            $push: { degreeName: '$_id.degreeName', applications: '$applications' },
          },
        },
      },
      { $sort: { '_id': 1 } },
    ]);
    const data = result.map((monthGroup: any) => {
      const row: any = { month: monthGroup._id };
      monthGroup.courses.forEach((c: any) => {
        row[c.degreeName] = c.applications;
      });
      return row;
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch application trends' });
  }
};

// GET /insights/demographics
export const getDemographics = async (req: Request, res: Response) => {
  try {
    // Group by gender (or any other demographic field)
    const result = await DegreeApplication.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $project: { gender: '$_id', count: 1, _id: 0 } }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch demographics' });
  }
};

// GET /insights/program-fill-rate
export const getProgramFillRate = async (req: Request, res: Response) => {
  try {
    const degrees = await Degree.find();
    const applications = await DegreeApplication.aggregate([
      { $group: { _id: '$degreeId', count: { $sum: 1 } } }
    ]);
    const appMap: Record<string, number> = {};
    applications.forEach(a => { appMap[a._id] = a.count; });
    const result = degrees.map(d => {
      const idStr = (d._id as any).toString();
      return {
        name: d.degreeName,
        fillRate: d.seatsAvailable ? ((appMap[idStr] || 0) / d.seatsAvailable) * 100 : 0,
        applicants: appMap[idStr] || 0,
        seats: d.seatsAvailable || 0
      };
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch program fill rate' });
  }
};

// GET /insights/application-rush
export const getApplicationRush = async (req: Request, res: Response) => {
  try {
    const result = await DegreeApplication.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$submissionDate' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    res.json(result.map(r => ({ date: r._id, applications: r.count })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch application rush data' });
  }
};

export const getApplicationRushByDeadline = async (req: Request, res: Response) => {
  try {
    const { courseName } = req.query;

    // If "All", aggregate across all degrees
    if (!courseName || courseName === "All") {
      const degrees = await Degree.find();
      let totalFirstWeek = 0, totalMidway = 0, totalFinal3Days = 0;

      for (const degree of degrees) {
        const deadline = new Date(degree.applicationDeadline);
        let startDate = degree.createdAt ? new Date(degree.createdAt) : null;
        if (!startDate) {
          const firstApp = await DegreeApplication.findOne({ degreeName: degree.degreeName }).sort({ submissionDate: 1 });
          startDate = firstApp ? new Date(firstApp.submissionDate) : null;
        }
        if (!startDate) continue;

        const firstWeekEnd = new Date(startDate);
        firstWeekEnd.setDate(firstWeekEnd.getDate() + 7);

        const final3DaysStart = new Date(deadline);
        final3DaysStart.setDate(final3DaysStart.getDate() - 2);

        const apps = await DegreeApplication.find({ degreeName: degree.degreeName });

        for (const app of apps) {
          const sub = new Date(app.submissionDate);
          if (sub <= firstWeekEnd) totalFirstWeek++;
          else if (sub >= final3DaysStart) totalFinal3Days++;
          else totalMidway++;
        }
      }

      res.json([
        { name: "First week", value: totalFirstWeek },
        { name: "Midway", value: totalMidway },
        { name: "Final 3 days", value: totalFinal3Days }
      ]);
      return;
    }

    // Find the degree to get its deadline and (optionally) start date
    const degree = await Degree.findOne({ degreeName: courseName });
    if (!degree) {
      res.status(404).json({ error: "Degree not found" });
      return;
    }

    const deadline = new Date(degree.applicationDeadline);
    // If you have a start date, use it; otherwise, use the earliest application date
    let startDate = degree.createdAt ? new Date(degree.createdAt) : null;

    // If no explicit start date, find the earliest application
    if (!startDate) {
      const firstApp = await DegreeApplication.findOne({ degreeName: courseName }).sort({ submissionDate: 1 });
      startDate = firstApp ? new Date(firstApp.submissionDate) : null;
    }
    if (!startDate) {
      res.json([
        { name: "First week", value: 0 },
        { name: "Midway", value: 0 },
        { name: "Final 3 days", value: 0 }
      ]);
      return;
    }

    const firstWeekEnd = new Date(startDate);
    firstWeekEnd.setDate(firstWeekEnd.getDate() + 7);

    const final3DaysStart = new Date(deadline);
    final3DaysStart.setDate(final3DaysStart.getDate() - 2); // includes deadline day

    // Fetch all applications for this degree
    const apps = await DegreeApplication.find({ degreeName: courseName });

    let firstWeek = 0, midway = 0, final3Days = 0;
    for (const app of apps) {
      const sub = new Date(app.submissionDate);
      if (sub <= firstWeekEnd) firstWeek++;
      else if (sub >= final3DaysStart) final3Days++;
      else midway++;
    }

    res.json([
      { name: "First week", value: firstWeek },
      { name: "Midway", value: midway },
      { name: "Final 3 days", value: final3Days }
    ]);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rush analysis' });
    return;
  }
};

export const getEnrollmentFunnel = async (req: Request, res: Response) => {
  try {
    const pending = await DegreeApplication.countDocuments({ status: "Pending" });
    const approved = await DegreeApplication.countDocuments({ status: "Approved" });
    const rejected = await DegreeApplication.countDocuments({ status: "Rejected" });

    res.json([
      { stage: "Pending", value: pending },
      { stage: "Approved", value: approved },
      { stage: "Rejected", value: rejected }
    ]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollment funnel data" });
  }
};

export const getCourseList = async (req: Request, res: Response) => {
  try {
    const courses = await Degree.find().select('degreeName -_id');
    res.json(courses.map(c => c.degreeName));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course list' });
  }
}; 