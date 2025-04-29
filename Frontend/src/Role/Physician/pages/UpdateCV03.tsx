"use client";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  User,
} from "lucide-react";
import Sidebar from "../components/NavBar/Sidebar";
import UpdateCV02 from "./UpdateCV02";

interface ProfileFormData {
  JobTitle: string;
  EmploymentPeriod: string;
  HospitalInstitution: string;
}

export default function UpdateCV03() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileFormData>({
    JobTitle: "",
    EmploymentPeriod: "",
    HospitalInstitution: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setSelectedFile(e.target.files[0]);
  }
};

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        "http://localhost:3000/CvdoctorUpdate/addDoctorCv",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMessage("Doctor CV added successfully!");
        console.log("Form submitted successfully:", result);

        navigate("/physician/update-cv03");
      } else {
        const error = await response.json();
        setMessage(
          error.message || "Failed to add Doctor CV. Please try again."
        );
        console.error("Error submitting form:", error);
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
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
                src="/placeholder.svg?height=24&width=24"
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
            onSubmit={handleNext}
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
                    name="JobTitle"
                    type="text"
                    value={formData.JobTitle}
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
                    name="HospitalInstitution"
                    type="text"
                    value={formData.HospitalInstitution}
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
                    name="EmploymentPeriod"
                    type="text"
                    value={formData.EmploymentPeriod}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                </div>

                <div>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-between">
              <button className="flex items-center justify-center w-10 h-10 rounded-md border">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>

          {/* Message */}
          {message && (
            <div className="mt-4 text-center">
              <p
                className={`text-sm ${
                  message.includes("successfully")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
