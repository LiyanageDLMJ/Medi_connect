import { Request, Response } from 'express';
import getDegreeApplicationModel from '../../models/DegreeApplication';
import getDegreeModel from '../../models/Degree';

// GET /insights/popular-courses
export const getPopularCourses = async (req: Request, res: Response) => {
  try {
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    if (!institutionId) {
      res.status(401).json({ error: 'Institution ID required' });
      return;
    }

    // Get query parameters for filtering
    const { dateRange, applicantType } = req.query;
    
    console.log('=== DEBUG: Popular Courses ===');
    console.log('Institution ID:', institutionId);
    console.log('Date Range filter:', dateRange);
    console.log('Applicant Type filter:', applicantType);

    // Get degrees for this institution to get degree names
    const institutionDegrees = await getDegreeModel().find({ institutionId }).select('degreeName courseId');
    const institutionDegreeNames = institutionDegrees.map(d => d.degreeName);
    const institutionCourseIds = institutionDegrees.map(d => d.courseId);

    console.log('Degrees for this institution:', institutionDegrees.length);
    console.log('Degree names:', institutionDegreeNames);
    console.log('Course IDs:', institutionCourseIds);

    // Build match conditions
    const matchConditions: any = {
      $or: [
        { institutionId: institutionId },
        { 
          $and: [
            { degreeName: { $in: institutionDegreeNames } },
            { 
              $or: [
                { institutionId: { $exists: false } },
                { institutionId: null },
                { institutionId: "" }
              ]
            }
          ]
        }
      ]
    };

    // Add applicant type filter if specified
    if (applicantType && applicantType !== "All") {
      matchConditions.applicantType = applicantType;
    }

    // Add date range filter if specified
    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case "Last 30 days":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Semester":
          startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      matchConditions.submissionDate = { $gte: startDate };
    }

    console.log('Match conditions:', JSON.stringify(matchConditions, null, 2));

    // Get applications for this institution
    const applications = await getDegreeApplicationModel().aggregate([
      { $match: matchConditions },
      { $group: { _id: '$degreeName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    console.log('Applications found:', applications);

    // Transform data for chart
    const data = applications.map(app => ({
      name: app._id,
      applications: app.count
    }));

    console.log('Final data for chart:', data);
    res.json(data);
  } catch (error) {
    console.error('Error in getPopularCourses:', error);
    res.status(500).json({ error: 'Failed to fetch popular courses' });
  }
};

// GET /insights/application-trends
export const getApplicationTrends = async (req: Request, res: Response) => {
  try {
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    if (!institutionId) {
      res.status(401).json({ error: 'Institution ID required' });
      return;
    }

    // Get query parameters for filtering
    const { dateRange, courseType, applicantType } = req.query;
    
    console.log('=== DEBUG: Application Trends ===');
    console.log('Institution ID:', institutionId);
    console.log('Date Range filter:', dateRange);
    console.log('Course Type filter:', courseType);
    console.log('Applicant Type filter:', applicantType);

    // Get degrees for this institution to get degree names
    let institutionDegrees = await getDegreeModel().find({ institutionId }).select('degreeName courseId');
    
    // Filter by specific course if requested
    if (courseType && courseType !== "All") {
      institutionDegrees = institutionDegrees.filter(degree => degree.degreeName === courseType);
    }
    
    const institutionDegreeNames = institutionDegrees.map(d => d.degreeName);

    // Build match conditions
    const matchConditions: any = {};
    
    if (courseType && courseType !== "All") {
      // If specific course is selected, filter by that course only
      matchConditions.degreeName = courseType;
      matchConditions.$or = [
        { institutionId: institutionId },
        { 
          $and: [
            { degreeName: courseType },
            { 
              $or: [
                { institutionId: { $exists: false } },
                { institutionId: null },
                { institutionId: "" }
              ]
            }
          ]
        }
      ];
    } else {
      // If "All" is selected, show all courses for this institution
      matchConditions.$or = [
        { institutionId: institutionId },
        { 
          $and: [
            { degreeName: { $in: institutionDegreeNames } },
            { 
              $or: [
                { institutionId: { $exists: false } },
                { institutionId: null },
                { institutionId: "" }
              ]
            }
          ]
        }
      ];
    }

    // Add applicant type filter if specified
    if (applicantType && applicantType !== "All") {
      matchConditions.applicantType = applicantType;
    }

    // Add date range filter if specified
    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case "Last 30 days":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Semester":
          startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      matchConditions.submissionDate = { $gte: startDate };
    }

    console.log('Match conditions:', JSON.stringify(matchConditions, null, 2));

    // Get applications for this institution
    const applications = await getDegreeApplicationModel().aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$submissionDate" } },
            degreeName: "$degreeName"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    console.log('Applications found:', applications);

    // Transform data for chart - create array format
    const monthlyData: { [key: string]: any } = {};
    
    applications.forEach(app => {
      const month = app._id.month;
      const degreeName = app._id.degreeName;
      const count = app.count;
      
      if (!monthlyData[month]) {
        monthlyData[month] = { month };
      }
      monthlyData[month][degreeName] = count;
    });

    // Convert to array format
    const result = Object.values(monthlyData);

    console.log('Final data for chart:', result);
    res.json(result);
  } catch (error) {
    console.error('Error in getApplicationTrends:', error);
    res.status(500).json({ error: 'Failed to fetch application trends' });
  }
};

// GET /insights/demographics
export const getDemographics = async (req: Request, res: Response) => {
  try {
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    if (!institutionId) {
      res.status(401).json({ error: 'Institution ID required' });
      return;
    }

    // Get query parameters for filtering
    const { courseType, dateRange, applicantType } = req.query;
    
    console.log('=== DEBUG: Demographics ===');
    console.log('Institution ID:', institutionId);
    console.log('Course Type filter:', courseType);
    console.log('Date Range filter:', dateRange);
    console.log('Applicant Type filter:', applicantType);

    // Get degrees for this institution to get degree names
    let institutionDegrees = await getDegreeModel().find({ institutionId }).select('degreeName courseId');
    

    // Debug: Check all degrees in database vs institution degrees
    const allDegrees = await getDegreeModel().find({}).select('degreeName courseId institutionId');
    console.log('=== DEBUG: Insights Degree Count Analysis ===');
    console.log('Total degrees in database:', allDegrees.length);
    console.log('All degrees with institution IDs:', allDegrees.map(d => ({
      degreeName: d.degreeName,
      institutionId: d.institutionId,
      courseId: d.courseId
    })));
    console.log('Degrees for this institution:', institutionDegrees.length);
    console.log('This institution degrees:', institutionDegrees.map(d => ({
      degreeName: d.degreeName,
      institutionId: d.institutionId,
      courseId: d.courseId
    })));
    
    // Filter by specific course if requested
    if (courseType && courseType !== "All") {
      institutionDegrees = institutionDegrees.filter(degree => degree.degreeName === courseType);
      console.log('=== DEBUG: Course Filtering ===');
      console.log('Selected course:', courseType);
      console.log('Filtered degrees after course selection:', institutionDegrees.map(d => d.degreeName));
    }
    
    const institutionDegreeNames = institutionDegrees.map(d => d.degreeName);
    const institutionCourseIds = institutionDegrees.map(d => d.courseId);

    console.log('Filtered degrees for this institution:', institutionDegrees.length);
    console.log('Degree names:', institutionDegreeNames);
    console.log('Course IDs:', institutionCourseIds);

    // Build match conditions
    const matchConditions: any = {
      $or: [
        // New applications with institutionId
        { institutionId: institutionId },
        // Old applications that match this institution's degree names
        { 
          $and: [
            { degreeName: { $in: institutionDegreeNames } },
            { 
              $or: [
                { institutionId: { $exists: false } },
                { institutionId: null },
                { institutionId: "" }
              ]
            }
          ]
        }
      ]
    };

    // Debug: Check what degrees are being filtered
    console.log('=== DEBUG: Institution Filtering ===');
    console.log('Institution ID:', institutionId);
    console.log('Institution degree names:', institutionDegreeNames);
    console.log('Match conditions:', JSON.stringify(matchConditions, null, 2));

    // Add applicant type filter if specified
    if (applicantType && applicantType !== "All") {
      matchConditions.applicantType = applicantType;
    }

    // Add date range filter if specified
    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case "Last 30 days":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Semester":
          startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      matchConditions.submissionDate = { $gte: startDate };
    }

    console.log('Match conditions:', JSON.stringify(matchConditions, null, 2));

    // Group by gender (or any other demographic field) for this institution only
    const result = await getDegreeApplicationModel().aggregate([
      { $match: matchConditions },
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $project: { gender: '$_id', count: 1, _id: 0 } }
    ]);

    console.log('Demographics result:', result);
    res.json(result);
  } catch (error) {
    console.error('Error in getDemographics:', error);
    res.status(500).json({ error: 'Failed to fetch demographics' });
  }
};

// GET /insights/program-fill-rate
export const getProgramFillRate = async (req: Request, res: Response) => {
  try {
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    if (!institutionId) {
      res.status(401).json({ error: 'Institution ID required' });
      return;
    }

    console.log('=== DEBUG: Program Fill Rate ===');
    console.log('Institution ID:', institutionId);

    // Get degrees for this institution only
    const degrees = await getDegreeModel().find({ institutionId });
    const degreeNames = degrees.map(d => d.degreeName);
    
    console.log('Degrees found for this institution:', degrees.length);
    console.log('Degree names:', degreeNames);
    
    // Let's also check what applications exist in the database
    const allApplications = await getDegreeApplicationModel().find({}).select('degreeName institutionId');
    console.log('=== DEBUG: All applications in database ===');
    console.log('Total applications in database:', allApplications.length);
    console.log('Sample applications:', allApplications.slice(0, 5));
    
    // Get applications for this institution only
    const applications = await getDegreeApplicationModel().aggregate([
      { 
        $match: { 
          $or: [
            { institutionId: institutionId },
            { 
              $and: [
                { degreeName: { $in: degreeNames } },
                { 
                  $or: [
                    { institutionId: { $exists: false } },
                    { institutionId: null },
                    { institutionId: "" }
                  ]
                }
              ]
            }
          ]
        } 
      },
      { $group: { _id: '$degreeName', count: { $sum: 1 } } }
    ]);
    
    console.log('Applications found for this institution:', applications);
    
    const result = degrees.map(d => {
      // Use regex to match degree names with optional trailing spaces
      const applicationData = applications.find(a => {
        const regex = new RegExp(`^${d.degreeName}\\s*$`);
        return regex.test(a._id);
      });
      const totalApplicants = applicationData ? applicationData.count : 0;
      
      return {
        name: d.degreeName,
        fillRate: d.seatsAvailable ? (totalApplicants / d.seatsAvailable) * 100 : 0,
        applicants: totalApplicants,
        seats: d.seatsAvailable || 0
      };
    });
    
    console.log('Final result:', result);
    res.json(result);
  } catch (error) {
    console.error('Error in getProgramFillRate:', error);
    res.status(500).json({ error: 'Failed to fetch program fill rate' });
  }
};

// GET /insights/application-rush
export const getApplicationRush = async (req: Request, res: Response) => {
  try {
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    if (!institutionId) {
      res.status(401).json({ error: 'Institution ID required' });
      return;
    }

    // Get degrees for this institution to get degree names
    const institutionDegrees = await getDegreeModel().find({ institutionId }).select('degreeName');
    const institutionDegreeNames = institutionDegrees.map(d => d.degreeName);

    const result = await getDegreeApplicationModel().aggregate([
      { 
        $match: { 
          $or: [
            { institutionId: institutionId },
            { 
              $and: [
                { degreeName: { $in: institutionDegreeNames } },
                { 
                  $or: [
                    { institutionId: { $exists: false } },
                    { institutionId: null },
                    { institutionId: "" }
                  ]
                }
              ]
            }
          ]
        } 
      },
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
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    if (!institutionId) {
      res.status(401).json({ error: 'Institution ID required' });
      return;
    }

    // Get query parameters for filtering
    const { courseType, dateRange, applicantType } = req.query;
    
    console.log('=== DEBUG: Application Rush Analysis ===');
    console.log('Institution ID:', institutionId);
    console.log('Course Type:', courseType);
    console.log('Date Range:', dateRange);
    console.log('Applicant Type:', applicantType);

    // Build date filter conditions
    let dateFilter: any = {};
    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case "Last 30 days":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Semester":
          startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      dateFilter.submissionDate = { $gte: startDate };
      console.log('Date filter applied:', { startDate, dateRange });
    }

    // Add applicant type filter if specified
    if (applicantType && applicantType !== "All") {
      dateFilter.applicantType = applicantType;
    }

    // If "All", aggregate across all degrees for this institution
    if (!courseType || courseType === "All" || courseType === "undefined") {
      const degrees = await getDegreeModel().find({ institutionId });
      let totalFirstWeek = 0, totalMidway = 0, totalFinal3Days = 0;

      console.log('=== DEBUG: Application Rush Analysis Details ===');
      console.log('Total degrees found:', degrees.length);
      console.log('Date filter:', dateFilter);

      for (const degree of degrees) {
        console.log(`\nProcessing degree: ${degree.degreeName}`);
        const deadline = new Date(degree.applicationDeadline);
        let startDate = degree.createdAt ? new Date(degree.createdAt) : null;
        
        console.log(`Degree deadline: ${deadline}`);
        console.log(`Degree start date: ${startDate}`);
        
        if (!startDate) {
          const firstApp = await getDegreeApplicationModel().findOne({ 
            degreeName: degree.degreeName,
            ...dateFilter
          }).sort({ submissionDate: 1 });
          startDate = firstApp ? new Date(firstApp.submissionDate) : null;
          console.log(`First application found: ${firstApp ? firstApp.submissionDate : 'None'}`);
        }
        if (!startDate) {
          console.log(`Skipping degree ${degree.degreeName} - no start date`);
          continue;
        }

        const firstWeekEnd = new Date(startDate);
        firstWeekEnd.setDate(firstWeekEnd.getDate() + 7);

        const final3DaysStart = new Date(deadline);
        final3DaysStart.setDate(final3DaysStart.getDate() - 2);

        console.log(`First week end: ${firstWeekEnd}`);
        console.log(`Final 3 days start: ${final3DaysStart}`);

        // Apply date filter to applications
        const apps = await getDegreeApplicationModel().find({ 
          degreeName: { $regex: `^${degree.degreeName}\\s*$` },
          ...dateFilter
        });

        console.log(`Applications found for ${degree.degreeName}: ${apps.length}`);

        for (const app of apps) {
          const sub = new Date(app.submissionDate);
          console.log(`Application ${app.name}: submission date = ${sub}`);
          
          if (sub <= firstWeekEnd) {
            totalFirstWeek++;
            console.log(`  -> First week`);
          } else if (sub >= final3DaysStart) {
            totalFinal3Days++;
            console.log(`  -> Final 3 days`);
          } else {
            totalMidway++;
            console.log(`  -> Midway`);
          }
        }
      }

      console.log('\n=== FINAL RUSH ANALYSIS RESULT ===');
      console.log('Total applications processed:', totalFirstWeek + totalMidway + totalFinal3Days);
      console.log('Rush analysis result (All courses):', {
        firstWeek: totalFirstWeek,
        midway: totalMidway,
        final3Days: totalFinal3Days
      });

      res.json([
        { name: "First week", value: totalFirstWeek },
        { name: "Midway", value: totalMidway },
        { name: "Final 3 days", value: totalFinal3Days }
      ]);
      return;
    }

    // Find the degree to get its deadline and (optionally) start date - only for this institution
    console.log('=== DEBUG: Looking for specific degree ===');
    console.log('Searching for courseType:', courseType);
    console.log('Institution ID:', institutionId);
    
    // First, let's see what degrees exist for this institution
    const allInstitutionDegrees = await getDegreeModel().find({ institutionId }).select('degreeName');
    console.log('All degrees for this institution:', allInstitutionDegrees.map(d => d.degreeName));
    
    const degree = await getDegreeModel().findOne({ 
      degreeName: { $regex: `^${courseType}\\s*$` }, 
      institutionId 
    });
    console.log('Found degree:', degree ? degree.degreeName : 'NOT FOUND');
    
    if (!degree) {
      console.log('Degree not found - returning 404');
      res.status(404).json({ error: "Degree not found" });
      return;
    }

    const deadline = new Date(degree.applicationDeadline);
    // If you have a start date, use it; otherwise, use the earliest application date
    let startDate = degree.createdAt ? new Date(degree.createdAt) : null;

    // If no explicit start date, find the earliest application
    if (!startDate) {
      const firstApp = await getDegreeApplicationModel().findOne({ 
        degreeName: { $regex: `^${courseType}\\s*$` },
        ...dateFilter
      }).sort({ submissionDate: 1 });
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

    // Fetch all applications for this degree with date filter
    const apps = await getDegreeApplicationModel().find({ 
      degreeName: { $regex: `^${courseType}\\s*$` },
      ...dateFilter
    });

    console.log('=== DEBUG: Application Rush Details ===');
    console.log('Total applications found for this degree:', apps.length);
    console.log('Date filter applied:', dateFilter);
    console.log('Degree deadline:', deadline);
    console.log('Degree start date:', startDate);
    console.log('First week end:', firstWeekEnd);
    console.log('Final 3 days start:', final3DaysStart);
    
    // Log sample applications to see their submission dates
    if (apps.length > 0) {
      console.log('Sample applications:');
      apps.slice(0, 3).forEach((app, index) => {
        console.log(`App ${index + 1}:`, {
          submissionDate: app.submissionDate,
          name: app.name,
          email: app.email
        });
      });
    }

    let firstWeek = 0, midway = 0, final3Days = 0;
    for (const app of apps) {
      const sub = new Date(app.submissionDate);
      console.log(`Application ${app.name}: submission date = ${sub}, deadline = ${deadline}`);
      
      if (sub <= firstWeekEnd) {
        firstWeek++;
        console.log(`  -> First week (${sub} <= ${firstWeekEnd})`);
      } else if (sub >= final3DaysStart) {
        final3Days++;
        console.log(`  -> Final 3 days (${sub} >= ${final3DaysStart})`);
      } else {
        midway++;
        console.log(`  -> Midway`);
      }
    }

    console.log('Rush analysis result (Specific course):', {
      courseName: courseType,
      firstWeek,
      midway,
      final3Days,
      totalApplications: apps.length
    });

    res.json([
      { name: "First week", value: firstWeek },
      { name: "Midway", value: midway },
      { name: "Final 3 days", value: final3Days }
    ]);
  } catch (error) {
    console.error('Error in getApplicationRushByDeadline:', error);
    res.status(500).json({ error: 'Failed to fetch rush analysis' });
  }
};

export const getEnrollmentFunnel = async (req: Request, res: Response) => {
  try {
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    if (!institutionId) {
      res.status(401).json({ error: 'Institution ID required' });
      return;
    }

    // Get query parameters for filtering
    const { dateRange, courseType, applicantType } = req.query;
    
    console.log('=== DEBUG: Enrollment Funnel ===');
    console.log('Institution ID:', institutionId);
    console.log('Date Range filter:', dateRange);
    console.log('Course Type filter:', courseType);
    console.log('Applicant Type filter:', applicantType);

    // Get degrees for this institution to get degree names
    let institutionDegrees = await getDegreeModel().find({ institutionId }).select('degreeName courseId');
    
    // Filter by specific course if requested
    if (courseType && courseType !== "All") {
      institutionDegrees = institutionDegrees.filter(degree => degree.degreeName === courseType);
    }
    
    const institutionDegreeNames = institutionDegrees.map(d => d.degreeName);

    console.log('Filtered degrees for this institution:', institutionDegrees.length);
    console.log('Degree names:', institutionDegreeNames);

    // Build match conditions
    const matchConditions: any = {};
    
    if (courseType && courseType !== "All") {
      // If specific course is selected, filter by that course only
      matchConditions.degreeName = courseType;
      matchConditions.$or = [
        { institutionId: institutionId },
        { 
          $and: [
            { degreeName: courseType },
            { 
              $or: [
                { institutionId: { $exists: false } },
                { institutionId: null },
                { institutionId: "" }
              ]
            }
          ]
        }
      ];
    } else {
      // If "All" is selected, show all courses for this institution
      matchConditions.$or = [
        { institutionId: institutionId },
        { 
          $and: [
            { degreeName: { $in: institutionDegreeNames } },
            { 
              $or: [
                { institutionId: { $exists: false } },
                { institutionId: null },
                { institutionId: "" }
              ]
            }
          ]
        }
      ];
    }

    // Add applicant type filter if specified
    if (applicantType && applicantType !== "All") {
      matchConditions.applicantType = applicantType;
    }

    // Add date range filter if specified
    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case "Last 30 days":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Semester":
          startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      matchConditions.submissionDate = { $gte: startDate };
    }

    console.log('Match conditions:', JSON.stringify(matchConditions, null, 2));

    // First, let's see what statuses actually exist in the database
    const allStatuses = await getDegreeApplicationModel().distinct('status', matchConditions);
    console.log('=== DEBUG: Available statuses in database ===');
    console.log('All statuses found:', allStatuses);

    // Get total applications submitted
    const totalApplied = await getDegreeApplicationModel().countDocuments(matchConditions);
    console.log('Total applications found:', totalApplied);

    // Get pending applications (status: pending, Pending, or no status)
    const pending = await getDegreeApplicationModel().countDocuments({
      ...matchConditions,
      $or: [
        { status: "pending" },
        { status: "Pending" },
        { status: { $exists: false } },
        { status: null },
        { status: "" }
      ]
    });
    console.log('Pending applications:', pending);

    // Get approved applications (case insensitive)
    const approved = await getDegreeApplicationModel().countDocuments({
      ...matchConditions,
      status: { $regex: /^approved$/i }
    });
    console.log('Approved applications:', approved);

    // Get rejected applications (case insensitive)
    const rejected = await getDegreeApplicationModel().countDocuments({
      ...matchConditions,
      status: { $regex: /^rejected$/i }
    });
    console.log('Rejected applications:', rejected);

    const result = [
      { stage: "Applied", value: totalApplied },
      { stage: "Pending", value: pending },
      { stage: "Approved", value: approved },
      { stage: "Rejected", value: rejected }
    ];

    console.log('Final enrollment funnel result:', result);
    res.json(result);
  } catch (error) {
    console.error('Error in getEnrollmentFunnel:', error);
    res.status(500).json({ error: 'Failed to fetch enrollment funnel' });
  }
};

export const getCourseList = async (req: Request, res: Response) => {
  try {
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    if (!institutionId) {
      res.status(401).json({ error: 'Institution ID required' });
      return;
    }

    console.log('=== DEBUG: Course List ===');
    console.log('Institution ID:', institutionId);

    // Get degrees for this institution only
    const degrees = await getDegreeModel().find({ institutionId }).select('degreeName');
    const courseNames = degrees.map(d => d.degreeName);
    
    console.log('Degrees found for this institution:', degrees.length);
    console.log('Course names:', courseNames);
    
    res.json(courseNames);
  } catch (error) {
    console.error('Error in getCourseList:', error);
    res.status(500).json({ error: 'Failed to fetch course list' });
  }
}; 

// GET /insights/applicant-type-breakdown
export const getApplicantTypeBreakdown = async (req: Request, res: Response) => {
  try {
    // Get institution ID from JWT token instead of header
    const user = (req as any).user;
    const institutionId = user?._id || user?.id || user?.userId;
    if (!institutionId) {
      res.status(401).json({ error: 'Institution ID required' });
      return;
    }

    // Get query parameters for filtering
    const { dateRange, courseType, applicantType } = req.query;
    
    console.log('=== DEBUG: Applicant Type Breakdown ===');
    console.log('Institution ID:', institutionId);
    console.log('Date Range filter:', dateRange);
    console.log('Course Type filter:', courseType);
    console.log('Applicant Type filter:', applicantType);

    // Get degrees for this institution to get degree names
    let institutionDegrees = await getDegreeModel().find({ institutionId }).select('degreeName courseId');
    
    console.log('=== DEBUG: Applicant Type Course Filtering ===');
    console.log('All degrees for institution before filtering:', institutionDegrees.map(d => d.degreeName));
    console.log('Selected course type:', courseType);
    
    const institutionDegreeNames = institutionDegrees.map(d => d.degreeName);
    
    console.log('Filtered degrees for this institution:', institutionDegrees.length);
    console.log('Degree names:', institutionDegreeNames);

    // Build match conditions
    const matchConditions: any = {};
    
    if (courseType && courseType !== "All") {
      // If specific course is selected, filter by that course only
      matchConditions.degreeName = courseType;
      matchConditions.$or = [
        { institutionId: institutionId },
        { 
          $and: [
            { degreeName: courseType },
            { 
              $or: [
                { institutionId: { $exists: false } },
                { institutionId: null },
                { institutionId: "" }
              ]
            }
          ]
        }
      ];
    } else {
      // If "All" is selected, show all courses for this institution
      matchConditions.$or = [
        { institutionId: institutionId },
        { 
          $and: [
            { degreeName: { $in: institutionDegreeNames } },
            { 
              $or: [
                { institutionId: { $exists: false } },
                { institutionId: null },
                { institutionId: "" }
              ]
            }
          ]
        }
      ];
    }

    // Add applicant type filter if specified
    if (applicantType && applicantType !== "All") {
      matchConditions.applicantType = applicantType;
    }

    // Add date range filter if specified
    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case "Last 30 days":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Semester":
          startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last Year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      matchConditions.submissionDate = { $gte: startDate };
    }

    console.log('Match conditions:', JSON.stringify(matchConditions, null, 2));

    // Debug: Check what applications are being matched
    const matchedApplications = await getDegreeApplicationModel().find(matchConditions).select('applicantType degreeName institutionId');
    console.log('=== DEBUG: Applicant Type Applications ===');
    console.log('Total applications matched:', matchedApplications.length);
    console.log('Applications by degree:', matchedApplications.map(app => ({
      degreeName: app.degreeName,
      applicantType: app.applicantType,
      institutionId: app.institutionId
    })));

    // Aggregate applications by applicant type for this institution
    const result = await getDegreeApplicationModel().aggregate([
      { $match: matchConditions },
      { $group: { _id: '$applicantType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { type: '$_id', count: 1, _id: 0 } }
    ]);

    console.log('Applicant type breakdown result:', result);
    res.json(result);
  } catch (error) {
    console.error('Error in getApplicantTypeBreakdown:', error);
    res.status(500).json({ error: 'Failed to fetch applicant type breakdown' });
  }
}; 