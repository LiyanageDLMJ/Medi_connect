import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import FeedbackModal from "../../../Components/Feedback/FeedbackModal";

interface Degree {
  _id?: string;
  courseId?: number;
  degreeId?: number;
  degreeName?: string;
  name: string;
  institution: string;
  institutionId?: string; // Add institutionId field
  status?: string;
  mode?: string;
  applicationDeadline?: string;
  eligibility?: string;
  seatsAvailable?: number;
  applicantsApplied?: number;
  duration?: string;
  tuitionFee?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  currentEducation: string;
  additionalInfo: string;
}

interface DegreeApplicationFormProps {
  degree?: Degree;
  onClose?: () => void;
  onSuccess?: () => void;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  currentEducation: "",
  additionalInfo: "",
};

const DegreeApplicationForm: React.FC<DegreeApplicationFormProps> = ({ degree, onClose, onSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use degree from navigation state, or prop, or fallback
  const usedDegree = location.state?.degree || degree || {
    name: "Unknown Degree",
    institution: "Unknown Institution",
  };

  console.log('=== DEBUG: Medical Student DegreeApplicationForm ===');
  console.log('Props degree:', degree);
  console.log('Location state degree:', location.state?.degree);
  console.log('Used degree:', usedDegree);
  console.log('Used degree institutionId:', usedDegree?.institutionId);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Auto-fill form with user data from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userType = localStorage.getItem('userType');
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Build current education string based on user type
        let currentEducation = '';
        if (userType === 'MedicalStudent') {
          if (user.currentInstitute && user.fieldOfStudy) {
            currentEducation = `${user.fieldOfStudy} at ${user.currentInstitute}`;
            if (user.yearOfStudy) {
              currentEducation += ` (Year ${user.yearOfStudy})`;
            }
          }
        } else if (userType === 'Doctor') {
          if (user.highestQualification && user.specialty) {
            currentEducation = `${user.highestQualification} in ${user.specialty}`;
          } else if (user.highestQualification) {
            currentEducation = user.highestQualification;
          } else if (user.specialty) {
            currentEducation = `Specialist in ${user.specialty}`;
          }
        }
        
        setFormData(prev => ({
          ...prev,
          name: user.name || userName || '',
          email: user.email || userEmail || '',
          phone: user.phone || '',
          currentEducation: currentEducation
        }));
        console.log('Auto-filled form with user data:', user);
        console.log('Current education built:', currentEducation);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else if (userName || userEmail) {
      // Fallback to individual localStorage items
      setFormData(prev => ({
        ...prev,
        name: userName || '',
        email: userEmail || ''
      }));
      console.log('Auto-filled form with fallback data:', { name: userName, email: userEmail });
    }
  }, []);

  // Use degree from navigation state, or prop, or fallback
  const idToSend = (usedDegree?._id || usedDegree?.courseId || usedDegree?.degreeId)?.toString();

  const ADDITIONAL_INFO_MAX_LENGTH = 500;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData(initialFormData);
    setCvFile(null);
    setCvError(null);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Accept PDF, DOC, and DOCX files, max 10MB
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      const allowedExtensions = [".pdf", ".doc", ".docx"];
      
      const isValidType = allowedTypes.includes(file.type) || 
                         allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!isValidType) {
        setCvError("Only PDF, DOC, and DOCX files are allowed.");
        setCvFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setCvError("File size must be less than 10MB.");
        setCvFile(null);
        return;
      }
      setCvFile(file);
      setCvError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("usedDegree:", usedDegree);
    console.log("_id:", usedDegree?._id, "courseId:", usedDegree?.courseId, "degreeId:", usedDegree?.degreeId);
    console.log("idToSend:", idToSend);
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Validate CV presence
    if (!cvFile) {
      setCvError("Please upload your CV (PDF, DOC, or DOCX).");
      setLoading(false);
      return;
    }

    try {
      // Validate degreeId (should always pass if present)
      if (!idToSend || typeof idToSend !== 'string') {
        setError("Degree ID is missing or invalid. Please try again from the degree details page.");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("degreeId", idToSend);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("currentEducation", formData.currentEducation);
      formDataToSend.append("additionalInfo", formData.additionalInfo);
      formDataToSend.append("cv", cvFile);

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await fetch("http://localhost:3000/degreeApplications/submit", {
        method: "POST",
        headers: {
          'x-user-id': userId || '',
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      const result = await response.json();
      console.log("Application submitted successfully:", result);
      setSuccess("Application submitted successfully!");
      setShowSuccessModal(true);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error submitting application:", error);
      setError(error.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowSuccessModal(false);
    setShowFeedbackModal(false);
    onClose?.();
    navigate('/medical_student/higher-education');
  };

  const handleGiveFeedback = () => {
    setShowSuccessModal(false);
    setShowFeedbackModal(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:ml-[250px]">
        <TopBar />
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Degree Application</h1>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-blue-900 mb-1">{usedDegree.name}</h2>
                  <p className="text-blue-700">{usedDegree.institution}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="currentEducation" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Education *
                    </label>
                    <input
                      type="text"
                      id="currentEducation"
                      name="currentEducation"
                      value={formData.currentEducation}
                      onChange={handleChange}
                      required
                      placeholder="e.g., MBBS at Harvard Medical School (Year 3)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                  
                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                      Why are you interested in this program? (Optional)
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      rows={4}
                      maxLength={ADDITIONAL_INFO_MAX_LENGTH}
                      placeholder="Tell us about your motivation, relevant experience, and career goals..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.additionalInfo.length}/{ADDITIONAL_INFO_MAX_LENGTH} characters
                    </div>
                  </div>
                </div>

                {/* CV Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Document Upload</h3>
                  
                  <div>
                    <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
                      CV/Resume (PDF, DOC, or DOCX) *
                    </label>
                    <input
                      type="file"
                      id="cv"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleCvChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {cvError && <p className="text-red-600 text-sm mt-1">{cvError}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum file size: 10MB. PDF, DOC, and DOCX files are accepted.
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 bg-gradient-to-tr from-[#2E5FB7] to-[#1a365d] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${
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
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your application has been successfully submitted. We'll review it and get back to you soon.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleGiveFeedback}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Give Feedback
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  Go to Higher Education
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        open={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="Share Your Experience"
        placeholder="Tell us about your experience applying for this degree program..."
        source="degree_application"
        sourceDetails={`After submitting application for ${usedDegree.name} at ${usedDegree.institution}`}
        degreeId={usedDegree._id}
        institutionId={usedDegree?.institutionId}
        redirectTo="/medical_student/higher-education"
      />
    </div>
  );
};

export default DegreeApplicationForm; 