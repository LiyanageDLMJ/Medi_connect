import express, { RequestHandler } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/AuthControllers/UserController'; // Import the centralized controller

const router = express.Router();

// Route for user registration
router.post('/register', register as RequestHandler);

// Route for user login
router.post('/login', login as RequestHandler);

// Route for forgot password
router.post('/forgot-password', forgotPassword as RequestHandler);

// Route for password reset
router.post('/reset-password', resetPassword as RequestHandler);

export default router;