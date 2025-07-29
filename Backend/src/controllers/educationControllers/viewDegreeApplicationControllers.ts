import { Request, Response, RequestHandler } from "express";
import getDegreeApplicationModel from "../../models/DegreeApplication";
import getDegreeModel from "../../models/Degree";

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
    const institutionId = queryInstitutionId || (req as any).user?._id;
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
      filter.degreeId = degreeId;
    }

    // Institution filter
    if (institutionId) {
      // Find all degrees for this institution
      const degrees = await getDegreeModel().find({ institutionId }).select('courseId _id degreeName');
      
      // Debug: Check all degrees in database vs institution degrees
      const allDegrees = await getDegreeModel().find({}).select('courseId _id degreeName institutionId');
      console.log('=== DEBUG: Degree Count Analysis ===');
      console.log('Total degrees in database:', allDegrees.length);
      console.log('All degrees with institution IDs:', allDegrees.map(d => ({
        degreeName: d.degreeName,
        institutionId: d.institutionId,
        courseId: d.courseId
      })));
      console.log('Degrees for this institution:', degrees.length);
      console.log('This institution degrees:', degrees.map(d => ({
        degreeName: d.degreeName,
        institutionId: d.institutionId,
        courseId: d.courseId
      })));
      
      // Get both courseIds and _ids for filtering
      const courseIds = degrees.map(d => d.courseId);
      const degreeIds = degrees.map(d => (d._id as any).toString());
      const institutionDegreeNames = degrees.map(d => d.degreeName);
      
      console.log('=== DEBUG: View Applications Institution Filter ===');
      console.log('Institution ID:', institutionId);
      console.log('Institution degrees:', degrees.length);
      console.log('Degree names:', institutionDegreeNames);
      console.log('Course IDs:', courseIds);
      console.log('Degree IDs:', degreeIds);
      
      // Filter applications by institution using the same logic as insights
      filter.$or = [
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
      ];
    }

    // Search filter (name, email, or degree name)
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      const degrees = await getDegreeModel().find({
        $or: [
          { degreeName: searchRegex }
        ]
      }).select('courseId');

      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { degreeId: { $in: degrees.map(d => d.courseId) } }
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
    const institutionDegrees = await getDegreeModel().find({ institutionId }).select('courseId degreeName');
    
    // Debug: Check what degrees are being shown
    console.log('=== DEBUG: View Applications Filter ===');
    console.log('Institution ID:', institutionId);
    console.log('Institution degrees found:', institutionDegrees.length);
    console.log('Institution degree names:', institutionDegrees.map(d => d.degreeName));

    res.status(200).json({
      applications: transformedApplications,
      filters: {
        statuses,
        degrees: institutionDegrees.map(d => ({
          id: d.courseId,
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