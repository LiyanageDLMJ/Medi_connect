"use client";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useFormContext } from "../../../context/FormContext";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  Menu,
  Search,
  User,
} from "lucide-react";
import Sidebar from "../components/NavBar/Sidebar";

export default function UpdateCV03() {
  const { formData, setFormData } = useFormContext();
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add the file change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeFile(file);
      console.log("Resume file selected:", file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FormData before submission:", formData);
    
    try {
      // For file uploads, we need to use FormData instead of JSON
      const formDataToSubmit = new FormData();
      
      // Create a cleaned copy of the form data
      const formDataCopy = { ...formData };
      
      // Remove fields that shouldn't be sent to the backend
      if ("additionalCertifications" in formDataCopy) {
        delete formDataCopy.additionalCertifications;
      }
      
      // Handle certification input array properly
      if (!formDataCopy.certificationInput) {
        formDataCopy.certificationInput = []; // Ensure it's an array if undefined
      }
      
      // Add all form fields to the FormData
      Object.entries(formDataCopy).forEach(([key, value]) => {
        if (key === "certificationInput" && Array.isArray(value)) {
          formDataToSubmit.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formDataToSubmit.append(key, String(value));
        }
      });
      
      // Add the resume file if it exists
      if (resumeFile) {
        formDataToSubmit.append("resume", resumeFile);
      }
      
      console.log("FormData prepared for submission");
      
      // Send as multipart/form-data
      const response = await fetch(
        "http://localhost:3000/CvdoctorUpdate/addDoctorCv",
        {
          method: "POST",
          // No Content-Type header - browser will set it with the boundary
          body: formDataToSubmit,
        }
      );

      if (response.ok) {
        console.log("Data submitted successfully");
        navigate("/success"); // Redirect to a success page
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("Failed to submit data", errorData);
        // You could add error handling UI here
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // You could add error handling UI here
    }
  };

  return (
    <div>
      <Sidebar />

      <div className="flex-1 overflow-auto md:pl-64">
        {/* Header */}
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

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Setup Profile</h1>

          {/* Tabs */}
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

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="JobTitle"
                    className="block text-sm font-medium"
                  >
                    Job Title*
                  </label>
                  <input
                    id="JobTitle"
                    name="jobTitle"
                    type="text"
                    value={formData.jobTitle || ''}
                    onChange={handleInputChange}
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
                    value={formData.hospitalInstitution || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
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
                    value={formData.employmentPeriod || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="resume"
                    className="block text-sm font-medium"
                  >
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
                    <p className="text-sm text-green-600">
                      File selected: {resumeFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/physician/update-cv02")}
                className="flex items-center justify-center w-10 h-10 rounded-md border"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}