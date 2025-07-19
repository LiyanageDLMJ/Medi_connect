// Config/db.js
const mongoose = require('mongoose');

// Specify the database name in the connection string
const URI = "mongodb+srv://liyanagedlmj22:Mokshitha2002@cvupdate.hivx4.mongodb.net/MediConnect?retryWrites=true&w=majority&appName=CvUpdate";
const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("MongoDB Connected to MediConnect database");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
    }
};

export default connectDB;