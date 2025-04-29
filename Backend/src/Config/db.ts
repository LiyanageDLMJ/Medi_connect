
const mongoose = require('mongoose');

const URI = "mongodb+srv://liyanagedlmj22:Mokshitha2002@cvupdate.hivx4.mongodb.net/MediConnect?retryWrites=true&w=majority&appName=CvUpdate";

const connectDB=async()=>{
    try{
        await mongoose.connect(URI);
        console.log("MongoDB Connected");
    }catch (err){
        console.error("MongoDB Connection Error:", err);
    }
};
export default connectDB;