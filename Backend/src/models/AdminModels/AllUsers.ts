// src/models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["Doctor", "MedicalStudent", "Recruiters", "EducationalInstitute"],
      required: true,
    },
    location: {
      type: String,
    },
    specialty: {
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);

const db = mongoose.connection.useDb("MediConnect");
const User = db.model("AllUser", userSchema, "users");

export default User;
