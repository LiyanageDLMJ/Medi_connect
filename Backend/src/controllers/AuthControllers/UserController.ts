import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel'; // Base User model
import Doctor from '../../models/DoctorModel'; // Doctor model
import EducationalInstitute from '../../models/EducationalInstituteModel'; // Educational Institute model
import Recruiter from '../../models/RecruiterModel'; // Recruiter model
import MedicalStudent from '../../models/MedicalStudentModel'; // Medical Student model

// Map userType to corresponding models and discriminator keys
const userModels: { [key: string]: any } = {
  Doctor: Doctor,
  MedicalStudent: MedicalStudent,
  Recruiter: Recruiter,
  EducationalInstitute: EducationalInstitute,
};

// Normalize userType to match discriminator keys
const normalizeUserType = (userType: string) => {
  const mapping: { [key: string]: string } = {
    doctor: 'Doctor',
    medical_student: 'MedicalStudent',
    recruiter: 'Recruiter',
    educational_institute: 'EducationalInstitute',
  };
  return mapping[userType.toLowerCase()] || userType;
};

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, userType, ...otherFields } = req.body;

    // Validate required fields
    if (!email || !password || !confirmPassword || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    console.log('userType:', userType);
    
    // Normalize userType
    const normalizedUserType = normalizeUserType(userType);
    console.log('normalizedUserType:', normalizedUserType);
    
    // Check if the userType is valid
    if (!userModels[normalizedUserType]) {
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
    const Model = userModels[normalizedUserType];
    const newUser = new Model({
      email,
      password: hashedPassword,
      userType: normalizedUserType,
      ...otherFields, // Additional fields specific to the user type
    });

    await newUser.save();

    // Return user data without sensitive information
    const userData = {
      id: newUser._id,
      email: newUser.email,
      userType: newUser.userType,
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
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

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your_jwt_secret', // Replace with a secure secret in production
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};