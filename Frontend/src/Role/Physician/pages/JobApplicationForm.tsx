import { useState, ChangeEvent, FormEvent } from "react";
import NavBar from "../components/NavBar/NavBar";

interface FormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  cv: File | null;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  experience: "",
  cv: null,
};

export default function JobApplicationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.cv && formData.cv.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }
    console.log("Submitted Data:", formData);
    alert("Application Submitted Successfully!");
  };

  return (
    <div>
      <NavBar />
      
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-blue-500 py-6 px-8">
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
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
