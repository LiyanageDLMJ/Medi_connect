import { Request, Response, RequestHandler } from "express";
import DegreeApplication from "../../models/DegreeApplication";
import Degree from "../../models/Degree";

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

    const institutionId = queryInstitutionId || req.headers['x-user-id'];
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
      const degrees = await Degree.find({ institutionId }).select('courseId');
      filter.degreeId = { $in: degrees.map(d => d.courseId) };
    }

    // Search filter (name, email, or degree name)
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      const degrees = await Degree.find({
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
    const applications = await DegreeApplication.find(filter)
      .sort({ submissionDate: -1 })
      .lean();

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
      status: app.status,
      appliedDate: app.submissionDate.toISOString().split("T")[0],
    }));

    // Get available filters for frontend
    const statuses = await DegreeApplication.distinct('status');
    const degrees = await Degree.find().select('courseId degreeName');

    res.status(200).json({
      applications: transformedApplications,
      filters: {
        statuses,
        degrees: degrees.map(d => ({
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
    const application = await DegreeApplication.findById(id);
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
    const app = await DegreeApplication.findById(id);
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
    await DegreeApplication.findByIdAndUpdate(id, { status });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};