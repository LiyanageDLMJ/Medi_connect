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
}, { timestamps: true });

// Use discriminator for Doctor

const Doctor = User.discriminator('Doctor', doctorSchema); // 'Doctor' matches enum


export default Doctor;