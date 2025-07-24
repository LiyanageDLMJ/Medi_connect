import { Schema, model } from "mongoose";

const TemplateSchema = new Schema({
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  fields: { 
    type: Map, 
    of: String // Defines field types (text, array, date)
  },
  category: { type: String, enum: ['medical', 'academic'], default: 'medical' }
});

export default model("CvTemplate", TemplateSchema);