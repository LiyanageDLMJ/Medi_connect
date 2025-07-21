import express, { RequestHandler } from 'express';
import { register, login, getUserByEmail, getCurrentUser, getInstituteByName } from '../controllers/AuthControllers/UserController'; // Import the centralized controller

const router = express.Router();

// Route for user registration
router.post('/register', register as RequestHandler);

// Route for user login
router.post('/login', login as RequestHandler);

// Route to get user by email
router.get('/by-email/:email', getUserByEmail as RequestHandler);

// Route to get current user info from JWT
router.get('/api/me', getCurrentUser as RequestHandler);

// Route to get institute by name
router.get('/by-institute-name/:name', getInstituteByName as RequestHandler);

export default router;