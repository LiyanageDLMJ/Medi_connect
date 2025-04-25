import express from 'express';
import { register, login } from '../controllers/AuthControllers/UserController'; // Import the centralized controller

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

export default router;