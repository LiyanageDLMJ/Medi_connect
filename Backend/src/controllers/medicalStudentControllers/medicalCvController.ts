import { Request, Response } from "express";
import MedicalStudentCv from "../../models/MedicalStudentCv";

/**
 * Create a new Medical Student CV
 * Expects body: { userId, templateId, data, pdfUrl }
 */
export const createMedicalCv = async (req: Request, res: Response) => {
  try {
    const { userId, data } = req.body;

    if (!userId || !data) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!data.resumeRawUrl) {
      return res.status(400).json({ message: "resumeRawUrl is required" });
    }

    const cv = await MedicalStudentCv.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true }
    );
    return res.status(201).json({ success: true, cv });
  } catch (error) {
    console.error("Error creating Medical CV", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get CV by userId (one per student)
 */
export const getMedicalCvByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cv = await MedicalStudentCv.findOne({ userId });
    if (!cv) return res.status(404).json({ message: "CV not found" });
    return res.json(cv);
  } catch (error) {
    console.error("Error fetching Medical CV", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update CV by id
 */
export const updateMedicalCv = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await MedicalStudentCv.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "CV not found" });
    return res.json({ success: true, cv: updated });
  } catch (error) {
    console.error("Error updating Medical CV", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete CV by id
 */
export const deleteMedicalCv = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await MedicalStudentCv.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "CV not found" });
    return res.json({ success: true, message: "CV deleted" });
  } catch (error) {
    console.error("Error deleting Medical CV", error);
    return res.status(500).json({ message: "Server error" });
  }
};
