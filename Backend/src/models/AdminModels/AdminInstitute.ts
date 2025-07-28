import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    establishedYear: {
      type: Number,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'REMOVED'],
      default: 'ACTIVE',
    },
    photoUrl: {
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
    instituteName: {
      type: String,
      default: '',
    },
    instituteType: {
      type: String,
      default: '',
    },
    accreditation: {
      type: String,
      default: '',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const db = mongoose.connection.useDb('MediConnect');
const EducationalInstitute = db.model("EducationalInstitute", instituteSchema, "users");

export default EducationalInstitute;
