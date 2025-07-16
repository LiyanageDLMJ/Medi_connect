import express, { RequestHandler } from 'express';
import { register, login } from '../../controllers/AuthControllers/UserController'; // Import the centralized controller

const router = express.Router();

// Route for user registration
router.post('/register', register as RequestHandler);

// Route for user login
router.post('/login', login as RequestHandler);

export default router;