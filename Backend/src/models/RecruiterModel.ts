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
    status: {
      type: String,
      enum: ['ACTIVE', 'REMOVED'],
      default: 'ACTIVE',
    },  
    deletedAt: {
      type: Date,
      default: null,
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
    },
    higherEducation: {
      type: String,
      default: '',
    },
    
  }, { timestamps: true });

 
const db = mongoose.connection.useDb('MediConnect');
const Recruiter = db.model("Recruiter", recruiterSchema, "users");

  export default Recruiter;