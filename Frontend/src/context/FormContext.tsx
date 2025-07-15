import React, { createContext, useContext, useState } from "react";

interface FormData {
  yourName: string;
  professionalTitle: string;
  currentLocation: string;
  linkedinLink: string;
  careerSummary: string;
  contactPhone: string;
  contactEmail: string;
  age: string;
  medicalDegree: string;
  university: string;
  specialization: string;
  experience: number|string; // Changed to string to accommodate both number and string
  certificationInput: string[];
  additionalCertifications?: string; 
  graduationDate: string; 
  medicalLicenseNumber: number|string; // Changed to string to accommodate both number and string
  medicalLicenseIssuer: string;
  jobTitle: string;
  employmentPeriod: string;
  hospitalInstitution: string;
  resumePdfUrl: string;
  profession?: string;
  specialty?: string;
  location?: string;
  higherEducation?: string;
}

interface FormContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const defaultFormData: FormData = {
  yourName: "",
  professionalTitle: "",
  currentLocation: "",
  linkedinLink: "",
  careerSummary: "",
  contactPhone: "",
  contactEmail: "",
  age: "",
  medicalDegree: "",
  university: "",
  specialization: "",
  experience: '',
  certificationInput: [],
  additionalCertifications: "", 
  graduationDate: "",
  medicalLicenseNumber: '',
  medicalLicenseIssuer: "",
  jobTitle: "",
  employmentPeriod: "",
  hospitalInstitution: "",
  resumePdfUrl: "",
  profession: "",
  specialty: "",
  location: "",
  higherEducation: "",

};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};