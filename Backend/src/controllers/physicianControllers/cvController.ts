import express, { Request, Response } from "express";
import CvDoctorUpdate from '../../models/CvUpdate';
const multer = require("multer");
const upload = multer();
import cloudinary from "../../Config/cloudinaryConfig";

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
      
      // Ensure certificationInput is always an array
      if (!req.body.certificationInput) {
        req.body.certificationInput = [];
      } else if (typeof req.body.certificationInput === "string") {
        try {
          req.body.certificationInput = JSON.parse(req.body.certificationInput);
          if (!Array.isArray(req.body.certificationInput)) {
            req.body.certificationInput = [req.body.certificationInput];
          }
        } catch (e) {
          // If parsing fails, treat it as a single item in an array
          req.body.certificationInput = [req.body.certificationInput];
        }
      }
      
      // Validate required fields
      const requiredFields = [
        'jobTitle', 
        'hospitalInstitution', 
        'employmentPeriod'
      ];
      
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "Missing required fields",
          fields: missingFields
        });
      }
      
      // Save the data to the database
      const doctor = new CvDoctorUpdate(req.body);
      const result = await doctor.save();
      
      res.status(201).json({
        message: "Doctor CV added successfully",
        doctorId: result._id,
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