import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Separate Cloudinary configuration for degree CVs
const degreeCloudName = process.env.DEGREE_CLOUDINARY_CLOUD_NAME || "dbebsni9x";
const degreeApiKey = process.env.DEGREE_CLOUDINARY_API_KEY || "451912599128183";
const degreeApiSecret = process.env.DEGREE_CLOUDINARY_API_SECRET || "DTn6tM6KkPzgmUtid7kpCJ0dfSk";

// Log the configuration (for debugging only - remove in production)
console.log("Degree Cloudinary Configuration:", {
  cloud_name: degreeCloudName,
  api_key: degreeApiKey ? "[PRESENT]" : "[MISSING]",
  api_secret: degreeApiSecret ? "[PRESENT]" : "[MISSING]",
});

// Configure cloudinary with the degree-specific values
cloudinary.config({
  cloud_name: degreeCloudName,
  api_key: degreeApiKey,
  api_secret: degreeApiSecret,
});

export default cloudinary; 