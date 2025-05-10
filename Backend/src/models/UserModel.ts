import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: {
      values: ['Doctor', 'MedicalStudent', 'Recruiter', 'EducationalInstitute'],
      message: '{VALUE} is not a valid user type',
    },
  },
}, { 
  timestamps: true,
  discriminatorKey: 'userType',
});

const User = mongoose.model('User', userSchema); 
export default User;