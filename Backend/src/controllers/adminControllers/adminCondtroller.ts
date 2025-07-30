// ------------------------------
// controllers/adminDashboardController.ts
// ------------------------------
import { Request, Response } from "express";
import Job from "../../models/AdminModels/JobListing";
import User from "../../models/AdminModels/AdminDoctorModel";
import MedicalStudent from "../../models/AdminModels/AdminStudentModel";
import Institute from "../../models/AdminModels/AdminInstitute";
import AdminModel from "../../models/AdminModels/adminReg";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

import CvDataModel from '../../models/CvDataModel';
import Recruiter from '../../models/RecruiterModel';
import mongoose from "mongoose";
import JobApplication from "../../models/JobApplication";
import JobListing from '../../models/AdminModels/JobListing';

const createToken = (email: string) => {
  return jwt.sign({ email }, "7fae9f4f1e3c4b14a8d76a0b1391b7df7cd09", {
    expiresIn: "3d",
  });
};


export const getAllJobs = async (req: Request, res: Response) => {
  const jobs = await Job.find();
  res.status(200).json(jobs);
};

// Delete job (soft delete by updating fields)
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        status: "REMOVED",
        title: "Removed Job",
        department: "Removed Job",
        jobType: "Removed Job",
        hospitalName: "Removed Job",
        location: "Removed Job",
        description: "This job listing has been removed by the administrator.",
        requirements: "This job listing has been removed by the administrator.",
        salaryRange: "Removed Job",
        urgent: false,
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job removed successfully",
      job: updatedJob
    });
  } catch (error: any) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      message: "Failed to remove job",
      error: error.message
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {

  const users = await User.find();
  res.status(200).json(users);
};

export const getDoctors = async (req: Request, res: Response) => {
  const doctors = await User.find({ userType: "Doctor" });
  res.status(200).json(doctors);
};

export const getMedicalStudents = async (req: Request, res: Response) => {
  const students = await MedicalStudent.find({ userType: "MedicalStudent", status: { $ne: "REMOVED" } });
  res.status(200).json(students);
};

export const getInstitutes = async (req: Request, res: Response) => {
  const institutes = await Institute.find({ userType: "EducationalInstitute", status: { $ne: "REMOVED" } });
  res.status(200).json(institutes);
};

// start signup admin


export const getRecruiterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recruiter = await Recruiter.findById(id);
    res.status(200).json(recruiter);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })

  };
}


export const getApplicantCount = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const applicants = await JobApplication.countDocuments({
      jobId: new mongoose.Types.ObjectId(id)
    });
    res.status(200).json({ applicants });
  } catch (error) {
    res.status(500).json({ message: error })
  }
};

export const getJobApplications = async (req: Request, res: Response) => {
  const { id } = req.params;


  const applications = await JobApplication.find({ jobId: id });
  const userIds = applications.map(app => app.userId);  
  const users = await User.find({ _id: { $in: userIds } });

  res.status(200).json(users);
};



export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  res.status(200).json(job);
};





export const handleSignUptPost = async (req: Request, res: Response) => {
  let {
    firstName,
    lastName,
    email,
    password,
    conpassword,
    mobileNumber,
    country,
    city,
    streetAddress,
  } = req.body;

  // Comprehensive validation
  const errors: string[] = [];

  // Required fields validation
  if (!firstName?.trim()) errors.push("First name is required");
  if (!lastName?.trim()) errors.push("Last name is required");
  if (!email?.trim()) errors.push("Email is required");
  if (!password) errors.push("Password is required");
  if (!conpassword) errors.push("Confirm password is required");
  if (!mobileNumber?.trim()) errors.push("Mobile number is required");
  if (!country?.trim()) errors.push("Country is required");
  if (!city?.trim()) errors.push("City is required");
  if (!streetAddress?.trim()) errors.push("Street address is required");

  // Name validation
  if (firstName?.trim() && firstName.length < 2) {
    errors.push("First name must be at least 2 characters long");
  }
  if (firstName?.trim() && firstName.length > 50) {
    errors.push("First name cannot exceed 50 characters");
  }
  if (firstName?.trim() && !/^[a-zA-Z\s]+$/.test(firstName)) {
    errors.push("First name can only contain letters and spaces");
  }

  if (lastName?.trim() && lastName.length < 2) {
    errors.push("Last name must be at least 2 characters long");
  }
  if (lastName?.trim() && lastName.length > 50) {
    errors.push("Last name cannot exceed 50 characters");
  }
  if (lastName?.trim() && !/^[a-zA-Z\s]+$/.test(lastName)) {
    errors.push("Last name can only contain letters and spaces");
  }

  // Email validation
  if (email?.trim()) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push("Please enter a valid email address");
    }
  }

  // Password validation
  if (password) {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      errors.push("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    }
  }

  // Password confirmation validation
  if (password && conpassword && password !== conpassword) {
    errors.push("Passwords do not match");
  }

  // Mobile number validation
  if (mobileNumber?.trim()) {
    const mobileRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (!mobileRegex.test(mobileNumber)) {
      errors.push("Please enter a valid mobile number");
    }
  }

  // Address validation
  if (country?.trim() && country.length < 2) {
    errors.push("Country must be at least 2 characters long");
  }
  if (country?.trim() && country.length > 50) {
    errors.push("Country cannot exceed 50 characters");
  }

  if (city?.trim() && city.length < 2) {
    errors.push("City must be at least 2 characters long");
  }
  if (city?.trim() && city.length > 50) {
    errors.push("City cannot exceed 50 characters");
  }

  if (streetAddress?.trim() && streetAddress.length < 5) {
    errors.push("Street address must be at least 5 characters long");
  }
  if (streetAddress?.trim() && streetAddress.length > 200) {
    errors.push("Street address cannot exceed 200 characters");
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors
    });
  }

  try {
    // Check for existing admin with same email
    const existingAdminByEmail = await AdminModel.findOne({ email: email.toLowerCase() });
    if (existingAdminByEmail) {
      return res.status(409).json({ message: "Admin with this email already exists." });
    }

    // Check for existing admin with same mobile number
    const existingAdminByMobile = await AdminModel.findOne({ mobileNumber });
    if (existingAdminByMobile) {
      return res.status(409).json({ message: "Admin with this mobile number already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const admin = new AdminModel({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      mobileNumber: mobileNumber.trim(),
      country: country.trim(),
      city: city.trim(),
      streetAddress: streetAddress.trim(),
    });

    await admin.save();

    const token = createToken(email);

    return res.status(201).json({
      message: "Admin registered successfully.",
      data: {
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        token,
      },
    });
  } catch (error: any) {
    console.error("Error during admin signup:", error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        message: `Admin with this ${field} already exists.`
      });
    }

    res.status(500).json({ message: "Internal server error." });
  }
};

// end sigin Up admin

//Start signin admin

export const handleSignIptPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = createToken(admin.email);

    return res.status(200).json({
      message: "Login successful.",
      data: {
        email: admin.email,
        fname: admin.firstName,
        lname: admin.lastName,
        token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed due to server error." });
  }
};


//signin admin end

export const getJobStats = async (req: Request, res: Response) => {
  const [
    totalJobs,
    fullTimeCount,
    partTimeCount,
    internCount,
    CardiologistCount,
    PediatricianCount,
    GeneralPhysicianCount,
    PulmonologistCount,
    OrthopedicsCount,
  ] = await Promise.all([
    Job.countDocuments(),
    Job.countDocuments({ jobType: "Full-Time" }),
    Job.countDocuments({ jobType: "Part-Time" }),
    Job.countDocuments({ jobType: "Internship" }),
    Job.countDocuments({ title: "Cardiologist" }),
    Job.countDocuments({ title: "Pediatrician" }),
    Job.countDocuments({ title: "General Physician" }),
    Job.countDocuments({ title: "Neurosurgeon" }),
    Job.countDocuments({ title: "Orthopedics" }),
  ]);

  res.status(200).json({
    totalJobs,
    fullTimeCount,
    partTimeCount,
    internCount,
    CardiologistCount,
    PediatricianCount,
    GeneralPhysicianCount,
    PulmonologistCount,
    OrthopedicsCount,
  });
};

export const getUserStats = async (req: Request, res: Response) => {
  const [
    total,
    doctorCount,
    studentCount,
    instituteCount,
    recruiterCount,
    CardiologistCount,
    PediatricianCount,
    GeneralPhysicianCount,
    PulmonologistCount,
    EndocrinologistCount,
    BiomedicineCount,
    DentistryCount,
    ClinicalChemistryCount,
    GeneralMedicineCount,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ userType: "Doctor" }),
    User.countDocuments({ userType: "MedicalStudent" }),
    User.countDocuments({ userType: "EducationalInstitute" }),
    User.countDocuments({ userType: "Recruiter" }),
    User.countDocuments({ specialty: "Cardiologist" }),
    User.countDocuments({ specialty: "Pediatrician" }),
    User.countDocuments({ specialty: "GeneralPhysician" }),
    User.countDocuments({ specialty: "Pulmonologist" }),
    User.countDocuments({ specialty: "Endocrinologist" }),
    User.countDocuments({ fieldOfStudy: "Biomedicine" }),
    User.countDocuments({ fieldOfStudy: "Dentistry" }),
    User.countDocuments({ fieldOfStudy: "Clinical Chemistry" }),
    User.countDocuments({ fieldOfStudy: "General Medicine" }),
  ]);

  res.status(200).json({
    total,
    doctorCount,
    studentCount,
    instituteCount,
    recruiterCount,
    CardiologistCount,
    PediatricianCount,
    GeneralPhysicianCount,
    PulmonologistCount,
    EndocrinologistCount,
    BiomedicineCount,
    DentistryCount,
    ClinicalChemistryCount,
    GeneralMedicineCount,
  });
};

// Get all admins with optional search
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = {};
    if (search && typeof search === 'string') {
      // Search by firstName, lastName, or email (case-insensitive)
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const admins = await AdminModel.find(query).select('-password'); // Exclude password
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Failed to fetch admins.' });
  }
};

// Get admin by email
export const getAdminByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const admin = await AdminModel.findOne({ email }).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin by email:', error);
    res.status(500).json({ message: 'Failed to fetch admin.' });
  }
};

// Update admin by email
export const updateAdminByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    // Prevent updating email or password directly
    delete updateData.email;
    delete updateData.password;

    // Comprehensive validation for profile updates
    const errors: string[] = [];

    // Name validation
    if (updateData.firstName) {
      if (!updateData.firstName.trim()) {
        errors.push("First name is required");
      } else if (updateData.firstName.length < 2) {
        errors.push("First name must be at least 2 characters long");
      } else if (updateData.firstName.length > 50) {
        errors.push("First name cannot exceed 50 characters");
      } else if (!/^[a-zA-Z\s]+$/.test(updateData.firstName)) {
        errors.push("First name can only contain letters and spaces");
      }
    }

    if (updateData.lastName) {
      if (!updateData.lastName.trim()) {
        errors.push("Last name is required");
      } else if (updateData.lastName.length < 2) {
        errors.push("Last name must be at least 2 characters long");
      } else if (updateData.lastName.length > 50) {
        errors.push("Last name cannot exceed 50 characters");
      } else if (!/^[a-zA-Z\s]+$/.test(updateData.lastName)) {
        errors.push("Last name can only contain letters and spaces");
      }
    }

    // Mobile number validation
    if (updateData.mobileNumber) {
      if (!updateData.mobileNumber.trim()) {
        errors.push("Mobile number is required");
      } else {
        const mobileRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
        if (!mobileRegex.test(updateData.mobileNumber)) {
          errors.push("Please enter a valid mobile number");
        }
      }
    }

    // Address validation
    if (updateData.country) {
      if (!updateData.country.trim()) {
        errors.push("Country is required");
      } else if (updateData.country.length < 2) {
        errors.push("Country must be at least 2 characters long");
      } else if (updateData.country.length > 50) {
        errors.push("Country cannot exceed 50 characters");
      }
    }

    if (updateData.city) {
      if (!updateData.city.trim()) {
        errors.push("City is required");
      } else if (updateData.city.length < 2) {
        errors.push("City must be at least 2 characters long");
      } else if (updateData.city.length > 50) {
        errors.push("City cannot exceed 50 characters");
      }
    }

    if (updateData.streetAddress) {
      if (!updateData.streetAddress.trim()) {
        errors.push("Street address is required");
      } else if (updateData.streetAddress.length < 5) {
        errors.push("Street address must be at least 5 characters long");
      } else if (updateData.streetAddress.length > 200) {
        errors.push("Street address cannot exceed 200 characters");
      }
    }

    // Status validation
    if (updateData.status) {
      const validStatuses = ['Active', 'Inactive', 'REMOVED'];
      if (!validStatuses.includes(updateData.status)) {
        errors.push("Status must be one of: Active, Inactive, REMOVED");
      }
    }

    // Return validation errors if any
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors
      });
    }

    // Check for duplicate mobile number if mobile number is being updated
    if (updateData.mobileNumber) {
      const existingAdminByMobile = await AdminModel.findOne({
        mobileNumber: updateData.mobileNumber,
        email: { $ne: email } // Exclude current admin
      });
      if (existingAdminByMobile) {
        return res.status(409).json({ message: "Admin with this mobile number already exists." });
      }
    }

    // Sanitize input data
    Object.keys(updateData).forEach(key => {
      if (typeof updateData[key] === 'string') {
        updateData[key] = updateData[key].trim();
      }
    });

    const updatedAdmin = await AdminModel.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedAdmin
    });
  } catch (error: any) {
    console.error('Error updating admin:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        message: `Admin with this ${field} already exists.`
      });
    }

    res.status(500).json({ message: 'Failed to update admin.' });
  }
};

export const changeAdminPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    admin.password = hash;
    await admin.save();
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Failed to change password.' });
  }
};

export const changePasswordByEmail = async (req: Request, res: Response) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Failed to change password.' });
  }
};

// Get all CVs
export const getAllCvDatas = async (req: Request, res: Response) => {
  try {
    const cvs = await CvDataModel.find();
    res.json(cvs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch CVs.' });
  }
};

// Get single CV by ID
export const getCvDataById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cv = await CvDataModel.findById(id);
    if (!cv) return res.status(404).json({ message: 'CV not found' });
    res.json(cv);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch CV.' });
  }
};



export const getCvDataByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const cv = await CvDataModel.findOne({ contactEmail: email });
    if (!cv) return res.status(404).json({ message: 'CV not found' });
    res.json(cv);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch CV' });
  }
};

export const getStudentCvDataByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const cv = await CvDataModel.findOne({ contactEmail: email });
    if (!cv) return res.status(404).json({ message: 'CV not found' });
    res.json(cv);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch CV' });
  }
};



export const getAllRecruiters = async (req: Request, res: Response) => {
  try {
    const recruiters = await Recruiter.find({
      userType: "Recruiter",
      status: { $ne: "REMOVED" } // $ne = not equal
    });
    res.status(200).json(recruiters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recruiters', error });
  }
};

export const deleteRecruiter = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateFields = {
      status: "REMOVED",
      email: "removed@recruiter.com",
      photoUrl: "",
      school: "",
      location: "",
      bio: "This recruiter profile has been removed by the administrator.",
      higherEducation: "Removed",
      companyName: "Removed Recruiter",
      companyType: "removed",
      position: "removed",
      contactNumber: "removed",
      deletedAt: new Date(),
    };


    const updatedRecruiter = await Recruiter.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedRecruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }




    res.status(200).json({ message: id });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to remove recruiter", error: error.message });
  }
};

// Soft delete (remove) an institute by updating its fields
export const removeInstitute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const removedFields = {
      name: "Removed Institute",
      email: "",
      status: "REMOVED",
      photoUrl: "",
      bio: "This institute profile has been removed by the administrator.",
      higherEducation: "Removed",
      instituteName: "Removed Institute",
      instituteType: "removed",
      accreditation: "Removed",
      establishedYear: null,
      deletedAt: new Date(),
      contactPhone: '',
      location: '',
      description: 'This institute profile has been removed by the administrator.'
    };
    const updatedInstitute = await Institute.findByIdAndUpdate(
      id,
      removedFields,
      { new: true }
    );
    if (!updatedInstitute) {
      return res.status(404).json({ message: "Institute not found" });
    }
    res.status(200).json({
      message: "Institute removed successfully",
      institute: updatedInstitute
    });
  } catch (error: any) {
    console.error("Error removing institute:", error);
    res.status(500).json({
      message: "Failed to remove institute",
      error: error.message
    });
  }
};

// New reporting endpoints
export const getDetailedUserStats = async (req: Request, res: Response) => {
  try {
    const [doctors, students, institutes, recruiters] = await Promise.all([
      User.find({ userType: "Doctor" }),
      MedicalStudent.find({ userType: "MedicalStudent" }),
      Institute.find({ userType: "EducationalInstitute" }),
      Recruiter.find({ userType: "Recruiter" })
    ]);

    // Calculate registration trends by month
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);

    const monthlyStats = {
      doctors: Array(6).fill(0),
      students: Array(6).fill(0),
      institutes: Array(6).fill(0),
      recruiters: Array(6).fill(0)
    };

    // Process doctors
    doctors.forEach(doctor => {
      const createdDate = new Date(doctor.createdAt);
      if (createdDate >= sixMonthsAgo) {
        const monthIndex = currentDate.getMonth() - createdDate.getMonth();
        if (monthIndex >= 0 && monthIndex < 6) {
          monthlyStats.doctors[monthIndex]++;
        }
      }
    });

    // Process students
    students.forEach(student => {
      const createdDate = new Date(student.createdAt);
      if (createdDate >= sixMonthsAgo) {
        const monthIndex = currentDate.getMonth() - createdDate.getMonth();
        if (monthIndex >= 0 && monthIndex < 6) {
          monthlyStats.students[monthIndex]++;
        }
      }
    });

    // Process institutes
    institutes.forEach(institute => {
      const createdDate = new Date(institute.createdAt);
      if (createdDate >= sixMonthsAgo) {
        const monthIndex = currentDate.getMonth() - createdDate.getMonth();
        if (monthIndex >= 0 && monthIndex < 6) {
          monthlyStats.institutes[monthIndex]++;
        }
      }
    });

    // Process recruiters
    recruiters.forEach(recruiter => {
      const createdDate = new Date(recruiter.createdAt);
      if (createdDate >= sixMonthsAgo) {
        const monthIndex = currentDate.getMonth() - createdDate.getMonth();
        if (monthIndex >= 0 && monthIndex < 6) {
          monthlyStats.recruiters[monthIndex]++;
        }
      }
    });

    res.status(200).json({
      monthlyStats,
      totalUsers: {
        doctors: doctors.length,
        students: students.length,
        institutes: institutes.length,
        recruiters: recruiters.length
      },
      activeUsers: {
        doctors: doctors.filter(d => new Date(d.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
        students: students.filter(s => new Date(s.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
        institutes: institutes.filter(i => new Date(i.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
        recruiters: recruiters.filter(r => new Date(r.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      }
    });
  } catch (error) {
    console.error('Error getting detailed user stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};







export const getDetailedJobStats = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find();

    // Calculate job trends by month
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);

    const monthlyJobStats = {
      total: Array(6).fill(0),
      fullTime: Array(6).fill(0),
      partTime: Array(6).fill(0),
      internship: Array(6).fill(0)
    };

    // Process jobs by creation date
    jobs.forEach(job => {
      const createdDate = new Date(job.postedDate);
      if (createdDate >= sixMonthsAgo) {
        const monthIndex = currentDate.getMonth() - createdDate.getMonth();
        if (monthIndex >= 0 && monthIndex < 6) {
          monthlyJobStats.total[monthIndex]++;
        
          if (job.jobType === 'Full-Time') {
            monthlyJobStats.fullTime[monthIndex]++;
          } else if (job.jobType === 'Part-Time') {
            monthlyJobStats.partTime[monthIndex]++;
          } else if (job.jobType === 'Internship') {
            monthlyJobStats.internship[monthIndex]++;
          }
        }
      }
    });

    // Calculate department distribution
    const departmentStats = {};
    jobs.forEach(job => {
      const dept = job.department || 'Other';
      departmentStats[dept] = (departmentStats[dept] || 0) + 1;
    });

    // Calculate location distribution
    const locationStats = {};
    jobs.forEach(job => {
      const location = job.location || 'Unknown';
      locationStats[location] = (locationStats[location] || 0) + 1;
    });

    // Calculate urgent vs non-urgent jobs
    const urgentJobs = jobs.filter(job => job.urgent).length;
    const nonUrgentJobs = jobs.length - urgentJobs;

    res.status(200).json({
      monthlyJobStats,
      departmentStats,
      locationStats,
      urgentStats: {
        urgent: urgentJobs,
        nonUrgent: nonUrgentJobs
      },
      totalJobs: jobs.length,
      averageSalary: jobs.reduce((sum, job) => {
        const salary = job.salaryRange ? parseFloat(job.salaryRange.replace(/[^0-9]/g, '')) : 0;
        return sum + salary;
      }, 0) / jobs.length || 0
    });
  } catch (error) {
    console.error('Error getting detailed job stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getApplicationStats = async (req: Request, res: Response) => {
  try {
    // This would need to be implemented based on your application model
    // For now, returning placeholder data
    res.status(200).json({
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      applicationTrends: Array(6).fill(0)
    });
  } catch (error) {
    console.error('Error getting application stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSystemHealthStats = async (req: Request, res: Response) => {
  try {
    const currentTime = new Date();
    const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [recentUsers, recentJobs, totalUsers, totalJobs] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: oneDayAgo } }),
      Job.countDocuments({ createdAt: { $gte: oneDayAgo } }),
      User.countDocuments(),
      Job.countDocuments()
    ]);

    res.status(200).json({
      dailyStats: {
        newUsers: recentUsers,
        newJobs: recentJobs
      },
      weeklyStats: {
        newUsers: await User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
        newJobs: await Job.countDocuments({ createdAt: { $gte: oneWeekAgo } })
      },
      totalStats: {
        users: totalUsers,
        jobs: totalJobs
      },
      systemStatus: 'healthy',
      lastUpdated: currentTime.toISOString()
    });
  } catch (error) {
    console.error('Error getting system health stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};











// PATCH: Soft-delete (anonymize) a MedicalStudent by ID
export const softDeleteMedicalStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = {
      name: "Removed Medical Student",
      userType: "",
      age: null,
      email: "Not Found",
      photoUrl: "",
      school: "",
      location: "",
      bio: "This medical student profile has been removed by the administrator.",
      higherEducation: "Removed",
      currentInstitute: "Removed",
      yearOfStudy: null,
      fieldOfStudy: "Removed",
      status: "REMOVED",
      deletedAt: new Date(),
    };
    const updatedStudent = await MedicalStudent.findByIdAndUpdate(id, update, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: "Medical student not found" });
    }
    res.status(200).json({ message: "Medical student removed successfully", student: updatedStudent });
  } catch (error: any) {
    console.error("Error removing medical student:", error);
    res.status(500).json({ message: "Failed to remove medical student", error: error.message });
  }
};

// PATCH: Soft-delete (anonymize) a Doctor by ID
export const softDeleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = {
      profession: "Removed",
      name: "Removed Doctor",
      age: null,
      email: "removed" + Math.random().toString(36).substring(2, 15),
      userType: "",
      photoUrl: "",
      school: "",
      location: "",
      bio: "This doctor profile has been removed by the administrator.",
      specialty: "Removed",
      higherEducation: "Removed",
      status: "REMOVED",
      deletedAt: new Date(),
    };
    const updatedDoctor = await User.findByIdAndUpdate(id, update, { new: true });

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor removed successfully" });
  } catch (error: any) {
    console.error("Error removing doctor:", error);
    res.status(500).json({ message: "Failed to remove doctor", error: error.message });
  }
};

export const getRecruiterJobCount = async (req: Request, res: Response) => {
  try {
    const { recruiterId } = req.params;
    const count = await JobListing.countDocuments({ recruiterId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job count' });
  }
};

// PATCH: Soft-delete (anonymize) an Admin by ID
export const softDeleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = {
      firstName: "Removed",
      lastName: "User",
      email: `removed_admin_${Date.now()}@mdconnect.com`, // prevent duplicate emails
      password: "",
      country: "Removed",
      city: "Removed",
      streetAddress: "Removed",
      status: "REMOVED",
      deletedAt: new Date(),
    };
    
    const updatedAdmin = await AdminModel.findByIdAndUpdate(id, update, { new: true });
    
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    res.status(200).json({ 
      message: "Admin removed successfully", 
      admin: updatedAdmin 
    });
  } catch (error: any) {
    console.error("Error removing admin:", error);
    res.status(500).json({ 
      message: "Failed to remove admin", 
      error: error.message 
    });
  }
};

