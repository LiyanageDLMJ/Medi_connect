import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['doctor', 'medical_student', 'recruiter', 'educational_institute'],
  },
}, { 
  timestamps: true,
  discriminatorKey: 'userType', // Add discriminatorKey for inheritance
});

const User = mongoose.model('User', userSchema,"UserModel"); // Export the User model
export default User;