import { Schema, model } from "mongoose";

// MedicalCv schema mirrors StudentCv but stored in a separate collection
const MedicalCvSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  templateId: { type: Schema.Types.ObjectId, ref: "CvTemplate", required: true },
  data: { type: Schema.Types.Mixed, required: true }, // CV content (JSON)
  pdfUrl: { type: String, required: true }
}, { timestamps: true });

export default model("MedicalCv", MedicalCvSchema);