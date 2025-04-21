import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./Routes/PhysicianRoutes/BasicRoutes";
import CvDocRouter from "./Routes/PhysicianRoutes/CvDoctorRoutes";
import RecuiterJobPost from "./Routes/RecuiterRoutes/JobPostRoutes";
import connectDB from "./Config/db";
import JobSearch from "./Routes/PhysicianRoutes/JobSearchRoutes";
connectDB();


const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 
app.use("/api", router);
app.use("/CvdoctorUpdate", CvDocRouter);
app.use("/JobPost", RecuiterJobPost);
app.use("/JobSearch", JobSearch);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
