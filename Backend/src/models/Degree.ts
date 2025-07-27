

import mongoose, { Schema, Document } from "mongoose";

export interface IDegree extends Document {
  courseId: number;
  degreeName: string;
  institution: string;
  institutionId: string;
  status: string;
  mode: string;
  applicationDeadline: Date;
  eligibility: string;
  seatsAvailable: number;
  applicantsApplied: number;
  duration: string;
  tuitionFee: string;
  image?: string;
  description?: string;
  skillsRequired?: string;
  perks?: string[]; // changed from string to string[]
  createdAt: Date;
  updatedAt: Date;
}

// Use the 'EducationalInstitution' database
const db = mongoose.connection.useDb("EducationalInstitution");

// Counter schema for auto-increment
const CounterSchema = new Schema({
  _id: String,
  seq: Number,
});
const Counter = db.model('Counter', CounterSchema, 'Counters');

// Middleware to auto-increment courseId using counter collection
const DegreeSchema: Schema = new Schema(
  {
    courseId: {
      type: Number,
      required: [false, "Course ID is required"],
      unique: true,
    },
    degreeName: {
      type: String,
      required: [true, "Degree name is required"],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, "Institution is required"],
      trim: true,
    },
    institutionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Open", "Closed"],
      default: "Open",
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online",
    },
    applicationDeadline: {
      type: Date,
      required: [true, "Application deadline is required"],
      validate: {
        validator: (value: Date) => value > new Date(),
        message: "Application deadline must be in the future",
      },
    },
    eligibility: {
      type: String,
      required: false,
      trim: true,
    },
    seatsAvailable: {
      type: Number,
      required: false,
      min: [0, "Seats available cannot be negative"],
    },
    applicantsApplied: {
      type: Number,
      required: false,
      min: [0, "Applicants applied cannot be negative"],
      default: 0,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    tuitionFee: {
      type: String,
      required: [true, "Tuition fee is required"],
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    skillsRequired: {
      type: String,
      required: false,
      trim: true,
    },
    perks: {
      type: [String],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to auto-increment courseId using counter collection
DegreeSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'courseId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.courseId = counter.seq;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

const Degree = db.model<IDegree>("Degree", DegreeSchema, "Degrees");

export default Degree;