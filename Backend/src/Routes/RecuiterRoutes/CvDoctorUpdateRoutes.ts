import express from "express";
import { getDoctorNameSuggestions, getDoctorCvByName } from "../../controllers/RecuiterControllers/candidateController";

/*
 * Routes for recruiter side doctor CV autocomplete & fetch.
 * These are consumed by the React recruiter & physician CVComparison pages.
 *
 *   GET /CvdoctorUpdate/viewDoctorsCv?yourName=<partial>
 *     -> returns array of matching doctor names
 *   GET /CvdoctorUpdate/getDoctorCv?yourName=<exact>
 *     -> returns full CV document for selected doctor
 */

const router = express.Router();

// Autocomplete suggestions
router.get("/viewDoctorsCv", getDoctorNameSuggestions);

// Full CV by doctor name
router.get("/getDoctorCv", getDoctorCvByName);

export default router;
