import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CvUpdateSchema = new Schema({
  yourName: { type: String, required: true },
  professionalTitle: { type: String, required: true },
  currentLocation: { type: String, required: true },
  linkedinLink: String,
  careerSummary: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  medicalDegree: { type: String, required: true },
  university: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  certificationInput: [String],
  graduationDate: String,
  medicalLicenseNumber: { type: String, required: true },
  medicalLicenseIssuer: { type: String, required: true },
  jobTitle: { type: String, required: true },
  hospitalInstitution: { type: String, required: true },
  employmentPeriod: { type: String, required: true },
  resumeRawUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Add userId field
}, {
  timestamps: true
});

const CvDoctorUpdate=mongoose.model('cvData',CvUpdateSchema);

export default CvDoctorUpdate;