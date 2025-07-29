
import express from "express";
import {
  getAllJobs,
  deleteJob,
  getAllUsers,
  getDoctors,
  getMedicalStudents,
  getInstitutes,
  getJobStats,
  getUserStats,
  handleSignUptPost,
  handleSignIptPost,
  getAllAdmins,
  getAdminByEmail,
  updateAdminByEmail,
  changeAdminPassword,
  changePasswordByEmail,
  getAllCvDatas,
  getCvDataById,
  getAllRecruiters,
  getDetailedUserStats,
  getDetailedJobStats,
  getApplicationStats,
  getSystemHealthStats,
  deleteRecruiter,
  removeInstitute,
  softDeleteMedicalStudent,
  softDeleteDoctor,
  softDeleteAdmin,
  getRecruiterById,
  getApplicantCount,
  getJobApplications,
  getJobById,
  getCvDataByEmail,
  getStudentCvDataByEmail,
  getRecruiterJobCount
} from "../../controllers/adminControllers/adminCondtroller";
import { 
  validateRequest, 
  adminRegistrationSchema, 
  userLoginSchema, 
  passwordChangeSchema,
  profileUpdateSchema,
  sanitizeInputs 
} from "../../middleware/validation.middleware";

const router = express.Router();

const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Existing routes
router.delete("/recruiters/:id", asyncHandler(deleteRecruiter));
router.get("/jobs", asyncHandler(getAllJobs));
router.delete("/jobs/:id", asyncHandler(deleteJob));
router.get("/users", asyncHandler(getAllUsers));
router.get("/doctors", asyncHandler(getDoctors));
router.get("/medicalStudent", asyncHandler(getMedicalStudents));
router.get("/institutes", asyncHandler(getInstitutes));
router.get("/jobCount", asyncHandler(getJobStats));
router.get("/users/count", asyncHandler(getUserStats));
router.get("/admins", asyncHandler(getAllAdmins));
router.get("/admins/:email", asyncHandler(getAdminByEmail));
router.put("/admins/:email", sanitizeInputs, validateRequest(profileUpdateSchema), asyncHandler(updateAdminByEmail));
router.post("/admins/:email/change-password", asyncHandler(changeAdminPassword));
router.put('/change-password', asyncHandler(changePasswordByEmail));
router.get("/cvdatas", asyncHandler(getAllCvDatas));
router.get("/cvdatas/:id", asyncHandler(getCvDataById));
router.get("/cvdatasv/:email", asyncHandler(getCvDataByEmail));
router.get("/recruiters", asyncHandler(getAllRecruiters));
router.delete("/institutes/:id", asyncHandler(removeInstitute));

router.get("/recruiters/:id", asyncHandler(getRecruiterById));
router.get("/applicantscount/:id", asyncHandler(getApplicantCount));
router.get("/jobapplications/:id", asyncHandler(getJobApplications));
router.get("/recruiter/:recruiterId/jobcount", asyncHandler(getRecruiterJobCount));

router.get("/jobs/:id", asyncHandler(getJobById));
router.get("/studentcv/:email", asyncHandler(getStudentCvDataByEmail));

// PATCH: Soft-delete (anonymize) a MedicalStudent by ID
router.patch("/medicalStudent/:id", asyncHandler(softDeleteMedicalStudent));
// PATCH: Soft-delete (anonymize) a Doctor by ID
router.patch("/doctors/:id", asyncHandler(softDeleteDoctor));
// PATCH: Soft-delete (anonymize) an Admin by ID
router.patch("/admins/:id", asyncHandler(softDeleteAdmin));

// New detailed reporting routes
router.get("/reports/user-stats", asyncHandler(getDetailedUserStats));
router.get("/reports/job-stats", asyncHandler(getDetailedJobStats));
router.get("/reports/application-stats", asyncHandler(getApplicationStats));
router.get("/reports/system-health", asyncHandler(getSystemHealthStats));

router.post("/adminsignup", sanitizeInputs, validateRequest(adminRegistrationSchema), asyncHandler(handleSignUptPost));
router.post("/adminsignin", sanitizeInputs, validateRequest(userLoginSchema), asyncHandler(handleSignIptPost));

export default router;
