import { Schema, model } from "mongoose";

const StudentCvSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  templateId: { type: Schema.Types.ObjectId, ref: "CvTemplate", required: true },
  data: { type: Schema.Types.Mixed, required: true }, // CV content
  pdfUrl: { type: String, required: true }
}, { timestamps: true });

export default model("StudentCv", StudentCvSchema);