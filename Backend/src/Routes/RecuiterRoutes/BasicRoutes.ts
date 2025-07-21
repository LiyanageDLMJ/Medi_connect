import express, { Request, Response } from "express";
import { getCurrentUser } from '../../controllers/AuthControllers/UserController';
import { authMiddleware } from '../../middleware/authMiddleware';
const router = express.Router();

router.get("/", (req: Request, res: Response) =>
     { res.send("This is home route"); });

router.get("/Job", (req: Request, res: Response) =>
     { res.send("this is Job page"); });

router.get('/me', authMiddleware, getCurrentUser);
