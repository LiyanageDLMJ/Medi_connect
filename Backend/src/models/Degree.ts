import mongoose, { Schema, Document } from 'mongoose';

export interface IDegree extends Document {
  degreeName: string;
  status: string;
  mode: string;
  applicationDeadline: Date;
  eligibility: string;
  seatsAvailable: number;
  applicantsApplied: number;
  duration: string;
  tuitionFee: string;
  institute: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DegreeSchema: Schema = new Schema({
  degreeName: { type: String, required: true },
  status: { type: String, required: true, enum: ['Open', 'Closed'] },
  mode: { type: String, required: true, enum: ['Online', 'Offline', 'Hybrid'] },
  applicationDeadline: { type: Date, required: true },
  eligibility: { type: String, required: true },
  seatsAvailable: { type: Number, required: true },
  applicantsApplied: { type: Number, required: true },
  duration: { type: String, required: true },
  tuitionFee: { type: String, required: true },
  institute: { type: Schema.Types.ObjectId, ref: 'EducationalInstitute', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const db = mongoose.connection.useDb('Degrees');
const Degree = db.model<IDegree>('Degree', DegreeSchema, 'Degreedata');

export default Degree;