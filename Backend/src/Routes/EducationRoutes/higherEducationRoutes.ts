import { Router, Request, Response, NextFunction } from 'express';
import { getAllHigherDegrees, getFilterOptions } from '../../controllers/educationControllers/higherDegreeController';
import { getCurrentUser } from '../../controllers/AuthControllers/UserController';
import { authMiddleware } from '../../middleware/authMiddleware';
import { getPopularCourses, getApplicationTrends, getDemographics, getProgramFillRate, getApplicationRush, getApplicationRushByDeadline, getCourseList, getEnrollmentFunnel, getApplicantTypeBreakdown } from '../../controllers/educationControllers/insightsController';

const router = Router();

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/test', (req, res) => {
  res.json({ message: 'Higher education routes are working!' });
});

router.get('/viewHigherDegrees', asyncHandler(getAllHigherDegrees));
router.get('/filters', asyncHandler(getFilterOptions));
router.get('/me', authMiddleware, getCurrentUser);
router.get('/insights/popular-courses', authMiddleware, asyncHandler(getPopularCourses));
router.get('/insights/application-trends', authMiddleware, asyncHandler(getApplicationTrends));
router.get('/insights/demographics', authMiddleware, asyncHandler(getDemographics));
router.get('/insights/program-fill-rate', authMiddleware, asyncHandler(getProgramFillRate));
router.get('/insights/application-rush', authMiddleware, asyncHandler(getApplicationRush));
router.get('/insights/application-rush-by-deadline', authMiddleware, asyncHandler(getApplicationRushByDeadline));
router.get('/insights/course-list', authMiddleware, asyncHandler(getCourseList));
router.get('/insights/enrollment-funnel', authMiddleware, asyncHandler(getEnrollmentFunnel));
router.get('/insights/applicant-type-breakdown', authMiddleware, asyncHandler(getApplicantTypeBreakdown));

export default router;