import mongoose from "mongoose";
import router from "../Routes/BasicRouting";
const Schema=mongoose.Schema;

const CvUpdateSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:String 
    ,
    specialization:{
        type:String,
        required:true
    }
});
const db=mongoose.connection.useDb('User');
const CvDoctorUpdate=db.model('Doctor',CvUpdateSchema,'Doctor');


export default CvDoctorUpdate;