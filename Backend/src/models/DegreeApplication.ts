import mongoose, { Schema, Document } from 'mongoose';

export interface IDegreeApplication extends Document {
  name: string;
  email: string;
  phone?: string;
  currentEducation?: string;
  additionalInfo?: string;
  degreeId: string;
  degreeName: string;
  institution: string;
  institutionId: string; // Add institutionId field
  applicantType?: string; // Add applicantType field (MedicalStudent or Doctor)
  cv?: string;
  submissionDate: Date;
  status: string;
  createdAt: Date;
}

const DegreeApplicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  currentEducation: { type: String },
  additionalInfo: { type: String },
  degreeId: { type: String, required: true },
  degreeName: { type: String, required: true },
  institution: { type: String, required: true },
  institutionId: { type: String, required: true },
  applicantType: { type: String },
  cv: { type: String },
  submissionDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// Function to get the DegreeApplication model with EducationalInstitution database
let DegreeApplication: mongoose.Model<IDegreeApplication> | null = null;

const getDegreeApplicationModel = (): mongoose.Model<IDegreeApplication> => {
  if (!DegreeApplication) {
    try {
      // Ensure we're connected to the database
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database not connected');
      }
      
      // Use the 'EducationalInstitution' database
      const db = mongoose.connection.useDb('EducationalInstitution');
      DegreeApplication = db.model<IDegreeApplication>('DegreeApplication', DegreeApplicationSchema, 'DegreeApplications');
      console.log('DegreeApplication model initialized with EducationalInstitution database');
    } catch (error) {
      console.error('Error initializing DegreeApplication model with EducationalInstitution:', error);
      throw new Error('Failed to initialize DegreeApplication model');
    }
  }
  return DegreeApplication;
};

export default getDegreeApplicationModel;