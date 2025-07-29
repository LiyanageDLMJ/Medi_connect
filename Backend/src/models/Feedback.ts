import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId?: string;
  userType?: string;
  userName?: string;
  userEmail?: string;
  rating: number;
  heading: string;
  feedback: string;
  source: 'degree_application' | 'course_posting' | 'general';
  sourceDetails?: string; // Additional details about where feedback was collected
  institutionId?: string; // If feedback is related to a specific institution
  degreeId?: string; // If feedback is related to a specific degree
  status: 'pending' | 'reviewed' | 'resolved';
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  userId: { type: String },
  userType: { type: String }, // MedicalStudent, Doctor, Recruiter, EducationalInstitute, Admin
  userName: { type: String },
  userEmail: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  heading: { type: String, required: true },
  feedback: { type: String, required: true },
  source: { 
    type: String, 
    required: true, 
    enum: ['degree_application', 'course_posting', 'general'],
    default: 'general'
  },
  sourceDetails: { type: String }, // e.g., "After submitting application for MD in Pediatrics"
  institutionId: { type: String },
  degreeId: { type: String },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  adminResponse: { type: String },
}, {
  timestamps: true
});

// Create index for better query performance
FeedbackSchema.index({ source: 1, status: 1, createdAt: -1 });
FeedbackSchema.index({ institutionId: 1, source: 1 });

let Feedback: mongoose.Model<IFeedback> | null = null;

const getFeedbackModel = (): mongoose.Model<IFeedback> => {
  if (!Feedback) {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    const db = mongoose.connection.useDb('EducationalInstitution');
    Feedback = db.model<IFeedback>('Feedback', FeedbackSchema, 'Feedbacks');
    console.log('Feedback model initialized with EducationalInstitution database');
  }
  return Feedback;
};

export default getFeedbackModel; 