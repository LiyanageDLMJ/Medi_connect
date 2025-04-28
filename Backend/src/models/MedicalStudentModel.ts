import mongoose from 'mongoose';
import User from './UserModel'; // Import the base User model

const medicalStudentSchema = new mongoose.Schema({
  currentInstitute: {
    type: String,
    required: true,
  },
  yearOfStudy: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Assuming a maximum of 5 years of study
  },
  fieldOfStudy: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Use discriminator for Medical Student
const MedicalStudent = User.discriminator('MedicalStudent', medicalStudentSchema);

export default MedicalStudent;