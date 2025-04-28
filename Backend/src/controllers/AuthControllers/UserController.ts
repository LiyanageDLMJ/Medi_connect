import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel'; // Base User model
import Doctor from '../../models/DoctorModel'; // Doctor model
import EducationalInstitute from '../../models/EducationalInstituteModel'; // Educational Institute model
import Recruiter from '../../models/RecruiterModel'; // Recruiter model
import MedicalStudent from '../../models/MedicalStudentModel'; // Medical Student model

// Map userType to corresponding models
const userModels: { [key: string]: any } = {
  doctor: Doctor,
  educational_institute: EducationalInstitute,
  recruiter: Recruiter,
  medical_student: MedicalStudent, // Add MedicalStudent model
};

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, userType, ...otherFields } = req.body;

    // Validate required fields
    if (!email || !password || !confirmPassword || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the userType is valid
    if (!userModels[userType]) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using the appropriate model
    const Model = userModels[userType];
    const newUser = new Model({
      email,
      password: hashedPassword,
      userType,
      ...otherFields, // Additional fields specific to the user type
    });

    await newUser.save();

    // Return user data without sensitive information
    const userData = {
      id: newUser._id,
      email: newUser.email,
      userType: newUser.userType,
      // Add any other non-sensitive user info needed by the frontend
    };

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: userData 
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'An error occurred during registration' });
  }
};

// Login a user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email and populate based on userType
    const baseUser = await User.findOne({ email });
    if (!baseUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the specific user model based on userType
    const Model = userModels[baseUser.userType];
    const user = await Model.findById(baseUser._id);
    if (!user) {
      return res.status(404).json({ message: 'User details not found' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    // Generate a JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        userType: user.userType,
        // Add any additional user-specific fields needed in the token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        // Add any other non-sensitive user info needed by the frontend
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error && error.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    res.status(500).json({ message: 'An error occurred during login' });
  }
};