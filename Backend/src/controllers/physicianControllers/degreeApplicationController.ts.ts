import { Request, Response } from "express";
import validator from "validator";
import Degree from "../../models/Degree";
import DegreeApplication from "../../models/DegreeApplication";
import cloudinary from "../../Config/cloudinaryConfig";
import fs from "fs";

interface ApplicationRequestBody {
  name: string;
  email: string;
  phone?: string;
  currentEducation?: string;
  linkedIn?: string;
  portfolio?: string;
  additionalInfo?: string;
  degreeId: number;
  degreeName: string;
  institution: string;
}

export const submitApplication = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone = "",
      currentEducation = "",
      linkedIn = "",
      portfolio = "",
      additionalInfo = "",
      degreeId,
      degreeName,
      institution,
    } = req.body as ApplicationRequestBody;

    // Validate required fields
    const requiredFields = ["name", "email", "degreeId", "degreeName", "institution"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate degreeId is a non-empty string
    if (!degreeId || typeof degreeId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Degree ID must be a valid string",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Create application record
    let cvUrl = "";
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "degree-cvs",
          resource_type: "raw",
          use_filename: true,
        });
        cvUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload CV to cloud storage",
        });
      }
    }

    const applicationData = {
      name,
      email,
      phone,
      currentEducation,
      linkedIn,
      portfolio,
      additionalInfo,
      degreeId,
      degreeName,
      institution,
      cv: cvUrl,
      submissionDate: new Date(),
    };

    const savedApplication = await DegreeApplication.create(applicationData);

    // Update degree statistics
    await Degree.findOneAndUpdate(
      { _id: degreeId },
      {
        $inc: { applicantsApplied: 1 },
        $set: { updatedAt: new Date() },
      }
    );

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationId: savedApplication._id,
        submissionDate: savedApplication.submissionDate,
        degreeName: savedApplication.degreeName,
        institution: savedApplication.institution,
      },
    });
  } catch (error: unknown) {
    console.error("Error submitting application:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your application",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};