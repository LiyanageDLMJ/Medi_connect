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
    enum: [
      'Dermatologist',
      'Neurologist',
      'Obstetrics and gynaecology',
      'Family medicine',
      'Cardiologist',
      'Gastroenterologist',
      'Internal medicine',
      'Endocrinologist',
      'Ophthalmologist',
      'Pulmonologist',
      'Rheumatologist',
      'Urologist',
    ],
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
const Doctor = User.discriminator('Doctor', doctorSchema,"Doctors");

export default Doctor;