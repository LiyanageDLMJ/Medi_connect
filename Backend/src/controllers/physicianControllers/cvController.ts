import express, { Request, Response } from "express";
import CvDoctorUpdate from '../../models/CvUpdate';
const multer = require("multer");
const upload = multer();
import cloudinary, { generatePdfUrl, generatePdfPreviewUrl, extractPublicIdFromUrl } from "../../Config/cloudinaryConfig";
import fs from "fs";




interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

exports.viewDoctorsCv = async (req: Request, res: Response) => {
    try {
        const { yourName } = req.query; // Get the name query parameter (e.g., "mok")
        if (!yourName) {
            return res.status(400).json({ message: 'Name query is required' });
        }

        // Use regex to find names that start with the input (case-insensitive)
        const users = await CvDoctorUpdate.find(
            { yourName: { $regex: `^${yourName}`, $options: 'i' } }, // Match yourName field
            { yourName: 1, _id: 0 } // Only return the yourName field
        ).limit(5); // Limit to 5 suggestions for performance

        const names = users.map(user => user.yourName); // Extract yourName into an array
        res.status(200).json(names);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDoctorCv = async (req: Request, res: Response) => {
    try {
        const { yourName } = req.query;
        if (!yourName) {
            return res.status(400).json({ message: 'Name query is required' });
        }

        const user = await CvDoctorUpdate.findOne({ yourName });
        if (!user) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const addDoctorCv = async (req: Request, res: Response) => {
    try {
        const { resumeImageUrl, certificationInput: certInput, ...bodyData } = req.body;



        // Validate required fields
        const requiredFields = [
            'yourName', 'professionalTitle', 'currentLocation', 'careerSummary',
            'contactPhone', 'contactEmail', 'medicalDegree', 'university',
            'specialization', 'experience', 'medicalLicenseNumber',
            'medicalLicenseIssuer', 'jobTitle', 'hospitalInstitution', 'employmentPeriod'
        ];

        const missingFields = requiredFields.filter(field => !bodyData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                fields: missingFields
            });
        }

        // Handle certification input
        let certificationInput = [];
        if (certInput) {
            try {
                certificationInput = typeof certInput === 'string'
                    ? JSON.parse(certInput)
                    : certInput;
            } catch (e) {
                certificationInput = [certInput];
            }
        }

        // Create doctor data
        const doctorData = {
            ...bodyData,
            resumeImageUrl,
            certificationInput
        };



        // Save to database
        const doctor = new CvDoctorUpdate(doctorData);
        const result = await doctor.save();

        res.status(201).json({
            message: "Doctor CV added successfully",
            doctorId: result._id,
            resumeImageUrl,
            data: result
        });

    } catch (error) {
        console.error("Error adding Doctor CV:", error);
        res.status(500).json({
            message: "Failed to add Doctor CV",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.ReplaceCv = async (req: Request, res: Response) => {
    const id = req.params.id;
    const deta = req.body;

    const result = await CvDoctorUpdate.findOneAndReplace({ _id: id }, deta, { new: true });
    if (result) {
        res.send({
            "Message": "Doctor Cv updated successfully",
            "Doctor ID": result
        }).status(200);
    }
    else {
        res.send({
            "Message": "Doctor Cv not updated"
        }).status(500);
    }
};

exports.updateCv = async (req: Request, res: Response) => {
    const id = req.params.id;
    const deta = req.body;

    const result = await CvDoctorUpdate.findByIdAndUpdate(id, deta, { new: true });
    if (result) {
        res.send({
            "Message": "Doctor Cv updated successfully",
            "Doctor ID": result
        }).status(200);
    } else {
        res.send({
            "Message": "Doctor Cv not updated"
        }).status(500);
    }
};

exports.deleteCv = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await CvDoctorUpdate.findByIdAndDelete(id);
    if (result) {
        res.send({
            "Message": "Doctor Cv deleted successfully",
            "Doctor ID": result
        }).status(200);
    } else {
        res.send({
            "Message": "Doctor Cv not deleted"
        }).status(500);
    }
};

export const profile = async (req: Request, res: Response) => {
    try {
        const physician = await CvDoctorUpdate.findById(req.params.id);
        if (!physician) return res.status(404).json({ message: "Not found" });
        res.json(physician);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};