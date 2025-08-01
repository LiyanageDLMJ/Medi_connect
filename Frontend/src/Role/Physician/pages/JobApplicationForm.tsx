import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useParams and useNavigate
import Sidebar from "../components/NavBar/Sidebar";

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  experience: string;
  cv: File | null;
}

interface CvData {
  resumeRawUrl: string;
  yourName: string;
  contactEmail: string;
  contactPhone: string;
  experience: string;
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
  const [cvData, setCvData] = useState<CvData | null>(null);
  const [isLoadingCv, setIsLoadingCv] = useState(false);
  const [cvAutoLoaded, setCvAutoLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // --- NEW: Fetch user's CV data ---
  useEffect(() => {
    const fetchCvData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      setIsLoadingCv(true);
      try {
        console.log("Fetching CV data for userId:", userId);
        const res = await fetch(`http://localhost:3000/CvdoctorUpdate/getCvByUserId/${userId}`);
        console.log("CV API response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("CV API response data:", data);
          
          if (data.hasCv && data.cvData) {
            setCvData(data.cvData);
            
            // Auto-fill form with CV data
            setFormData(prev => ({
              ...prev,
              name: data.cvData.yourName || prev.name,
              email: data.cvData.contactEmail || prev.email,
              phone: data.cvData.contactPhone || prev.phone,
              experience: data.cvData.experience || prev.experience,
            }));

            // Download and create File object from CV URL
            try {
              console.log("Downloading CV from URL:", data.cvData.resumeRawUrl);
              const cvResponse = await fetch(data.cvData.resumeRawUrl);
              
              if (!cvResponse.ok) {
                throw new Error(`Failed to download CV: ${cvResponse.status}`);
              }
              
              const cvBlob = await cvResponse.blob();
              console.log("CV blob size:", cvBlob.size);
              
              // Create a File object from the blob
              const cvFile = new File([cvBlob], 'cv.pdf', { type: 'application/pdf' });
              console.log("Created CV file:", cvFile.name, cvFile.size);
              
              setFormData(prev => ({
                ...prev,
                cv: cvFile
              }));
              
              // Programmatically set the file input
              if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(cvFile);
                fileInputRef.current.files = dataTransfer.files;
              }
              
              setCvAutoLoaded(true);
              console.log("CV file successfully set in form");
            } catch (cvError) {
              console.error("Failed to download CV file:", cvError);
              // Show user-friendly error message
              alert("Your CV was found but couldn't be automatically loaded. Please upload it manually.");
            }
          } else {
            console.log("No CV data found for user");
          }
        } else {
          console.error("CV API error:", res.status, res.statusText);
          const errorData = await res.json().catch(() => ({}));
          console.error("CV API error details:", errorData);
        }
      } catch (err) {
        console.error("Failed to fetch CV data:", err);
      } finally {
        setIsLoadingCv(false);
      }
    };

    fetchCvData();
  }, []);

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
              {isLoadingCv && (
                <div className="text-center py-4">
                  <p className="text-blue-600">Loading your CV data...</p>
                </div>
              )}

              {cvData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-700 text-sm">
                    ✓ Your CV has been automatically loaded from your profile
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    Auto-filled: Name, Email, Phone, Experience, and CV file
                  </p>
                </div>
              )}

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
                      ref={fileInputRef}
                      type="file"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                      aria-label="Upload CV/Resume"
                    />
                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                    {formData.cv && (
                      <div className="text-sm">
                        {cvAutoLoaded ? (
                          <p className="text-green-600">
                            ✓ Auto-loaded: {formData.cv.name}
                          </p>
                        ) : (
                          <p className="text-blue-600">
                            ✓ Selected: {formData.cv.name}
                          </p>
                        )}
                      </div>
                    )}
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

              {successMessage && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700">{successMessage}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
