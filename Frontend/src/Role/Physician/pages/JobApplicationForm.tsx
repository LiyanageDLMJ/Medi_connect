import { useState, ChangeEvent, FormEvent } from "react";
import Sidebar from "../components/NavBar/Sidebar";

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  experience: string;
  cv: File | null;
}

const initialFormData: FormDataType = {
  name: "",
  email: "",
  phone: "",
  experience: "",
  cv: null,
};

export default function JobApplicationForm() {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: fileInput.files ? fileInput.files[0] : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    // Check file size (10MB limit)
    if (formData.cv && formData.cv.size > 10 * 1024 * 1024) {
      alert("File size should not exceed 10MB");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;

    }
    if (formData.phone.length !== 10) {
      alert("Invalid Phone Number");
      return;
    }


    // Create FormData object
    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("phone", formData.phone);
    submissionData.append("experience", formData.experience);
    if (formData.cv) {
      submissionData.append("cv", formData.cv);
    }

    try {
      const response = await fetch("http://localhost:3000/JobApplication/addApplication", {
        method: "POST",
        body: submissionData,
        
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      const result = await response.json();
      alert("Application submitted successfully!");
      setSuccessMessage("Application submitted successfully! Your CV has been uploaded.");
      
      setFormData(initialFormData);

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-64">
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-tr from-[#2E5FB7] to-[#1a365d] py-6 px-8">
              <h2 className="text-2xl font-bold text-white text-center">Job Application Form</h2>
              <p className="text-blue-100 text-center mt-2">Please fill in your details below</p>
            </div>

            <form onSubmit={handleSubmit} className="py-8 px-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                  placeholder="your.email@example.com"
                  aria-label="Email Address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                  placeholder="+1 (123) 456-7890"
                  aria-label="Phone Number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Experience</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  rows={5}
                  required
                  placeholder="Describe your relevant work experience..."
                  aria-label="Professional Experience"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CV/Resume</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition duration-200">
                  <div className="space-y-1 text-center">
                    <input
                      type="file"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                      aria-label="Upload CV/Resume"
                    />
                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-tr from-[#2E5FB7] to-[#1a365d] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Submit Application
                </button>
              </div>
              {/* Add success message display */}
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
