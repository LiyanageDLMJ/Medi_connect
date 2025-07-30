import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FeedbackModal from "../../../Components/Feedback/FeedbackModal";

// Define interfaces for type safety
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

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  currentEducation: "",
  additionalInfo: "",
};

interface DegreeApplicationFormProps {
  degree?: Degree;
  onClose?: () => void;
  onSuccess?: () => void;
}

const DegreeApplicationForm: React.FC<DegreeApplicationFormProps> = ({ degree, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const usedDegree = degree || location.state?.degree;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Log the degree data
  console.log('=== DEBUG: DegreeApplicationForm ===');
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
  
  // New CV-related states
  const [isLoadingCv, setIsLoadingCv] = useState(false);
  const [cvAutoLoaded, setCvAutoLoaded] = useState(false);

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

        setFormData({
          name: user.name || userName || user.yourName || "",
          email: user.email || userEmail || user.contactEmail || "",
          phone: user.phone || user.contactPhone || "",
          currentEducation: currentEducation,
          additionalInfo: "",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Fallback to basic data
        setFormData({
          name: userName || "",
          email: userEmail || "",
          phone: "",
          currentEducation: "",
          additionalInfo: "",
        });
      }
    } else {
      // Fallback to basic data
      setFormData({
        name: userName || "",
        email: userEmail || "",
        phone: "",
        currentEducation: "",
        additionalInfo: "",
      });
    }
  }, []);

  // --- NEW: Fetch user's CV data ---
  useEffect(() => {
    const fetchCvData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      setIsLoadingCv(true);
      try {
        console.log("Fetching CV data for user:", userId);
        const res = await fetch(`http://localhost:3000/CvdoctorUpdate/getCvByUser/${userId}`);
        
        if (res.ok) {
          const data = await res.json();
          console.log("CV API response:", data);
          
          if (data.success && data.cvData && data.cvData.resumeRawUrl) {
            console.log("Found existing CV data:", data.cvData.resumeRawUrl);

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
              
              setCvFile(cvFile);
              
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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleClearForm = () => {
    setFormData(initialFormData);
    setCvFile(null);
    setCvError(null);
    setCvAutoLoaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      setCvAutoLoaded(false); // Reset auto-loaded flag when user manually selects file
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

      // Prepare FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("currentEducation", formData.currentEducation);
      formDataToSend.append("additionalInfo", formData.additionalInfo);
      formDataToSend.append("degreeId", idToSend);
      formDataToSend.append("degreeName", usedDegree.name);
      formDataToSend.append("institution", usedDegree.institution);
      
      // Add applicant type from localStorage
      const userType = localStorage.getItem('userType');
      console.log('=== DEBUG: Frontend Application Submission ===');
      console.log('userType from localStorage:', userType);
      if (userType) {
        formDataToSend.append("applicantType", userType);
        console.log('applicantType added to formData:', userType);
      } else {
        // Fallback: try to get from user object
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.userType) {
              formDataToSend.append("applicantType", user.userType);
              console.log('applicantType added from user object:', user.userType);
            } else {
              formDataToSend.append("applicantType", "Unknown");
              console.log('No userType found, using "Unknown"');
            }
          } catch (e) {
            formDataToSend.append("applicantType", "Unknown");
            console.log('Error parsing user object, using "Unknown"');
          }
        } else {
          formDataToSend.append("applicantType", "Unknown");
          console.log('No userType found in localStorage');
        }
      }
      
      // Log all form data being sent
      console.log('Form data being sent:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      if (cvFile) {
        formDataToSend.append("cv", cvFile);
      }

      const response = await fetch("http://localhost:3000/degreeApplications/apply", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to submit application");
      }

      // On success:
      setSuccess("Application submitted successfully!");
      setShowSuccessModal(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error submitting application:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Use onClose if provided, else fallback to navigate(-1)
  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  // Determine which ID to send based on available fields
  const idToSend = usedDegree?._id || usedDegree?.courseId?.toString() || usedDegree?.degreeId?.toString();

  const ADDITIONAL_INFO_MAX_LENGTH = 1000;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-tr from-[#2E5FB7] to-[#1a365d] py-6 px-8 relative">
          <h2 className="text-2xl font-bold text-white">Degree Application Form</h2>
          <p className="text-blue-100 text-sm mt-1">
            {usedDegree.name} - {usedDegree.institution}
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

        {/* Success Popup Modal */}
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setSuccess(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-3 text-green-700">Success!</h2>
              <p className="mb-4 text-gray-700">{success}</p>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition mb-2"
                onClick={() => setShowFeedbackModal(true)}
              >
                Give Feedback
              </button>
              <button
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded transition"
                onClick={() => setSuccess(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <FeedbackModal
          open={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          title="How was your application experience?"
          placeholder="Share your thoughts about the application process..."
          source="degree_application"
          sourceDetails={`After submitting application for ${usedDegree.degreeName} at ${usedDegree.institution}`}
          degreeId={usedDegree._id}
          institutionId={usedDegree?.institutionId}
          redirectTo="/physician/higher-education"
        />

        {/* Form Body */}
        <div className="py-8 px-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Application</h3>
          <p className="text-sm text-gray-500 mb-6">
            The following is required and will only be shared with {usedDegree.institution}
          </p>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Education</label>
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CV/Resume</label>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                  cvError ? "border-red-500" : cvFile ? "border-green-500" : "border-gray-300"
                } border-dashed rounded-lg hover:border-blue-400 transition duration-200`}
              >
                <div className="space-y-1 text-center">
                  {isLoadingCv ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-500">Loading your CV...</span>
                    </div>
                  ) : (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                        aria-label="Upload CV/Resume"
                        aria-describedby={cvError ? "cv-error" : undefined}
                      />
                      <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                      {cvFile && (
                        <div className="text-sm">
                          {cvAutoLoaded ? (
                            <p className="text-green-600">
                              ✓ Auto-loaded: {cvFile.name}
                            </p>
                          ) : (
                            <p className="text-blue-600">
                              ✓ Selected: {cvFile.name}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              {cvError && (
                <p id="cv-error" className="text-red-500 text-xs mt-1">
                  {cvError}
                </p>
              )}
            </div>

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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative border border-gray-100">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setShowSuccessModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Application Submitted!</h2>
              <p className="mb-6 text-gray-600">Your application has been submitted successfully.</p>
              <div className="space-y-3">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/physician/higher-education");
                  }}
                >
                  Go to Higher Education
                </button>
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setShowFeedbackModal(true);
                  }}
                >
                  Give Feedback
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
        title="How was your application experience?"
        placeholder="Share your thoughts about the application process..."
        source="degree_application"
        sourceDetails={`After submitting application for ${usedDegree?.name} at ${usedDegree?.institution}`}
        degreeId={usedDegree?._id}
        institutionId={usedDegree?.institutionId} // Use the actual institutionId from degree data
        redirectTo="/physician/higher-education"
      />
      
    </div>
  );
};

export default DegreeApplicationForm;