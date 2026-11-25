"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../../../context/FormContext";
import { supabase } from "../../../utils/supabase";

import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  User,
  Check,
} from "lucide-react";
import SidebarWrapper from "../../../Components/SidebarWrapper";

import axios from "axios";

export default function UpdateCV03() {
  const { formData, setFormData } = useFormContext();
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdDoctorId, setCreatedDoctorId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null); // Added for user feedback

  // Get user role from localStorage
  const userType = localStorage.getItem('userType');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size exceeds 5MB limit");
        return;
      }

      setResumeFile(file);
      setError(null);
    }
  };

  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `medical_cvs/${fileName}`;

    console.log("Starting Supabase upload...");
    console.log("File:", file.name, "Size:", file.size);
    console.log("Target bucket: cvdata");
    console.log("Target path:", filePath);

    try {
      setUploadProgress(10);

      // Upload to Supabase cvdata bucket
      const { data, error } = await supabase.storage
        .from("cvdata")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase storage error:", error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log("Upload successful, data:", data);
      setUploadProgress(70);

      // Get the public URL from cvdata bucket
      const { data: urlData } = supabase.storage
        .from("cvdata")
        .getPublicUrl(filePath);

      setUploadProgress(100);

      console.log("Supabase upload completed successfully!");
      console.log("Public URL:", urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Supabase upload failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeFile) {
      setError("Please upload a PDF resume");
      return;
    }

    console.log("Form submission started...");
    console.log("Form data:", formData);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      console.log("Uploading to Supabase cvdata bucket...");
      // Upload to Supabase ONLY
      const supabaseUrl = await uploadToSupabase(resumeFile);

      console.log("File uploaded successfully, URL:", supabaseUrl);

      // Get userId from localStorage
      const userId = localStorage.getItem("userId");

      // Prepare payload with Supabase URL and userId
      const payload = {
        ...formData,
        resumeRawUrl: supabaseUrl, // This should be the Supabase URL
        jobTitle: formData.jobTitle,
        hospitalInstitution: formData.hospitalInstitution,
        employmentPeriod: formData.employmentPeriod,
        userId: userId // Add userId to the payload
      };

      console.log("Sending payload to backend:", payload);

      // Send to backend
      const response = await axios.post(
        "http://localhost:3000/CvdoctorUpdate/addDoctorCv",
        payload
      );

      console.log("Backend response:", response.data);

      // Handle response
      const newDoctorId =
        response.data?.doctorId || response.data?.id || response.data?._id;
      if (newDoctorId) {
        localStorage.setItem("doctorId", newDoctorId.toString());
        setCreatedDoctorId(newDoctorId);
      }

      setSubmitSuccess(true);
      console.log("CV submission completed successfully!");
    } catch (error: any) {
      console.error("CV upload failed:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload CV. Please try again later."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <SidebarWrapper />
      <div className="flex-1 overflow-auto md:pl-64">
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-80 bg-gray-100 rounded-full text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                5
              </span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <img
                src="/api/placeholder/24/24"
                alt="English flag"
                className="w-6 h-6 rounded"
              />
              <span className="text-sm font-medium">English</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Update CV</h1>

          <div className="flex border-b mb-8">
            <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-blue-500 text-blue-500">
              <User className="w-5 h-5" />
              <span>Basic Details</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-4 text-gray-600">
              <span>Update CV</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-4 text-gray-600">
              <span>Profile Settings</span>
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            {submitSuccess && (
              <div className="mb-4 p-4 border border-green-300 rounded-md bg-green-50 text-green-700 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Your CV has been updated successfully!</span>
                {createdDoctorId && (
                  <button
                    onClick={() =>
                      navigate(`/physician/profile/${createdDoctorId}`)
                    }
                    className="ml-auto text-blue-600 underline text-sm"
                  >
                    View Profile
                  </button>
                )}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 border border-red-300 rounded-md bg-red-50 text-red-700">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="JobTitle"
                    className="block text-sm font-medium"
                  >
                    Expected Job Type*
                    Job Title*
                  </label>
                  <input
                    id="JobTitle"
                    name="jobTitle"
                    type="text"
                    value={formData.jobTitle || ""}
                    onChange={handleInputChange}
                    placeholder="Full-time, Part-time, Contract"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="HospitalInstitution"
                    className="block text-sm font-medium"
                  >
                    Hospital/Institution*
                  </label>
                  <input
                    id="HospitalInstitution"
                    name="hospitalInstitution"
                    type="text"
                    value={formData.hospitalInstitution || ""}
                    onChange={handleInputChange}
                    placeholder="XYZ Hospital"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="EmploymentPeriod"
                    className="block text-sm font-medium"
                  >
                    Employment Period*
                  </label>
                  <input
                    id="EmploymentPeriod"
                    name="employmentPeriod"
                    type="text"
                    value={formData.employmentPeriod || ""}
                    onChange={handleInputChange}
                    placeholder="2015 - Present"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="resume" className="block text-sm font-medium">
                    Upload Resume (PDF)*
                  </label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                  {resumeFile && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">
                        File selected: {resumeFile.name}
                      </p>
                      {isUploading && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Uploading to Supabase...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  if (userType === 'MedicalStudent') {
                    navigate("/medical_student/update-cv02");
                  } else {
                    navigate("/physician/update-cv02");
                  }
                }}
                className="flex items-center justify-center w-10 h-10 rounded-md border"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className={`px-6 py-2 text-white rounded-md ${
                  isUploading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isUploading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
