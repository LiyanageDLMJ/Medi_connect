import mongoose from 'mongoose';

const URI = "mongodb+srv://liyanagedlmj22:Mokshitha2002@cvupdate.hivx4.mongodb.net/MediConnect?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("MongoDB Connected to MediConnect database");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

export default connectDB;