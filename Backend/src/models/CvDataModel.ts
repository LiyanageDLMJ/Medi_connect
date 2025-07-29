import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
  graduationDate: String,
  medicalLicenseNumber: String,
  medicalLicenseIssuer: String,
  jobTitle: String,
  hospitalInstitution: String,
  employmentPeriod: String,
}, { _id: false });

const CvDataSchema = new mongoose.Schema({
  yourName: String,
  professionalTitle: String,
  currentLocation: String,
  linkedinLink: String,
  careerSummary: String,
  contactPhone: String,
  contactEmail: String,
  medicalDegree: String,
  university: String,
  specialization: String,
  experience: String,
  certificationInput: [CertificationSchema],
  resumePdfUrl: String,
}, { collection: 'cvdatas', timestamps: true });

const CvDataModel = mongoose.model('CvData', CvDataSchema, 'cvdatas');
export default CvDataModel; 