import mongoose from 'mongoose';
import User from './UserModel'; // Import the common User model

const doctorSchema = new mongoose.Schema({
  profession: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
    // enum removed to allow any specialty
  },
  location: {
    type: String,
    required: true,
  },
  higherEducation: {
    type: String,
    required: true,
    enum: ['yes', 'no'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  skills: {
    type: [String],
    required: false,
    default: [],
  },
  about: {
    type: String,
    required: false,
  },
  experienceYears: {
    type: Number,
    required: false,
    min: 0,
  },
  highestQualification: {
    type: String,
    required: false,
  },
}, { timestamps: true });

// Use discriminator for Doctor

const Doctor = User.discriminator('Doctor', doctorSchema); // 'Doctor' matches enum


export default Doctor;