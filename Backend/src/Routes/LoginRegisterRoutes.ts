import express, { RequestHandler } from 'express';
import { register, login, forgotPassword, resetPassword, getUserByEmail, getCurrentUser, getInstituteByName } from '../controllers/AuthControllers/UserController'; // Import the centralized controller
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Route for user registration
router.post('/register', register as RequestHandler);

// Route for user login
router.post('/login', login as RequestHandler);

// Route for forgot password
router.post('/forgot-password', forgotPassword as RequestHandler);

// Route for password reset
router.post('/reset-password', resetPassword as RequestHandler);

// Route to get user by email
router.get('/by-email/:email', getUserByEmail as RequestHandler);

// Route to get current user info from JWT
router.get('/me', authMiddleware, getCurrentUser as RequestHandler);

// Route to get institute by name
router.get('/by-institute-name/:name', getInstituteByName as RequestHandler);

export default router;