import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Define interfaces for type safety
interface Degree {
  name: string;
  institution: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  currentEducation: string;
  linkedIn: string;
  portfolio: string;
  additionalInfo: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  currentEducation: "",
  linkedIn: "",
  portfolio: "",
  additionalInfo: "",
};

const DegreeApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { degree, degreeId } = (location.state as { degree: Degree; degreeId: string }) || {
    degree: { name: "Master of Computer Science", institution: "University of XYZ" },
    degreeId: "1", // Default courseId as a number string
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const ADDITIONAL_INFO_MAX_LENGTH = 500;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
         // Convert degreeId to number
    const numericDegreeId = Number(degreeId);
    if (isNaN(numericDegreeId)) {
      throw new Error('Invalid degree ID format');
    } 
    
      const response = await fetch("http://localhost:3000/degreeApplications/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          degreeId,
          degreeName: degree.name,
          institution: degree.institution,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to submit application");
      }
      setSuccess(result.message);
      setFormData(initialFormData);
      setTimeout(() => navigate(-1), 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error submitting application:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-tr from-[#2E5FB7] to-[#1a365d] py-6 px-8 relative">
          <h2 className="text-2xl font-bold text-white">Degree Application Form</h2>
          <p className="text-blue-100 text-sm mt-1">
            {degree.name} - {degree.institution}
          </p>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none"
            aria-label="Close application form"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="py-8 px-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Application</h3>
          <p className="text-sm text-gray-500 mb-6">
            The following is required and will only be shared with {degree.institution}
          </p>

          {success && (
            <p className="text-green-600 bg-green-50 border border-green-200 rounded-md p-3 mb-6">
              {success}
            </p>
          )}
          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-6">
              Error: {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
                placeholder="Enter your full name"
                aria-label="Full Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
                placeholder="Enter your email address"
                aria-label="Email Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your phone number"
                aria-label="Phone Number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current or Previous Education
              </label>
              <input
                type="text"
                name="currentEducation"
                value={formData.currentEducation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your current or previous education title"
                aria-label="Current or Previous Education"
              />
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Links</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Link to your LinkedIn URL"
                    aria-label="LinkedIn URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Link to your portfolio URL"
                    aria-label="Portfolio URL"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                rows={5}
                placeholder="Add a cover letter or anything else you want to share"
                maxLength={ADDITIONAL_INFO_MAX_LENGTH}
                aria-label="Additional Information"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Maximum {ADDITIONAL_INFO_MAX_LENGTH} characters</span>
                <span>{formData.additionalInfo.length}/{ADDITIONAL_INFO_MAX_LENGTH}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-tr from-[#2E5FB7] to-[#1a365d] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DegreeApplicationForm;