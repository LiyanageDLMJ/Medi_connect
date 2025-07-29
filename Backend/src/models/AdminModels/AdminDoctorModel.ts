import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    userType: {
      type: String,
    },
    profession: {
      type: String,
      default: "Removed",
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
    status: {
      type: String,
      enum: ["ACTIVE", "REMOVED"],
      default: "ACTIVE",
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

const db = mongoose.connection.useDb("MediConnect");
const User = db.model("User", userSchema, "users");

export default User;
