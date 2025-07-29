import { Request, Response, RequestHandler } from "express";
import getDegreeApplicationModel from "../../models/DegreeApplication";
import getDegreeModel from "../../models/Degree";
import mongoose from "mongoose";

export const viewDegreeApplications: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      fromDate, 
      toDate, 
      degreeId,
      search,
      institutionId: queryInstitutionId
    } = req.query;

    // Use query parameter if provided, otherwise get from JWT token
    let institutionId = queryInstitutionId || (req as any).user?.id;
    
    // Debug: Check what's actually in req.user
    console.log('=== DEBUG: req.user Object ===');
    console.log('req.user:', (req as any).user);
    console.log('req.user type:', typeof (req as any).user);
    console.log('req.user keys:', (req as any).user ? Object.keys((req as any).user) : 'No user object');
    console.log('req.user.id:', (req as any).user?.id);
    console.log('req.user._id:', (req as any).user?._id);
    
    // Fallback: If JWT token is expired, try to get institution ID from headers or other sources
    if (!institutionId) {
      // Try to get from x-user-id header (fallback for expired tokens)
      institutionId = req.headers['x-user-id'] as string;
      console.log('Fallback: Using x-user-id header:', institutionId);
    }
    
    console.log('=== VIEW APPLICATIONS DEBUG ===');
    console.log('Query institutionId:', queryInstitutionId);
    console.log('JWT user data:', (req as any).user);
    console.log('JWT user.id:', (req as any).user?.id);
    console.log('JWT user._id:', (req as any).user?._id);
    console.log('JWT user.userType:', (req as any).user?.userType);
    console.log('Final institutionId:', institutionId);
    console.log('Final institutionId type:', typeof institutionId);
    
    // Convert institutionId to string for comparison (if it exists)
    const institutionIdString = institutionId ? String(institutionId) : null;
    console.log('Institution ID for filtering (converted to string):', institutionIdString);
    
    // Build filter object
    const filter: any = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Date range filter
    if (fromDate || toDate) {
      filter.submissionDate = {};
      if (fromDate) {
        filter.submissionDate.$gte = new Date(fromDate as string);
      }
      if (toDate) {
        filter.submissionDate.$lte = new Date(toDate as string);
      }
    }

    // Degree program filter
    if (degreeId) {
      // Validate that degreeId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(degreeId as string)) {
        console.log('Invalid degreeId provided:', degreeId);
        return res.status(400).json({
          success: false,
          message: "Invalid degree ID format"
        });
      }
      filter.degreeId = degreeId;
      console.log('=== DEBUG: Specific Degree Filter ===');
      console.log('Filtering by specific degree ID:', degreeId);
    }

    // Institution filter - ONLY filter applications if we have institutionId AND no specific degreeId
    if (institutionIdString && !degreeId) {
      // Find all degrees for this institution
      const degrees = await getDegreeModel().find({ institutionId: institutionIdString }).select('courseId _id degreeName');
      
      // Debug: Check all degrees in database vs institution degrees
      console.log('=== DEBUG: Institution Degree Filtering ===');
      console.log('Institution ID used for filtering:', institutionIdString);
      console.log('Degrees found for this institution:', degrees.length);
      console.log('Degree IDs found:', degrees.map(d => d._id));
      
      if (degrees.length > 0) {
        // Only show applications for degrees that belong to this institution
        filter.degreeId = { $in: degrees.map(d => d._id) };
      } else {
        // If no degrees found for this institution, show no applications
        filter.degreeId = { $in: [] };
      }
    } else if (institutionIdString && degreeId) {
      console.log('=== DEBUG: Both Institution and Degree Filter ===');
      console.log('Specific degree requested, but also checking institution ownership');
      
      // Verify that the requested degree belongs to this institution
      const degree = await getDegreeModel().findOne({ 
        _id: degreeId, 
        institutionId: institutionIdString 
      });
      
      if (!degree) {
        console.log('Degree does not belong to this institution, showing no applications');
        filter.degreeId = { $in: [] };
      } else {
        console.log('Degree belongs to this institution, showing applications for this degree only');
        // Keep the specific degreeId filter
      }
    } else {
      console.log('No institution ID available - this should not happen for authenticated institutions');
    }

    // Search filter (name, email, or degree name)
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      const degrees = await getDegreeModel().find({
        $or: [
          { degreeName: searchRegex }
        ]
      }).select('_id');

      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { degreeId: { $in: degrees.map(d => d._id) } }
      ];
    }

    // Fetch applications with filters
    const applications = await getDegreeApplicationModel().find(filter)
      .sort({ submissionDate: -1 })
      .lean();

    // Debug: Check applicantType values in applications
    console.log('=== DEBUG: Applications ApplicantType ===');
    applications.forEach((app, index) => {
      console.log(`App ${index + 1}: ${app.name} - applicantType: "${app.applicantType}"`);
    });
    console.log('Total applications found:', applications.length);

    // Transform data
    const transformedApplications = applications.map((app) => ({
      id: app._id.toString(),
      degreeId: app.degreeId.toString(),
      degreeName: app.degreeName,
      institution: app.institution,
      name: app.name,
      email: app.email,
      phone: app.phone || "",
      currentEducation: app.currentEducation || "",
      additionalInfo: app.additionalInfo || "",
      applicantType: app.applicantType || "Unknown", // Add applicantType field
      status: app.status,
      appliedDate: app.submissionDate.toISOString().split("T")[0],
    }));

    // Get available filters for frontend
    const statuses = await getDegreeApplicationModel().distinct('status');
    
    // Get degrees for this institution only (not all degrees)
    let institutionDegrees: any[] = [];
    if (institutionIdString) {
      // Filter out degrees with invalid institution IDs
      institutionDegrees = await getDegreeModel().find({ 
        institutionId: institutionIdString
      }).select('_id degreeName');
      
      console.log('=== DEBUG: Degree Filter Dropdown ===');
      console.log('Institution ID for dropdown:', institutionIdString);
      console.log('Degrees found for dropdown:', institutionDegrees.length);
      console.log('Degree names for dropdown:', institutionDegrees.map(d => d.degreeName));
    } else {
      console.log('No institution ID available, showing empty degree list');
    }
    
    // Debug: Check what degrees are being shown
    console.log('=== DEBUG: View Applications Filter ===');
    console.log('Institution ID:', institutionId);
    console.log('Institution ID type:', typeof institutionId);
    console.log('Institution degrees found:', institutionDegrees.length);
    console.log('Institution degree names:', institutionDegrees.map(d => d.degreeName));
    
    // Debug: Check all degrees in database to compare
    const allDegrees = await getDegreeModel().find({}).select('courseId degreeName institutionId');
    console.log('=== DEBUG: All Degrees in Database ===');
    console.log('Total degrees in database:', allDegrees.length);
    console.log('All degrees with institution IDs:', allDegrees.map(d => ({
      degreeName: d.degreeName,
      institutionId: d.institutionId,
      courseId: d.courseId
    })));
    
    // Debug: Check if there are any degrees without institutionId
    const degreesWithoutInstitutionId = allDegrees.filter(d => !d.institutionId);
    console.log('=== DEBUG: Degrees without institutionId ===');
    console.log('Count:', degreesWithoutInstitutionId.length);
    console.log('Degrees:', degreesWithoutInstitutionId.map(d => ({
      degreeName: d.degreeName,
      courseId: d.courseId
    })));
    
    // Debug: Check if there are any degrees with empty institutionId
    const degreesWithEmptyInstitutionId = allDegrees.filter(d => d.institutionId === '' || d.institutionId === null);
    console.log('=== DEBUG: Degrees with empty institutionId ===');
    console.log('Count:', degreesWithEmptyInstitutionId.length);
    console.log('Degrees:', degreesWithEmptyInstitutionId.map(d => ({
      degreeName: d.degreeName,
      courseId: d.courseId,
      institutionId: d.institutionId
    })));

    res.status(200).json({
      applications: transformedApplications,
      filters: {
        statuses,
        degrees: institutionDegrees.map(d => ({
          id: d._id,
          name: d.degreeName
        }))
      }
    });
  } catch (error: unknown) {
    console.error("Error fetching applications:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching applications",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// GET endpoint to fetch a single application by ID
export const getSingleApplication: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await getDegreeApplicationModel().findById(id);
    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch application" });
  }
};

// GET a single application by ID
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const app = await getDegreeApplicationModel().findById(id);
    if (!app) return res.status(404).json({ error: "Not found" });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch application" });
  }
};

// PATCH endpoint to update application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await getDegreeApplicationModel().findByIdAndUpdate(id, { status });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

// DELETE endpoint to delete an application and update degree count
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find the application first to get the degreeId
    const application = await getDegreeApplicationModel().findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Delete the application
    await getDegreeApplicationModel().findByIdAndDelete(id);

    res.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ success: false, message: "Failed to delete application" });
  }
};

// Update old applications without applicantType
export const updateOldApplications = async (req: Request, res: Response) => {
  try {
    console.log('=== Updating Old Applications ===');
    
    // Find applications without applicantType
    const applicationsWithoutType = await getDegreeApplicationModel().find({
      $or: [
        { applicantType: { $exists: false } },
        { applicantType: null },
        { applicantType: "" }
      ]
    });
    
    console.log(`Found ${applicationsWithoutType.length} applications without applicantType`);
    
    if (applicationsWithoutType.length > 0) {
      // Update them with a default value
      const result = await getDegreeApplicationModel().updateMany(
        {
          $or: [
            { applicantType: { $exists: false } },
            { applicantType: null },
            { applicantType: "" }
          ]
        },
        { $set: { applicantType: "Unknown" } }
      );
      
      console.log(`Updated ${result.modifiedCount} applications`);
      
      res.json({
        success: true,
        message: `Updated ${result.modifiedCount} applications with default applicantType`,
        totalFound: applicationsWithoutType.length,
        totalUpdated: result.modifiedCount
      });
    } else {
      res.json({
        success: true,
        message: "No applications found without applicantType",
        totalFound: 0,
        totalUpdated: 0
      });
    }
  } catch (error) {
    console.error('Error updating old applications:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update old applications",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};