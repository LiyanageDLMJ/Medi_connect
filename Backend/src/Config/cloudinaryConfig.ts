import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// 1. Check if environment variables are properly loaded
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// 2. Log the configuration (for debugging only - remove in production)
console.log("Cloudinary Configuration:", {
  cloud_name: cloudName || "[USING FALLBACK]",
  api_key: apiKey ? "[PRESENT]" : "[MISSING]",
  api_secret: apiSecret ? "[PRESENT]" : "[MISSING]",
});

// 3. Configure cloudinary with the values
cloudinary.config({
  cloud_name: cloudName || "db9rhbyij",
  api_key: apiKey || "884286557911137",
  api_secret: apiSecret || "ohshmCYeCPvFNXCMWaHboDHB7vI",
});

export default cloudinary;