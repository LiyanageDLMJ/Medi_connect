import { Request, Response, NextFunction } from "express";
import CvDoctorUpdate from "../../models/CvUpdate";
import { Types } from "mongoose";

/*
 * Candidate Controller
 * Handles all CRUD and comparison operations for doctor CV data
 */

// GET /candidates  – list with optional query filters & pagination
import { RequestHandler } from "express";

export const getAllCandidates: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      specialty,
      graduationYear,
      name,
      currentLocation,
      experience,
      page = 1,
      limit = 10,
    } = req.query as Record<string, any>;

    const filter: Record<string, any> = {};

    if (specialty && specialty !== "All Specialties") {
      filter.specialization = { $regex: specialty, $options: "i" };
    }
    if (graduationYear && graduationYear !== "All Years") {
      filter.graduationDate = graduationYear;
    }
    if (name) filter.yourName = { $regex: name, $options: "i" };
    if (currentLocation) filter.currentLocation = { $regex: currentLocation, $options: "i" };
    if (experience) filter.experience = { $regex: experience, $options: "i" };

    const docs = await CvDoctorUpdate.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await CvDoctorUpdate.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: docs,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// Helper to convert model field names
const SPECIALTY_FIELD = "specialization";
const YEAR_FIELD = "graduationDate";

// NEW: doctor name suggestions for autocomplete
export const getDoctorNameSuggestions: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.query;
    if (!name || String(name).trim() === "") {
      res.json([]);
      return;
    }
    const docs = await CvDoctorUpdate.find({ yourName: { $regex: name as string, $options: "i" } })
      .select("yourName")
      .limit(10)
      .sort({ yourName: 1 });
    const names = docs.map((d) => d.yourName);
    res.json(names);
  } catch (err: any) {
    next(err);
  }
};

// NEW: fetch full CV by doctor name (exact match)
export const getDoctorCvByName: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.query;
    if (!name || String(name).trim() === "") {
      res.status(400).json({ success: false, message: "name query param required" });
      return;
    }
    const doc = await CvDoctorUpdate.findOne({ yourName: name });
    if (!doc) {
      res.status(404).json({ success: false, message: "Doctor CV not found" });
      return;
    }
    res.json(doc);
  } catch (err: any) {
    next(err);
  }
};

export const getCandidatesBySpecialty: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { specialty } = req.params;
    const docs = await CvDoctorUpdate.find({ [SPECIALTY_FIELD]: { $regex: specialty, $options: "i" } }).sort({ [YEAR_FIELD]: -1, yourName: 1 });
    res.status(200).json({ success: true, data: docs, count: docs.length });
  } catch (err: any) {
    next(err);
  }
};

export const getCandidatesByGraduationYear: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year } = req.params;
    const docs = await CvDoctorUpdate.find({ [YEAR_FIELD]: year }).sort({ yourName: 1 });
    res.status(200).json({ success: true, data: docs, count: docs.length });
  } catch (err: any) {
    next(err);
  }
};

export const searchCandidatesByName: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.query;
    if (!name || String(name).trim() === "") {
      res.status(400).json({ success: false, message: "name parameter required" });
      return;
    }
    const docs = await CvDoctorUpdate.find({ yourName: { $regex: name as string, $options: "i" } }).sort({ yourName: 1 });
    res.status(200).json({ success: true, data: docs, count: docs.length });
  } catch (err: any) {
    next(err);
  }
};

export const compareCandidates: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { candidateIds } = req.body as { candidateIds: string[] };
    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length < 2) {
      res.status(400).json({ success: false, message: "At least 2 candidate IDs required" });
      return;
    }
    if (candidateIds.length > 3) {
      res.status(400).json({ success: false, message: "Max 3 candidates can be compared" });
      return;
    }

    const objectIds = candidateIds.map((id) => new Types.ObjectId(id));
    const candidates = await CvDoctorUpdate.find({ _id: { $in: objectIds } });
    if (candidates.length !== candidateIds.length) {
      res.status(404).json({ success: false, message: "One or more candidates not found" });
      return;
    }

    // Simple common feature calc
    const commonSpecialization = candidates.every((c) => c.specialization === candidates[0].specialization) ? candidates[0].specialization : null;
    const commonGraduationDate = candidates.every((c) => c.graduationDate === candidates[0].graduationDate) ? candidates[0].graduationDate : null;

    const comparison = {
      candidates,
      commonFeatures: {
        specialization: commonSpecialization,
        graduationDate: commonGraduationDate,
      },
    };

    res.status(200).json({ success: true, data: comparison });
  } catch (err: any) {
    next(err);
  }
};

export const getAvailableSpecialties: RequestHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const specs = await CvDoctorUpdate.distinct(SPECIALTY_FIELD);
    res.status(200).json({ success: true, data: ["All Specialties", ...specs.sort()] });
  } catch (err: any) {
    next(err);
  }
};

export const getAvailableGraduationYears: RequestHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const years = await CvDoctorUpdate.distinct(YEAR_FIELD);
    const sorted = years.sort((a: string, b: string) => Number(b.split("-")[0]) - Number(a.split("-")[0]));
    res.status(200).json({ success: true, data: ["All Years", ...sorted] });
  } catch (err: any) {
    next(err);
  }
};

export const getCandidateById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const doc = await CvDoctorUpdate.findById(id);
    if (!doc) {
      res.status(404).json({ success: false, message: "Candidate not found" });
      return;
    }
    res.status(200).json({ success: true, data: doc });
  } catch (err: any) {
    next(err);
  }
};

export const advancedSearch: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      specialty,
      graduationYear,
      university,
      location,
      experience,
      certification,
      page = 1,
      limit = 10,
    } = req.query as Record<string, any>;

    const filter: Record<string, any> = {};
    if (name) filter.yourName = { $regex: name, $options: "i" };
    if (specialty && specialty !== "All Specialties") filter.specialization = { $regex: specialty, $options: "i" };
    if (graduationYear && graduationYear !== "All Years") filter.graduationDate = graduationYear;
    if (university) filter.university = { $regex: university, $options: "i" };
    if (location) filter.currentLocation = { $regex: location, $options: "i" };
    if (experience) filter.experience = { $regex: experience, $options: "i" };
    if (certification) filter.certificationInput = { $in: (certification as string).split(',') };

    const docs = await CvDoctorUpdate.find(filter)
      .sort({ yourName: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await CvDoctorUpdate.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: docs,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
      },
      filters: req.query,
    });
  } catch (err: any) {
    next(err);
  }
};
