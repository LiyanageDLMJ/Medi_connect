// src/pages/DegreeApplication.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const DegreeApplication = ({ degree = { name: "Master of Computer Science", institution: "University of XYZ" } }) => {
  const [formData, setFormData] = useState({
    coverLetter: "",
    name: "",
    email: "",
    phone: "",
    currentEducation: "",
    linkedIn: "",
    portfolio: "",
    additionalInfo: "",
    document: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, document: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    formDataToSend.append("degreeId", "1"); // Replace with actual degree ID
    formDataToSend.append("degreeName", degree.name);
    formDataToSend.append("institution", degree.institution);

    try {
      const response = await fetch("http://localhost:3000/degreeApplications/apply", {
        method: "POST",
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
      const result = await response.json();
      setSuccess(result.message);
      setFormData({
        coverLetter: "",
        name: "",
        email: "",
        phone: "",
        currentEducation: "",
        linkedIn: "",
        portfolio: "",
        additionalInfo: "",
        document: null,
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-60">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {degree.name} - {degree.institution}
            </h2>
            {success && <p className="text-green-500 mb-4">{success}</p>}
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter
                  <span className="text-gray-500 text-xs block">
                    The following information will only be shared with {degree.institution}
                  </span>
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder="Write your cover letter here..."
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500 h-32"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">Your Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current or Previous Education</label>
                <input
                  type="text"
                  name="currentEducation"
                  value={formData.currentEducation}
                  onChange={handleChange}
                  placeholder="Enter your current or previous education"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">Links</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  placeholder="Enter your LinkedIn URL"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="Enter your portfolio URL"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Anything else you want to share?"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500 h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Document (e.g., Transcript or Resume)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1">
                    <input
                      type="file"
                      name="document"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      required
                    />
                    <div className="border border-gray-300 rounded-md p-3 text-gray-700 bg-gray-50 hover:bg-gray-100 cursor-pointer text-center">
                      {formData.document ? formData.document.name : "Attach your document"}
                    </div>
                  </label>
                  <button
                    type="button"
                    disabled={!formData.document}
                    onClick={() => setFormData((prev) => ({ ...prev, document: null }))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input type="checkbox" className="mr-2" required />
                <span className="text-sm text-gray-600">
                  By sending the request you confirm that you have read the{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Terms of Use and Privacy Policy
                  </a>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegreeApplication;