import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true, 
  }
);

const db = mongoose.connection.useDb('MediConnect');
const EducationalInstitute = db.model("EducationalInstitute", instituteSchema, "users");

export default EducationalInstitute;
