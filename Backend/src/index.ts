import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./Routes/PhysicianRoutes/BasicRoutes";
import CvDocRouter from "./Routes/PhysicianRoutes/CvDoctorRoutes";
import RecuiterJobPost from "./Routes/RecuiterRoutes/JobPostRoutes";
import connectDB from "./Config/db";
import JobSearch from "./Routes/PhysicianRoutes/JobSearchRoutes";
import jobApplicationRoutes from "./Routes/PhysicianRoutes/jobApplicationRoutes";

// import UpdateUser from "./Routes/AdminRoutes/UpdateUser";
import adminRoute from './Routes/AdminRoutes/adminRoute'; 
import { changePasswordByEmail } from './controllers/adminControllers/adminCondtroller';

import fs from "fs";
import path from "path";

connectDB();

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());




// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}




// Existing Routes (unchanged)
app.use("/api", router);
app.use("/CvdoctorUpdate", CvDocRouter);
app.use("/JobPost", RecuiterJobPost);
app.use("/JobSearch", JobSearch);
app.use("/JobApplication", jobApplicationRoutes);

// Start the server


//Admin Routes
// app.use("/api/hello", UpdateUser); 

app.use('/api/admin', adminRoute);

// Direct change password route (accessible at /api/change-password)
app.put('/api/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    
    // Import AdminModel here to avoid circular imports
    const AdminModel = (await import('./models/AdminModels/adminReg')).default;
    const admin = await AdminModel.findOne({ email });
    
    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const bcrypt = (await import('bcrypt')).default;
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});