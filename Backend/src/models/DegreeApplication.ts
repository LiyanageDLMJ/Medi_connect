import mongoose, { Schema, Document } from 'mongoose';

export interface IDegreeApplication extends Document {
  name: string;
  email: string;
  phone?: string;
  currentEducation?: string;
  linkedIn?: string;
  portfolio?: string;
  additionalInfo?: string;
  degreeId: number;
  degreeName: string;
  institution: string;
  submissionDate: Date;
  status: string;
  createdAt: Date;
}

const DegreeApplicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  currentEducation: { type: String },
  linkedIn: { type: String },
  portfolio: { type: String },
  additionalInfo: { type: String },
  degreeId: { type: Number, required: true },
  degreeName: { type: String, required: true },
  institution: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Submitted' },
  createdAt: { type: Date, default: Date.now }
});

const db = mongoose.connection.useDb('EducationalInstitution');
const DegreeApplication = db.model<IDegreeApplication>('DegreeApplication', DegreeApplicationSchema, 'DegreeApplications');

export default DegreeApplication;