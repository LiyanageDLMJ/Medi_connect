import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: function(this: any) {
      // Name is required for all user types except Recruiter
      return this.userType !== 'Recruiter';
    },
    validate: {
      validator: function(this: any, value: string) {
        // Skip validation for Recruiters as they use companyName
        if (this.userType === 'Recruiter') return true;
        return Boolean(value && value.trim().length > 0);
      },
      message: 'Name is required for this user type'
    }
  },
  age: {
    type: Number,
    min: 0,
  },
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
  photoUrl: {
    type: String,
    default: '',
  },
  school: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
    maxlength: [500, 'Bio cannot exceed 500 characters'],
  },
  higherEducation: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no',
  },
  resetPasswordToken: {
    type: String,
    default: '',
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
}, { 
  timestamps: true,
  discriminatorKey: 'userType',
});

const User = mongoose.model('User', userSchema); 
export default User;