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
  cv: { type: String },
  submissionDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// Use the 'EducationalInstitution' database
const db = mongoose.connection.useDb('EducationalInstitution');
const DegreeApplication = db.model<IDegreeApplication>('DegreeApplication', DegreeApplicationSchema, 'DegreeApplications');

export default DegreeApplication;