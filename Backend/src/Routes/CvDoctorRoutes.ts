import express from 'express';
import CvDoctorUpdate from '../models/CvUpdate';
const router = express.Router();

router.get("/viewDoctorsCv",async(req,res)=>{
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
});

router.post("/addDoctorCv",async(req,res)=>{
    const data=req.body;
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
});

router.put("/ReplaceCv/:id",async(req,res)=>{
    const id=req.params.id;
    const deta=req.body;

    const result=await CvDoctorUpdate.findOneAndReplace({_id:id},deta,{new:true});
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
});

export default router;