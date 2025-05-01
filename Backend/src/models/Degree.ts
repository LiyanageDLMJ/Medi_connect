

import mongoose, { Schema, Document } from "mongoose";

export interface IDegree extends Document {
  courseId: number;
  degreeName: string;
  institution: string;
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
  perks?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to auto-increment courseId without changing DB
DegreeSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const lastDegree = await (this.constructor as mongoose.Model<IDegree>)
        .findOne()
        .sort({ courseId: -1 });

      this.courseId = lastDegree ? lastDegree.courseId + 1 : 1;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Use the 'EducationalInstitution' database
const db = mongoose.connection.useDb("EducationalInstitution");
const Degree = db.model<IDegree>("Degree", DegreeSchema, "Degrees");

export default Degree;

// import mongoose, { Schema, Document } from "mongoose";

// export interface IDegree extends Document {
//   courseId: number;
//   degreeName: string;
//   institution: string;
//   status: string;
//   mode: string;
//   applicationDeadline: Date;
//   eligibility: string;
//   seatsAvailable: number;
//   applicantsApplied: number;
//   duration: string;
//   tuitionFee: string;
//   image?: string;
//   description?: string;
//   skillsRequired?: string;
//   perks?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const DegreeSchema: Schema = new Schema(
//   {
//     courseId: {
//       type: Number,
//       required: [true, "Course ID is required"],
//       unique: true,
//     },
//     degreeName: {
//       type: String,
//       required: [true, "Degree name is required"],
//       trim: true,
//     },
//     institution: {
//       type: String,
//       required: [true, "Institution is required"],
//       trim: true,
//     },
//     status: {
//       type: String,
//       required: [true, "Status is required"],
//       enum: ["Open", "Closed"],
//       default: "Open",
//     },
//     mode: {
//       type: String,
//       required: [true, "Mode is required"],
//       enum: ["Online", "Offline", "Hybrid"],
//       default: "Online",
//     },
//     applicationDeadline: {
//       type: Date,
//       required: [true, "Application deadline is required"],
//       validate: {
//         validator: (value: Date) => value > new Date(),
//         message: "Application deadline must be in the future",
//       },
//     },
//     eligibility: {
//       type: String,
//       required: false,
//       trim: true,
//     },
//     seatsAvailable: {
//       type: Number,
//       required: false,
//       min: [0, "Seats available cannot be negative"],
//     },
//     applicantsApplied: {
//       type: Number,
//       required: false,
//       min: [0, "Applicants applied cannot be negative"],
//       default: 0,
//     },
//     duration: {
//       type: String,
//       required: [true, "Duration is required"],
//       trim: true,
//     },
//     tuitionFee: {
//       type: String,
//       required: [true, "Tuition fee is required"],
//       trim: true,
//     },
//     image: {
//       type: String,
//       required: false,
//     },
//     description: {
//       type: String,
//       required: false,
//       trim: true,
//     },
//     skillsRequired: {
//       type: String,
//       required: false,
//       trim: true,
//     },
//     perks: {
//       type: String,
//       required: false,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Middleware to auto-increment courseId without changing DB
// DegreeSchema.pre("save", async function (next) {
//   console.log("Pre-save middleware triggered for new document:", this.isNew);
//   if (this.isNew) {
//     try {
//       console.log("Running pre-save middleware to set courseId...");
//       const lastDegree = await (this.constructor as mongoose.Model<IDegree>)
//         .findOne()
//         .sort({ courseId: -1 });
//       this.courseId = lastDegree ? lastDegree.courseId + 1 : 1;
//       console.log("Assigned courseId:", this.courseId);
//     } catch (error) {
//       console.error("Error in pre-save middleware:", error);
//       return next(error as Error);
//     }
//   }
//   next();
// });

// // Log to confirm middleware registration
// console.log("Registering Degree model with pre-save middleware...");

// // Use the default database (MediConnect)
// const Degree = mongoose.model<IDegree>("Degree", DegreeSchema, "Degrees");

// export default Degree;