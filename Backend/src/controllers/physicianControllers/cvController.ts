import express, { Request, Response } from "express";
import CvDoctorUpdate from '../../models/CvUpdate';
const multer = require("multer");
const upload = multer();
import cloudinary from "../../Config/cloudinaryConfig";
import fs from "fs";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
  }

exports.viewDoctorsCv=async(req:MulterRequest ,res:Response)=>{
    const result=await CvDoctorUpdate.find();
    if(result){
        res.send({
            
        "Message":`${result.length} Doctors found`,
        "CvDoctorUpdate":result
    }).status(200);
    }else{
        res.send({
            "Message":"No Doctors found"
        }).status(404);
    }
};

// Fixed backend handler with proper error handling
export const addDoctorCv = async (req: Request, res: Response) => {
    try {
        console.log("Incoming data:", req.body);
        console.log("Incoming file:", req.file);

        let resumePdfUrl = "";

        // Check if file exists and upload to Cloudinary
        if (req.file) {
            try {
                // IMPORTANT: We need to properly handle the file buffer since you're using multer
                // First fix: req.file.path doesn't exist when using multer memory storage
                
                // Check if we have a buffer (from multer.memoryStorage) or a path (from multer.diskStorage)
                if (req.file.buffer) {
                    // If using memory storage, convert buffer to base64 string for Cloudinary
                    const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                    
                    const result = await cloudinary.uploader.upload(base64String, {
                        folder: "resumes",
                        resource_type: "auto",
                        use_filename: true,
                    });
                    resumePdfUrl = result.secure_url;
                } else if (req.file.path) {
                    // If using disk storage
                    const result = await cloudinary.uploader.upload(req.file.path, {
                        folder: "resumes",
                        resource_type: "auto",
                        use_filename: true,
                    });
                    resumePdfUrl = result.secure_url;
                    
                    // Delete temporary file after successful upload
                    fs.unlinkSync(req.file.path);
                } else {
                    throw new Error("File is missing both buffer and path");
                }
                
                console.log("Cloudinary upload successful:", resumePdfUrl);
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error details:", cloudinaryError);
                return res.status(500).json({
                    message: "Failed to upload file to cloud storage",
                    error: cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"
                });
            }
        }

        // Rest of the function remains the same
        
        // Handle certification input
        let certificationInput = [];
        if (req.body.certificationInput) {
            try {
                certificationInput = typeof req.body.certificationInput === 'string' 
                    ? JSON.parse(req.body.certificationInput)
                    : req.body.certificationInput;
                
                if (!Array.isArray(certificationInput)) {
                    certificationInput = [certificationInput];
                }
            } catch (e) {
                certificationInput = [req.body.certificationInput];
            }
        }

        // Construct the complete doctor data
        const doctorData = {
            ...req.body,
            resumePdfUrl,
            certificationInput
        };

        // Validate all required fields
        const requiredFields = [
            'yourName',
            'professionalTitle',
            'currentLocation',
            'careerSummary',
            'contactPhone',
            'contactEmail',
            'medicalDegree',
            'university',
            'specialization',
            'experience',
            'medicalLicenseNumber',
            'medicalLicenseIssuer',
            'jobTitle',
            'hospitalInstitution',
            'employmentPeriod'
        ];

        const missingFields = requiredFields.filter(field => !doctorData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                fields: missingFields
            });
        }

        // Save to database
        const doctor = new CvDoctorUpdate(doctorData);
        const result = await doctor.save();

        res.status(201).json({
            message: "Doctor CV added successfully",
            doctorId: result._id,
            resumePdfUrl,
            data: result
        });

    } catch (error) {
        console.error("Error adding Doctor CV:", error);
        res.status(500).json({
            message: "Failed to add Doctor CV",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.ReplaceCv=async(req:Request,res:Response)=>{
    const id=req.params.id;
    const deta=req.body;

    const result=await CvDoctorUpdate.findOneAndReplace({_id:id},deta,{new:true});
    if(result){
        res.send({
            "Message":"Doctor Cv updated successfully",
            "Doctor ID":result
        }).status(200);
    }
    else{
        res.send({
            "Message":"Doctor Cv not updated"
        }).status(500);
    } 
};

exports.updateCv=async(req:Request,res:Response)=>{
    const id=req.params.id;
    const deta=req.body;

    const result=await CvDoctorUpdate.findByIdAndUpdate(id,deta,{new:true});
    if(result){
        res.send({
            "Message":"Doctor Cv updated successfully",
            "Doctor ID":result
        }).status(200);
    }else{
        res.send({
            "Message":"Doctor Cv not updated"
        }).status(500);
    }
};

exports.deleteCv=async(req:Request,res:Response)=>{
    const id=req.params.id;
    const result=await CvDoctorUpdate.findByIdAndDelete(id);
    if(result){
        res.send({
            "Message":"Doctor Cv deleted successfully",
            "Doctor ID":result
        }).status(200);
    }else{
        res.send({
            "Message":"Doctor Cv not deleted"
        }).status(500);
    }
};