import mongoose, { Schema, Document, HydratedDocument } from 'mongoose';

export interface IDegree extends Document {
  degreeName: string;
  status: string;
  mode: string;
  applicationDeadline: Date;
  eligibility: string;
  seatsAvailable: number;
  applicantsApplied: number;
  duration: string;
  tuitionFee: string;
  institute: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DegreeSchema: Schema = new Schema(
  {
    degreeName: {
      type: String,
      required: [true, 'Degree name is required'],
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
      required: [true, 'Application deadline is required'],
      validate: {
        validator: (value: Date) => value > new Date(),
        message: 'Application deadline must be in the future',
      },
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility criteria is required'],
      trim: true,
    },
    seatsAvailable: {
      type: Number,
      required: [true, 'Seats available is required'],
      min: [0, 'Seats available cannot be negative'],
    },
    applicantsApplied: {
      type: Number,
      required: [true, 'Applicants applied is required'],
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
    institute: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Institute is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Validate that institute references a valid EducationalInstitute
DegreeSchema.pre('save', async function (this: HydratedDocument<IDegree>, next) {
  const User = mongoose.model('User');
  const institute = await User.findById(this.institute);
  if (!institute || institute.userType !== 'educational_institute') {
    return next(new Error('Institute must be a valid educational institute'));
  }
  next();
});

// Switch to the 'test' database and define the model
const db = mongoose.connection.useDb('EducationalInstitution');
const Degree = db.model<IDegree>('Degree', DegreeSchema, 'Degrees');

export default Degree;