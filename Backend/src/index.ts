import express from "express";
import mongoose from "mongoose";
import router from "./Routes/BasicRouting";
import CvDocRouter from "./Routes/CvDoctorRoutes";
import connectDB from "./Config/db";
connectDB();

const app = express();
const PORT = 3000;


app.use(express.json()); // ✅ Fix: added parentheses
app.use("/api", router);
app.use("/CvdoctorUpdate", CvDocRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
