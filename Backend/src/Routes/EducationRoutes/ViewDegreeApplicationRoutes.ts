import { Router } from "express";
import { viewDegreeApplications, updateApplicationStatus, getApplicationById, deleteApplication, updateOldApplications } from "../../controllers/educationControllers/viewDegreeApplicationControllers";
import { RequestHandler } from "express";

const router = Router();

// Route to view all degree applications
router.get("/view", viewDegreeApplications);
// Route to update application status
router.patch("/updateStatus/:id", updateApplicationStatus);
// Route to get a single application by ID
router.get("/view/:id", getApplicationById as RequestHandler);
// Route to delete an application
router.delete("/delete/:id", deleteApplication as RequestHandler);
// Route to update old applications without applicantType
router.post("/update-old-applications", updateOldApplications);

export default router;