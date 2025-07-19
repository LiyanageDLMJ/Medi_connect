import express from "express";
import {
  getAllCandidates,
  getCandidatesBySpecialty,
  getCandidatesByGraduationYear,
  searchCandidatesByName,
  compareCandidates,
  getAvailableSpecialties,
  getAvailableGraduationYears,
  getCandidateById,
  advancedSearch,
} from "../../controllers/RecuiterControllers/candidateController";

const router = express.Router();

// LIST + FILTER
router.get("/", getAllCandidates);

// ADVANCED SEARCH
router.get("/advanced-search", advancedSearch);

// SIMPLE SEARCH BY NAME (?name=)
router.get("/search", searchCandidatesByName);

// SPECIALTIES AND YEARS FOR FILTER UI
router.get("/specialties", getAvailableSpecialties);
router.get("/years", getAvailableGraduationYears);

// FILTER BY SPECIALTY OR YEAR
router.get("/specialty/:specialty", getCandidatesBySpecialty);
router.get("/year/:year", getCandidatesByGraduationYear);

// COMPARE POST { candidateIds: [] }
router.post("/compare", compareCandidates);

// GET SINGLE
router.get("/:id", getCandidateById);

export default router;
