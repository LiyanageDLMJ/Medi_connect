import mongoose from "mongoose";
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
    qualification:{
        type:String,
        required:true
    },
    skills:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    projects:{
        type:String,
        required:true
    }
});