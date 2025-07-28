import mongoose from "mongoose";

const medicalStudentSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true, // Automatically generate ObjectId if not provided
    },
    email: {
      type: String,
    },  
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
     
    },
    currentInstitute: {
      type: String,
      required: true,
    },
    yearOfStudy: {
      type: Number,
      required: true,
    },
    fieldOfStudy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    _id: true, // Ensure _id is explicitly managed
  }
);





const db = mongoose.connection.useDb('MediConnect');
const MedicalStudent = db.model("MedicalStudent", medicalStudentSchema, "users");

export default MedicalStudent;



