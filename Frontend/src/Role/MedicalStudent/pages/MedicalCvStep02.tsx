import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { supabase } from '../../../utils/supabase';

const MedicalCvStep2: React.FC = () => {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  // Load saved data for pre-filling
  const savedData: Record<string, string> = JSON.parse(
    typeof window !== "undefined" && localStorage.getItem("medicalCvStep2") || "{}"
  );
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size exceeds 5MB limit");
        return;
      }
      
      setResumeFile(file);
      setError(null);
    }
  };
  
  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `medical_cvs/${fileName}`;

    console.log("Starting Supabase upload...");
    console.log("File:", file.name, "Size:", file.size);
    console.log("Target bucket: cvdata");
    console.log("Target path:", filePath);

    try {
      setUploadProgress(10);
      
      // Upload to Supabase cvdata bucket
      const { data, error } = await supabase.storage
        .from('cvdata')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Supabase storage error:", error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log("Upload successful, data:", data);
      setUploadProgress(70);

      // Get the public URL from cvdata bucket
      const { data: urlData } = supabase.storage
        .from('cvdata')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      
      console.log("Supabase upload completed successfully!");
      console.log("Public URL:", urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Supabase upload failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const step2Payload: Record<string, any> = {};
    data.forEach((value, key) => {
      if (key !== 'cvFile') step2Payload[key] = value;
    });

    // Validation
    const newFieldErrors: Record<string,string> = {};
    if (!step2Payload.degree || (step2Payload.degree as string).trim()==="") newFieldErrors.degree = "Degree is required";
    if (!step2Payload.university || (step2Payload.university as string).trim()==="") newFieldErrors.university = "University is required";
    const gradYear = parseInt(step2Payload.graduationYear as string,10);
    const currentYear = new Date().getFullYear();
    if (!gradYear || gradYear < 1900 || gradYear > currentYear) newFieldErrors.graduationYear = "Enter a valid graduation year";
    if (!step2Payload.specialization || (step2Payload.specialization as string).trim()==="") newFieldErrors.specialization = "Specialization is required";
    const exp = parseInt(step2Payload.experienceYears as string,10);
    if (isNaN(exp) || exp < 0 || exp > 100) newFieldErrors.experienceYears = "Enter valid experience years";

    if (!resumeFile) {
      setError("Please upload a PDF resume");
    }

    setFieldErrors(newFieldErrors);
    if (Object.keys(newFieldErrors).length > 0 || !resumeFile) {
      return;
    }

    // Combine with Step1 stored data
    const step1Data = JSON.parse(localStorage.getItem('medicalCvStep1') || '{}');
    const payload = { ...step1Data, ...step2Payload };

    // Persist combined locally (optional)
    localStorage.setItem('medicalCvCombined', JSON.stringify(payload));

    try {
      setIsUploading(true);

      // Upload PDF to Supabase and obtain public URL
      const supabaseUrl = await uploadToSupabase(resumeFile);

      const finalPayload = { ...payload, resumeRawUrl: supabaseUrl };

      const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;
      const res = await fetch(`${API_BASE}/medicalStudentCv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: localStorage.getItem('userId'), data: finalPayload })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed');

      alert('Medical CV saved successfully!');
      navigate('/medical_student/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Submission failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-72 bg-gray-100 rounded-full text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                3
              </span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <img
                src="/placeholder.svg?height=24&width=24"
                alt="English flag"
                className="w-6 h-6 rounded"
              />
              <span className="text-sm font-medium">English</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="p-8 md:p-10 w-full flex justify-center">
          <div className="w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Medical CV – Step 2/2: Education & Experience</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6" encType="multipart/form-data">
      <h2 className="text-1.5xl font-bold ">Medical Degree</h2>
      <input name="degree" placeholder="Medical Degree" defaultValue={savedData.degree || ""} className={`w-full p-3 bg-gray-50 border ${fieldErrors.degree ? 'border-red-500' : 'border-gray-200'} rounded-md`} />
      {fieldErrors.degree && <p className="text-red-500 text-xs mb-2">{fieldErrors.degree}</p>}

      <h2 className="text-1.5xl font-bold ">University</h2>
      <input name="university" placeholder="University" defaultValue={savedData.university || ""} className={`w-full p-3 bg-gray-50 border ${fieldErrors.university ? 'border-red-500' : 'border-gray-200'} rounded-md`} />
      {fieldErrors.university && <p className="text-red-500 text-xs mb-2">{fieldErrors.university}</p>}

      <h2 className="text-1.5xl font-bold ">Graduation Year</h2>
      <input name="graduationYear" type="number" placeholder="Graduation Year" defaultValue={savedData.graduationYear || ""} className={`w-full p-3 bg-gray-50 border ${fieldErrors.graduationYear ? 'border-red-500' : 'border-gray-200'} rounded-md`} />
      {fieldErrors.graduationYear && <p className="text-red-500 text-xs mb-2">{fieldErrors.graduationYear}</p>}

      <h2 className="text-1.5xl font-bold ">Specialization</h2>
      <input name="specialization" placeholder="Specialization" defaultValue={savedData.specialization || ""} className={`w-full p-3 bg-gray-50 border ${fieldErrors.specialization ? 'border-red-500' : 'border-gray-200'} rounded-md`} />
      {fieldErrors.specialization && <p className="text-red-500 text-xs mb-2">{fieldErrors.specialization}</p>}

      <h2 className="text-1.5xl font-bold ">Years of Experience</h2>
      <input name="experienceYears" type="number" placeholder="Years of Experience" defaultValue={savedData.experienceYears || ""} className={`w-full p-3 bg-gray-50 border ${fieldErrors.experienceYears ? 'border-red-500' : 'border-gray-200'} rounded-md`} />
      {fieldErrors.experienceYears && <p className="text-red-500 text-xs mb-2">{fieldErrors.experienceYears}</p>}
        <h2 className="text-1.5xl font-bold ">Upload CV (PDF)</h2>
        <input name="cvFile" type="file" accept="application/pdf" onChange={handleFileChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md" />
        <div className="flex justify-between gap-2">
          <button type="button" onClick={handleBack} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md flex-1">Back</button>
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md flex-1">Submit</button>
        </div>
            </form>
            {isUploading && (
              <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicalCvStep2;