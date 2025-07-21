import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useParams and useNavigate
import Sidebar from "../components/NavBar/Sidebar";

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  experience: string;
  cv: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  cv?: string;
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

  // Replace the old location logic with useParams
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  // --- NEW: Fetch user profile and auto-fill form ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return;

      try {
        const res = await fetch('http://localhost:3000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': userId,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchProfile();
  }, []);
  // --- END NEW ---

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let updatedValue: string | File | null = value;

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      updatedValue = fileInput.files ? fileInput.files[0] : null;
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate the field in real-time
    const error = validateField(name as keyof FormDataType, updatedValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    // Check if jobId exists
    if (!jobId) {
      alert("No job selected. Please apply from a job card.");
      navigate('/physician/job-internship'); // Redirect to job listings
      return;
    }

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

    // Phone validation: only digits, length 10
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits.");
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
    submissionData.append("jobId", jobId); // Now jobId is guaranteed to exist
    submissionData.append("userId", localStorage.getItem("userId") || "");

    // Add debugging logs
    console.log("Submitting application with:");
    console.log("jobId:", jobId);
    console.log("name:", formData.name);
    console.log("email:", formData.email);
    console.log("CV file:", formData.cv);

    try {
      const response = await fetch("http://localhost:3000/JobApplication/addApplication", {
        method: "POST",
        body: submissionData,
      });

      // Log the response status
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        let errorMessage = "Failed to submit application";
        try {
          const errorData = await response.json();
          console.log("Error data:", errorData); // Add this log
          errorMessage = errorData.message || errorMessage;
        } catch (jsonErr) {
          console.log("Could not parse error response as JSON");
        }
        throw new Error(errorMessage);
      }

      // Try to parse JSON, but fallback if not JSON
      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        console.warn("Response is not valid JSON:", jsonErr);
        result = null;
      }

      alert("Application submitted successfully!");
      setSuccessMessage("Application submitted successfully! Your CV has been uploaded.");
      setFormData(initialFormData);
      
      // Redirect to job tracker after successful submission
      setTimeout(() => {
        navigate('/physician/job-application-tracker');
      }, 2000);

    } catch (error: any) {
      console.error("Error submitting application:", error);
      alert(error.message || "Failed to submit application. Please try again.");
    }
  };

  // Dynamic class names for input fields
  const getInputClassName = (field: keyof FormDataType) => {
    if (!touched[field]) {
      return "border-gray-300";
    }
    return errors[field] ? "border-red-500" : "border-green-500";
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
              {/* Add jobId display for debugging */}
              <p className="text-blue-100 text-center mt-1 text-sm">Job ID: {jobId}</p>
            </div>

            <form onSubmit={handleSubmit} className="py-8 px-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border ${getInputClassName("name")} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                  required
                  placeholder="Enter your full name"
                  aria-label="Full Name"
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {touched.name && errors.name && (
                  <p id="name-error" className="text-red-500 text-xs mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border ${getInputClassName("email")} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                  required
                  placeholder="your.email@example.com"
                  aria-label="Email Address"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {touched.email && errors.email && (
                  <p id="email-error" className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-3 border ${getInputClassName("phone")} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                  required
                  placeholder="+1 (123) 456-7890"
                  aria-label="Phone Number"
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {touched.phone && errors.phone && (
                  <p id="phone-error" className="text-red-500 text-xs mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Experience</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`w-full p-3 border ${getInputClassName("experience")} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                  rows={5}
                  required
                  placeholder="Describe your relevant work experience..."
                  aria-label="Professional Experience"
                  aria-describedby={errors.experience ? "experience-error" : undefined}
                />
                {touched.experience && errors.experience && (
                  <p id="experience-error" className="text-red-500 text-xs mt-1">
                    {errors.experience}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CV/Resume</label>
                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                    touched.cv && errors.cv ? "border-red-500" : touched.cv ? "border-green-500" : "border-gray-300"
                  } border-dashed rounded-lg hover:border-blue-400 transition duration-200`}
                >
                  <div className="space-y-1 text-center">
                    <input
                      type="file"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                      aria-label="Upload CV/Resume"
                      aria-describedby={errors.cv ? "cv-error" : undefined}
                    />
                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                  </div>
                </div>
                {touched.cv && errors.cv && (
                  <p id="cv-error" className="text-red-500 text-xs mt-1">
                    {errors.cv}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-tr from-[#2E5FB7] to-[#1a365d] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Submit Application
                </button>
              </div>

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