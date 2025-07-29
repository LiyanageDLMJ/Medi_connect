import  { useState } from "react";
import * as React from "react";

import { FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import FeedbackModal from "../../../Components/Feedback/FeedbackModal";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

// Interface for degree data, aligned with the backend Degree model
interface DegreeFormData {
  courseId?: number; // Auto-incremented by backend
  degreeName: string;
  status: string;
  mode: string;
  duration: string;
  seatsAvailable: number;
  applicantsApplied?: number; // Will be set to 0 by backend
  applicationDeadline: Date | null;
  tuitionFee: string;
  eligibility: string;
  description?: string;
  skillsRequired?: string;
  perks?: string[]; // changed from string to string[]
  image?: string;
}

const PostDegree: React.FC = () => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState<DegreeFormData>({
    degreeName: "",
    status: "Open",
    mode: "Online",
    duration: "4 Years",
    seatsAvailable: 0,
    applicationDeadline: null,
    tuitionFee: "",
    eligibility: "",
    description: "",
    skillsRequired: "",
    perks: [],
  });

  // State for image file and preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State for current step
  const [currentStep, setCurrentStep] = useState(1);

  // State for form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State for submission status
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPostingFeedbackModal, setShowPostingFeedbackModal] = useState(false);
  const [postedDegreeName, setPostedDegreeName] = useState("");

  // In the component state, use a string for perks input and an array for the data
  const [perksInput, setPerksInput] = useState<string>("");

  // Handle form input changes for TextField and Select
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name === "perks") {
      setPerksInput(value);
      setErrors((prev) => ({ ...prev, perks: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image file change with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a JPEG, JPG, PNG, or WebP image.");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null); // Clear any previous errors
    }
  };

  // Handle date change for application deadline
  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, applicationDeadline: date }));
    setErrors((prev) => ({ ...prev, applicationDeadline: "" }));
  };

  // Validation for each step
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.degreeName) newErrors.degreeName = "Degree name is required";
      if (!formData.status) newErrors.status = "Status is required";
      if (!formData.mode) newErrors.mode = "Mode is required";
      if (!formData.duration) newErrors.duration = "Duration is required";
      if (formData.seatsAvailable <= 0) newErrors.seatsAvailable = "Seats must be greater than 0";
      if (!formData.applicationDeadline) newErrors.applicationDeadline = "Application deadline is required";
      if (formData.applicationDeadline && formData.applicationDeadline <= new Date()) {
        newErrors.applicationDeadline = "Application deadline must be in the future";
      }
      if (!formData.tuitionFee) newErrors.tuitionFee = "Tuition fee is required";
    } else if (step === 2) {
      if (!formData.eligibility) newErrors.eligibility = "Eligibility criteria are required";
      if (!formData.description) newErrors.description = "Degree description is required";
    } else if (step === 3) {
      if (!formData.perks || formData.perks.length === 0) newErrors.perks = "At least one perk is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    // If on the perks step, update formData.perks from perksInput before validating
    if (currentStep === 3) {
      const perksArray = perksInput
        .split(/,|\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      setFormData((prev) => ({ ...prev, perks: perksArray }));

      // Validate after updating perks
      // Since setState is async, validate using the new array directly:
      const newErrors: { [key: string]: string } = {};
      if (perksArray.length === 0) newErrors.perks = "At least one perk is required";
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
      }
      return;
    }

    // For other steps, use normal validation
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        setLoading(true);
        setError(null);
        // Split perksInput by comma or newlines, trim, and filter empty
        const perksArray = perksInput
          .split(/,|\n/)
          .map((p) => p.trim())
          .filter(Boolean);
        // Create FormData for multipart/form-data submission
        const formDataToSend = new FormData();
        Object.entries({ ...formData, perks: perksArray }).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (key === "applicationDeadline" && value instanceof Date) {
              formDataToSend.append(key, value.toISOString());
            } else if (key === "perks" && Array.isArray(value)) {
              value.forEach((perk) => formDataToSend.append("perks", perk));
            } else {
              formDataToSend.append(key, value.toString());
            }
          }
        });
        // Append the image file if selected
        if (imageFile) {
          formDataToSend.append("image", imageFile);
        }
        // Get user ID from localStorage for institution association
        const token = localStorage.getItem('token');
        const headers: any = { "Content-Type": "multipart/form-data" };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Send the request to the backend
        const response = await axios.post("http://localhost:3000/degrees/createDegree", formDataToSend, {
          headers,
        });
        console.log("Degree posted successfully:", response.data);
        
        // Show feedback modal instead of immediately navigating
        setPostedDegreeName(formData.degreeName);
        setShowFeedbackModal(true);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to post degree. Please try again.";
        setError(errorMessage);
        console.error("Error posting degree:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Steps configuration with icons
  const steps = [
    {
      label: "Degree Information",
      step: 1,
      icon: <WorkOutlineIcon fontSize="small" />,
    },
    {
      label: "Degree Description",
      step: 2,
      icon: <DescriptionOutlinedIcon fontSize="small" />,
    },
    {
      label: "Perks & Benefits",
      step: 3,
      icon: <CardGiftcardOutlinedIcon fontSize="small" />,
    },
    {
      label: "Image Upload",
      step: 4,
      icon: <CardGiftcardOutlinedIcon fontSize="small" />,
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-64">
        <TopBar />

        <div className="flex flex-col min-h-[calc(100vh-64px)] p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-t-lg border-gray-200">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/degree-listing")} className="text-gray-600 hover:text-gray-800">
                <FaArrowLeft className="text-lg" />
              </button>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">Post a Degree</h1>
                <p className="text-gray-500 text-sm">Fill in the details to post a new degree program.</p>
              </div>
            </div>
          </div>

          {/* Progress Indicator (Steps) */}
          <div className="px-4 mt-6">
            <div className="flex items-center justify-center gap-4">
              {steps.map((step, index) => (
                <div key={step.step} className="flex flex-col items-center relative">
                  {/* Step Circle with Icon */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step.step ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {React.cloneElement(step.icon, {
                      style: { fontSize: "1.25rem" },
                      className: currentStep >= step.step ? "text-white" : "text-gray-500",
                    })}
                  </div>
                  {/* Step Label */}
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= step.step ? "text-blue-500" : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </span>
                  {/* Step Number */}
                  <span
                    className={`mt-1 text-xs ${
                      currentStep >= step.step ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    Step {step.step}/4
                  </span>
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-16 h-2 ${
                        currentStep > step.step ? "bg-blue-500" : "bg-gray-200"
                      } transform translate-x-[16px]`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 px-4 mt-6 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      This information will be displayed publicly
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Degree Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree Title
                      </label>
                      <TextField
                        name="degreeName"
                        value={formData.degreeName}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="e.g. Bachelor of Science in Computer Science"
                        error={!!errors.degreeName}
                        helperText={errors.degreeName}
                        InputProps={{ style: { fontSize: "0.875rem" } }}
                        InputLabelProps={{ style: { fontSize: "0.875rem" } }}
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        Degree titles must be descriptive
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          style={{ fontSize: "0.875rem" }}
                          error={!!errors.status}
                        >
                          <MenuItem value="Open" style={{ fontSize: "0.875rem" }}>
                            Open
                          </MenuItem>
                          <MenuItem value="Closed" style={{ fontSize: "0.875rem" }}>
                            Closed
                          </MenuItem>
                        </Select>
                        {errors.status && (
                          <p className="text-red-600 text-xs mt-1">{errors.status}</p>
                        )}
                      </FormControl>
                    </div>

                    {/* Mode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mode of Study
                      </label>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <Select
                          name="mode"
                          value={formData.mode}
                          onChange={handleInputChange}
                          style={{ fontSize: "0.875rem" }}
                          error={!!errors.mode}
                        >
                          <MenuItem value="Online" style={{ fontSize: "0.875rem" }}>
                            Online
                          </MenuItem>
                          <MenuItem value="Offline" style={{ fontSize: "0.875rem" }}>
                            Offline
                          </MenuItem>
                          <MenuItem value="Hybrid" style={{ fontSize: "0.875rem" }}>
                            Hybrid
                          </MenuItem>
                        </Select>
                        {errors.mode && (
                          <p className="text-red-600 text-xs mt-1">{errors.mode}</p>
                        )}
                      </FormControl>
                      <p className="text-gray-500 text-xs mt-1">
                        Select the mode of study for this degree
                      </p>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <Select
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          style={{ fontSize: "0.875rem" }}
                          error={!!errors.duration}
                        >
                          <MenuItem value="2 Years" style={{ fontSize: "0.875rem" }}>
                            2 Years
                          </MenuItem>
                          <MenuItem value="3 Years" style={{ fontSize: "0.875rem" }}>
                            3 Years
                          </MenuItem>
                          <MenuItem value="4 Years" style={{ fontSize: "0.875rem" }}>
                            4 Years
                          </MenuItem>
                        </Select>
                        {errors.duration && (
                          <p className="text-red-600 text-xs mt-1">{errors.duration}</p>
                        )}
                      </FormControl>
                    </div>

                    {/* Seats Available */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seats Available
                      </label>
                      <TextField
                        name="seatsAvailable"
                        type="number"
                        value={formData.seatsAvailable}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        error={!!errors.seatsAvailable}
                        helperText={errors.seatsAvailable}
                        InputProps={{ style: { fontSize: "0.875rem" } }}
                        InputLabelProps={{ style: { fontSize: "0.875rem" } }}
                      />
                    </div>

                    {/* Application Deadline */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Application Deadline
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 border rounded-lg shadow-sm cursor-pointer">
                        <FaCalendarAlt className="text-gray-600 text-base" />
                        <DatePicker
                          selected={formData.applicationDeadline}
                          onChange={handleDateChange}
                          placeholderText="Select a date"
                          dateFormat="MMM d, yyyy"
                          className="text-gray-700 text-sm border-none outline-none w-full"
                          popperClassName="z-[1000]"
                          minDate={new Date()} // Prevent past dates
                        />
                      </div>
                      {errors.applicationDeadline && (
                        <p className="text-red-600 text-xs mt-1">{errors.applicationDeadline}</p>
                      )}
                    </div>

                    {/* Tuition Fee */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tuition Fee
                      </label>
                      <TextField
                        name="tuitionFee"
                        value={formData.tuitionFee}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="e.g., $15,000 per year"
                        error={!!errors.tuitionFee}
                        helperText={errors.tuitionFee}
                        InputProps={{ style: { fontSize: "0.875rem" } }}
                        InputLabelProps={{ style: { fontSize: "0.875rem" } }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Degree Description</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Provide details about the degree program
                    </p>
                  </div>
                  <div className="space-y-6">
                    {/* Eligibility */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Eligibility Criteria
                      </label>
                      <TextField
                        name="eligibility"
                        value={formData.eligibility}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.eligibility}
                        helperText={errors.eligibility}
                        InputProps={{ style: { fontSize: "0.875rem" } }}
                        InputLabelProps={{ style: { fontSize: "0.875rem" } }}
                      />
                    </div>

                    {/* Degree Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree Description
                      </label>
                      <TextField
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={5}
                        error={!!errors.description}
                        helperText={errors.description}
                        InputProps={{ style: { fontSize: "0.875rem" } }}
                        InputLabelProps={{ style: { fontSize: "0.875rem" } }}
                      />
                    </div>

                    {/* Skills Required */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills Required
                      </label>
                      <TextField
                        name="skillsRequired"
                        value={formData.skillsRequired}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="e.g., Programming, Data Analysis"
                        InputProps={{ style: { fontSize: "0.875rem" } }}
                        InputLabelProps={{ style: { fontSize: "0.875rem" } }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Perks & Benefits</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Highlight the benefits of enrolling in this degree program
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Perks & Benefits
                    </label>
                    <TextField
                      name="perks"
                      value={perksInput}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiline
                      rows={5}
                      placeholder="Enter each perk separated by a comma or new line.\nE.g. Scholarships, Industry Exposure, Free Lab Access"
                      error={!!errors.perks}
                      helperText={errors.perks || "Separate perks with commas or new lines."}
                      InputProps={{ style: { fontSize: "0.875rem" } }}
                      InputLabelProps={{ style: { fontSize: "0.875rem" } }}
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Image Upload</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Upload an image for the degree program (optional)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree Image
                    </label>
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Degree Preview"
                          className="h-32 w-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Accepted formats: JPEG, JPG, PNG, WebP (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 mt-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="px-4 mt-6 flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={handlePreviousStep}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
                disabled={loading}
              >
                Previous Step
              </button>
            )}
            <div className="ml-auto">
              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                  disabled={loading}
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Post Degree"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative border border-gray-100">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setShowFeedbackModal(false)}
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
              <h2 className="text-xl font-bold mb-3 text-gray-800">Degree Posted Successfully!</h2>
              <p className="mb-6 text-gray-600">Your degree "{postedDegreeName}" has been posted successfully.</p>
              <div className="space-y-3">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    navigate("/higher-education/degree-listing");
                  }}
                >
                  Continue to Degree Listing
                </button>
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setShowPostingFeedbackModal(true);
                  }}
                >
                  Give Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal for posting experience */}
      <FeedbackModal
        open={showPostingFeedbackModal}
        onClose={() => setShowPostingFeedbackModal(false)}
        title="How was your posting experience?"
        placeholder="Share your thoughts about posting a degree program..."
        source="course_posting"
        sourceDetails={`After posting degree: ${postedDegreeName}`}
      />
    </div>
  );
};

export default PostDegree;