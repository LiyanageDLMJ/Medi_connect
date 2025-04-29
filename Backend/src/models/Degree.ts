import mongoose, { Schema, Document, HydratedDocument } from 'mongoose';

export interface IDegree extends Document {
  courseId: number;          // Added for HigherEducationSearch
 
  institution: string;       // Added (temporary) degreeName: string;
  status: string;
  mode: string;
  applicationDeadline: Date;
  eligibility: string;
  seatsAvailable: number;
  applicantsApplied: number;
  duration: string;
  tuitionFee: string;
  image?: string;            // Added for HigherEducationSearch
  createdAt: Date;
  updatedAt: Date;
}

const DegreeSchema: Schema = new Schema(
  {
    courseId: {
      type: Number,
      required: [true, 'Course ID is required'],
      unique: true,
    },

    degreeName: {
      type: String,
      required: [true, 'Degree name is required'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'], // Temporary, as per request
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: ['Online', 'Offline', 'Hybrid'],
      default: 'Online',
    },
    applicationDeadline: {
      type: Date,
      required: [false, 'Application deadline is required'],
      validate: {
        validator: (value: Date) => value > new Date(),
        message: 'Application deadline must be in the future',
      },
    },
    eligibility: {
      type: String,
      required: [false, 'Eligibility criteria is required'],
      trim: true,
    },
    seatsAvailable: {
      type: Number,
      required: [false, 'Seats available is required'],
      min: [0, 'Seats available cannot be negative'],
    },
    applicantsApplied: {
      type: Number,
      required: [false, 'Applicants applied is required'],
      min: [0, 'Applicants applied cannot be negative'],
      default: 0,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    tuitionFee: {
      type: String,
      required: [true, 'Tuition fee is required'],
      trim: true,
    },
    image: {
      type: String,
      required: false, // Optional for HigherEducationSearch
    },
  },
  {
    timestamps: true,
  }
);


// Middleware to auto-increment courseId
DegreeSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const lastDegree = await mongoose.model('Degree').findOne().sort({ courseId: -1 });
      this.courseId = lastDegree ? lastDegree.courseId + 1 : 1;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Switch to the 'EducationalInstitution' database and define the model
const db = mongoose.connection.useDb('EducationalInstitution');
const Degree = db.model<IDegree>('Degree', DegreeSchema, 'Degrees');

export default Degree;