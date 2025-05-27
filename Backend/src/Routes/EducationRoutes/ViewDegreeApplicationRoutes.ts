import { Router } from "express";
import { viewDegreeApplications } from "../../controllers/educationControllers/viewDegreeApplicationControllers";

const router = Router();

// Route to view all degree applications
router.get("/view", viewDegreeApplications);

export default router;