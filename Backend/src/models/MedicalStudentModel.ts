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


const MedicalStudent = User.discriminator('MedicalStudent', medicalStudentSchema);

export default MedicalStudent;