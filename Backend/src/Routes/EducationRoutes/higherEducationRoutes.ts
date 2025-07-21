import { Router, Request, Response, NextFunction } from 'express';
import { getAllHigherDegrees, getFilterOptions } from '../../controllers/educationControllers/higherDegreeController';
import { getCurrentUser } from '../../controllers/AuthControllers/UserController';
import { authMiddleware } from '../../middleware/authMiddleware';
import { getPopularCourses, getApplicationTrends, getDemographics, getProgramFillRate, getApplicationRush, getApplicationRushByDeadline, getCourseList, getEnrollmentFunnel } from '../../controllers/educationControllers/insightsController';

const router = Router();

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/viewHigherDegrees', asyncHandler(getAllHigherDegrees));
router.get('/filters', asyncHandler(getFilterOptions));
router.get('/me', authMiddleware, getCurrentUser);
router.get('/insights/popular-courses', asyncHandler(getPopularCourses));
router.get('/insights/application-trends', asyncHandler(getApplicationTrends));
router.get('/insights/demographics', asyncHandler(getDemographics));
router.get('/insights/program-fill-rate', asyncHandler(getProgramFillRate));
router.get('/insights/application-rush', asyncHandler(getApplicationRush));
router.get('/insights/application-rush-by-deadline', asyncHandler(getApplicationRushByDeadline));
router.get('/insights/course-list', asyncHandler(getCourseList));
router.get('/insights/enrollment-funnel', asyncHandler(getEnrollmentFunnel));

export default router;