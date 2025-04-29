import React, { useState } from "react";
import { FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
} from "@mui/material";
// Import Material-UI icons for the steps
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"; // For "Degree Information"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"; // For "Degree Description"
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined"; // For "Perks & Benefits"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Interface for degree data
interface DegreeFormData {
  degreeName: string;
  status: string;
  mode: string[];
  duration: string;
  seatsAvailable: number;
  applicationDeadline: Date | null;
  tuitionFee: string;
  eligibility: string;
  description: string;
  skillsRequired: string;
  perks: string;
}

const PostDegree: React.FC = () => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState<DegreeFormData>({
    degreeName: "",
    status: "Open",
    mode: [],
    duration: "4 Years",
    seatsAvailable: 0,
    applicationDeadline: null,
    tuitionFee: "",
    eligibility: "",
    description: "",
    skillsRequired: "",
    perks: "",
  });

  // State for current step
  const [currentStep, setCurrentStep] = useState(1);

  // State for form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle form input changes for TextField and Select
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
    setErrors((prev) => ({ ...prev, [name as string]: "" }));
  };

  // Handle checkbox changes for mode
  const handleModeChange = (mode: string) => {
    setFormData((prev) => {
      const newModes = prev.mode.includes(mode)
        ? prev.mode.filter((m) => m !== mode)
        : [...prev.mode, mode];
      return { ...prev, mode: newModes };
    });
  };

  // Handle date change for application deadline
  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, applicationDeadline: date }));
  };

  // Validation for each step
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.degreeName) newErrors.degreeName = "Degree name is required";
      if (!formData.status) newErrors.status = "Status is required";
      if (formData.mode.length === 0) newErrors.mode = "At least one mode is required";
      if (!formData.duration) newErrors.duration = "Duration is required";
      if (formData.seatsAvailable <= 0) newErrors.seatsAvailable = "Seats must be greater than 0";
      if (!formData.applicationDeadline) newErrors.applicationDeadline = "Application deadline is required";
      if (!formData.tuitionFee) newErrors.tuitionFee = "Tuition fee is required";
    } else if (step === 2) {
      if (!formData.eligibility) newErrors.eligibility = "Eligibility criteria are required";
      if (!formData.description) newErrors.description = "Degree description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log("Degree Posted:", formData);
      alert("Degree posted successfully!");
      navigate("/degreelist");
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
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:pl-64">
        <TopBar />

        <div className="flex flex-col min-h-[calc(100vh-64px)] p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-t-lg border-gray-200">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/degreelist")} className="text-gray-600 hover:text-gray-800">
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
                      style: { fontSize: "1.25rem" }, // Adjust icon size
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
                    Step {step.step}/3
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
                        Degree titles must be descriptive one
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

                    {/* Mode (using Checkboxes) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mode of Study
                      </label>
                      <div className="flex gap-4">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.mode.includes("Online")}
                              onChange={() => handleModeChange("Online")}
                              size="small"
                            />
                          }
                          label="Online"
                          sx={{ "& .MuiTypography-root": { fontSize: "0.875rem" } }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.mode.includes("Offline")}
                              onChange={() => handleModeChange("Offline")}
                              size="small"
                            />
                          }
                          label="Offline"
                          sx={{ "& .MuiTypography-root": { fontSize: "0.875rem" } }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.mode.includes("Hybrid")}
                              onChange={() => handleModeChange("Hybrid")}
                              size="small"
                            />
                          }
                          label="Hybrid"
                          sx={{ "& .MuiTypography-root": { fontSize: "0.875rem" } }}
                        />
                      </div>
                      {errors.mode && (
                        <p className="text-red-600 text-xs mt-1">{errors.mode}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        You can select multiple modes of study
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
                      value={formData.perks}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiline
                      rows={5}
                      placeholder="e.g., Scholarships, Industry Exposure"
                      InputProps={{ style: { fontSize: "0.875rem" } }}
                      InputLabelProps={{ style: { fontSize: "0.875rem" } }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="px-4 mt-6 flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={handlePreviousStep}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
              >
                Previous Step
              </button>
            )}
            <div className="ml-auto">
              {currentStep < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                >
                  Post Degree
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDegree;