import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalStudentCv extends Document {
    userId: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    degree: string;
    university: string;
    graduationYear: number;
    specialization: string;
    experienceYears: number;
    resumeRawUrl: string;
}

const medicalStudentCvSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        location: { type: String, required: true },
        degree: { type: String, required: true },
        university: { type: String, required: true },
        graduationYear: { type: Number, required: true },
        specialization: { type: String, required: true },
        experienceYears: { type: Number, required: true },
        resumeRawUrl: { type: String, required: true },
    },
    {
        collection: 'medicalstudentcv',
        timestamps: true,
    }
);

const MedicalStudentCv = mongoose.model('MedicalStudentCv', medicalStudentCvSchema);
export default MedicalStudentCv;