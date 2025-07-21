import { Router } from "express";
import { viewDegreeApplications, updateApplicationStatus, getApplicationById } from "../../controllers/educationControllers/viewDegreeApplicationControllers";
import { RequestHandler } from "express";

const router = Router();

// Route to view all degree applications
router.get("/view", viewDegreeApplications);
// Route to update application status
router.patch("/updateStatus/:id", updateApplicationStatus);
// Route to get a single application by ID
router.get("/view/:id", getApplicationById as RequestHandler);

export default router;