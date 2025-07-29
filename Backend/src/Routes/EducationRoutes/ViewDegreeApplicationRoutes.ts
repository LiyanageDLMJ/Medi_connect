import { Router } from "express";
import { viewDegreeApplications, updateApplicationStatus, getApplicationById, deleteApplication, updateOldApplications } from "../../controllers/educationControllers/viewDegreeApplicationControllers";
import { RequestHandler } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

// Route to view all degree applications
router.get("/view", authMiddleware, viewDegreeApplications);
// Route to update application status
router.patch("/updateStatus/:id", authMiddleware, updateApplicationStatus);
// Route to get a single application by ID
router.get("/view/:id", authMiddleware, getApplicationById as RequestHandler);
// Route to delete an application
router.delete("/delete/:id", authMiddleware, deleteApplication as RequestHandler);
// Route to update old applications without applicantType
router.post("/update-old-applications", authMiddleware, updateOldApplications);

export default router;