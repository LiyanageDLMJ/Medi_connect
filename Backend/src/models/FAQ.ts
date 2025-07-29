import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Use the EducationalInstitution database like feedback model
let FAQ: mongoose.Model<any> | null = null;

const getFAQModel = (): mongoose.Model<any> => {
  if (!FAQ) {
    try {
      // Use the EducationalInstitution database
      const db = mongoose.connection.useDb('EducationalInstitution');
      FAQ = db.model('FAQ', faqSchema, 'faqs');
      console.log('FAQ model initialized with EducationalInstitution database');
    } catch (error) {
      console.error('Error initializing FAQ model:', error);
      // Fallback to default database if EducationalInstitution is not available
      FAQ = mongoose.model('FAQ', faqSchema);
    }
  }
  return FAQ;
};

export default getFAQModel; 