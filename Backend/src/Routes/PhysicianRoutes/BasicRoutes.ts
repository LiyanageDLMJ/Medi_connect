import express, { Request, Response } from "express"; // ✅ Fix: Combined import statement
import { getCurrentUser } from '../../controllers/AuthControllers/UserController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send({
        "Message": "This is home route",
        "Greeting": "Hello user"
    });
});

router.get("/CvUpdate", (req: Request, res: Response) => {
    res.send({
        "Message": "this is CvUpdate page"
    });
});

// Endpoint to get current user info
router.get('/me', authMiddleware, getCurrentUser);

export default router; 