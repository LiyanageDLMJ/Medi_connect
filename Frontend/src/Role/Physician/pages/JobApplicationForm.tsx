import { useState, ChangeEvent, FormEvent } from "react";
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormDataType, boolean>>>({});

  // Validation function for a single field
  const validateField = (name: keyof FormDataType, value: string | File | null): string | undefined => {
    switch (name) {
      case "name":
        if (!value) return "Full name is required";
        if (typeof value === "string" && !/^[a-zA-Z\s]{2,}$/.test(value.trim())) {
          return "Name must contain only letters and spaces (min 2 characters)";
        }
        break;
      case "email":
        if (!value) return "Email is required";
        if (typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Invalid email format";
        }
        break;
      case "phone":
        if (!value) return "Phone number is required";
        if (typeof value === "string" && !/^\+?[\d\s()-]{10,15}$/.test(value.trim())) {
          return "Invalid phone number format (e.g., +1 (123) 456-7890)";
        }
        break;
      case "experience":
        if (!value) return "Professional experience is required";
        if (typeof value === "string" && value.trim().length < 10) {
          return "Experience must be at least 10 characters long";
        }
        break;
      case "cv":
        if (!value) return "CV is required";
        if (value instanceof File) {
          const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];
          if (!allowedTypes.includes(value.type)) {
            return "CV must be a PDF, DOC, or DOCX file";
          }
          if (value.size > 10 * 1024 * 1024) {
            return "CV file size exceeds 10MB limit";
          }
        }
        break;
      default:
        break;
    }
    return undefined;
  };

  // Validate all fields (for submission)
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof FormDataType)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  // Handle input changes and validate in real-time
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

    // Validate all fields
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // Mark all fields as touched to show errors
    setTouched({
      name: true,
      email: true,
      phone: true,
      experience: true,
      cv: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

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

      const result = await response.json();
      if (response.ok) {
        alert("Application Submitted Successfully!");
        setFormData(initialFormData); // Reset form
        setErrors({}); // Clear errors
        setTouched({}); // Clear touched state
      } else {
        alert(`Submission failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred while submitting your application.");
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}