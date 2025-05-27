import { Router, Request, Response, NextFunction } from 'express';
import { getAllHigherDegrees, getFilterOptions } from '../../controllers/educationControllers/higherDegreeController';

const router = Router();

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/viewHigherDegrees', asyncHandler(getAllHigherDegrees));
router.get('/filters', asyncHandler(getFilterOptions));

export default router;