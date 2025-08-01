import React, { createContext, useContext, useState } from "react";

interface FormData {
  yourName: string;
  professionalTitle: string;
  currentLocation: string;
  linkedinLink: string;
  careerSummary: string;
  contactPhone: string;
  contactEmail: string;
  medicalDegree: string;
  university: string;
  specialization: string;
  experience: number|string; // Changed to string to accommodate both number and string
  certificationInput: string[];
  additionalCertifications: string; 
  graduationDate: string; 
  medicalLicenseNumber: number|string; // Changed to string to accommodate both number and string
  medicalLicenseIssuer: string;
  jobTitle: string;
  employmentPeriod: string;
  hospitalInstitution: string;
  resumePdfUrl: string;
  resumeRawUrl: string; // Add this field for Supabase URL
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

const initialFormData: FormData = {
  yourName: "",
  professionalTitle: "",
  currentLocation: "",
  linkedinLink: "",
  careerSummary: "",
  contactPhone: "",
  contactEmail: "",
  medicalDegree: "",
  university: "",
  specialization: "",
  experience: "",
  certificationInput: [],
  additionalCertifications: "",
  graduationDate: "",
  medicalLicenseNumber: "",
  medicalLicenseIssuer: "",
  jobTitle: "",
  employmentPeriod: "",
  hospitalInstitution: "",
  resumePdfUrl: "",
  resumeRawUrl: "",
  fullName: "",
  email: "",
  phone: "",
  location: "",
};

interface FormContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};