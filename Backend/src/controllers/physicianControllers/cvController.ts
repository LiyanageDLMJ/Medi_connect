import express, { Request, Response } from "express";
import CvDoctorUpdate from '../../models/CvUpdate';

exports.viewDoctorsCv=async(req:Request ,res:Response)=>{
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

exports.addDoctorCv=async(req:Request,res:Response)=>{
    const data=req.body;
    
    if (!data.yourName || !data.contactEmail || !data.currentLocation || !data.professionalTitle || !data.contactPhone || !data.careerSummary) {
        return res.status(400).send({
            message: "Validation Error: Please provide all required fields (yourName, contactEmail, currentLocation, professionalTitle).",
        });
    }


    const doctor=new CvDoctorUpdate(data);
    const result=await doctor.save();
    


    if(result){
        res.send({
            "Message":"Doctor Cv added successfully",
            "Doctor ID":result._id
        }).status(201);
    }else{
        res.send({
            "Message":"Doctor Cv not added"
        }).status(500);
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