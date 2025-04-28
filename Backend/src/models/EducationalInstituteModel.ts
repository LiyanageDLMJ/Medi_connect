import mongoose from 'mongoose';
import User from './UserModel'; // Import the common User model

const educationalInstituteSchema = new mongoose.Schema({
  instituteName: {
    type: String,
    required: true,
  },
  instituteType: {
    type: String,
    required: true,
    enum: ['medical_college', 'nursing_school', 'dental_school', 'other'],
  },
  accreditation: {
    type: String,
    required: true,
  },
  establishedYear: {
    type: Number,
    required: true,
    min: 1800,
    max: 2025,
  },
}, { timestamps: true });

// Use discriminator for Educational Institute
const EducationalInstitute = User.discriminator('EducationalInstitute', educationalInstituteSchema,"Education Institutions");

export default EducationalInstitute;