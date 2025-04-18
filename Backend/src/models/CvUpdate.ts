import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CvUpdateSchema = new Schema({
    yourName: { 
        type: String,
        required: true,
    },
    currentLocation: { 
        type: String,
        required: true,
    },
    contactEmail: { 
        type: String,
        required: true,
    },
    contactPhone: { 
        type: String,
        required: true,
    },
    linkedinLink: { 
        type: String,
    },
    careerSummary: { 
        type: String,
        required: true,
    },
    professionalTitle: { 
        type: String,
        required: true,
    },
});

const db = mongoose.connection.useDb("User");
const CvDoctorUpdate = db.model("Doctor", CvUpdateSchema, "Doctor");

export default CvDoctorUpdate;