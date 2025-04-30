// src/models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["Doctor", "MedicalStudent", "Recruiters", "EducationalInstitute"],
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    higherEducation: {
      type: String,
    },
  },
  {
    timestamps: true,  
  }
);



const db = mongoose.connection.useDb('MediConnect');
const User = db.model("User", userSchema, "users");

export default User;
    