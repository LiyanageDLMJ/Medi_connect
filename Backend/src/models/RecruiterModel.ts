import mongoose from 'mongoose';
import User from './UserModel'; // Import the common User model

const recruiterSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyType: {
    type: String,
    required: true,
    enum: ['hospital', 'clinic', 'pharmaceutical', 'other'],
  },
  position: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Use discriminator for Recruiter

const Recruiter = User.discriminator('Recruiter', recruiterSchema);

export default Recruiter;