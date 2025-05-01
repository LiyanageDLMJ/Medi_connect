"use client";

import React from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";
import Sidebar from "../components/NavBar/Sidebar";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useFormContext } from "../../../context/FormContext";

export default function UpdateCV02() {
  const { formData, setFormData } = useFormContext();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        graduationDate: format(date, "MM/dd/yyyy"),
      }));
    }
  };

  const addCertification = () => {
    if (
      formData.additionalCertifications.trim() &&
      !formData.certificationInput.includes(formData.additionalCertifications.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        certificationInput: [
          ...prev.certificationInput,
          formData.additionalCertifications.trim(),
        ],
        additionalCertifications: "",
      }));
    }
  };

  const removeCertification = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certificationInput: prev.certificationInput.filter((c) => c !== cert),
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/physician/update-cv03");
  };

  const handleBack = () => {
    navigate("/physician/update-cv01");
  };

  return (
    <div>
      <Sidebar />

      <div className="flex-1 overflow-auto md:pl-64">
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
                className="pl-10 pr-4 py-2 w-80 bg-gray-100 rounded-full text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                5
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

        {/* Tabs */}
        <div className="flex border-b mb-8">
          <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-blue-500 text-blue-500">
            <User className="w-5 h-5" />
            <span>Basic Details</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-4 text-gray-600">
            <span>Update CV</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-4 text-gray-600">
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-6">
          {/* Form */}
          <form
            onSubmit={handleNext}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <div className="bg-white p-6 rounded-md shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                {/* Medical Degree */}
                <div>
                  <label className="block text-sm mb-1">
                    Medical Degree<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="medicalDegree"
                    value={formData.medicalDegree}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-gray-50"
                    required
                  >
                    <option value="">Select Degree</option>
                    <option value="MBBS">MBBS</option>
                  </select>
                </div>

                {/* University/Medical School */}
                <div>
                  <label className="block text-sm mb-1">
                    University/Medical School
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-gray-50"
                    required
                  >
                    <option value="">Select University</option>
                    <option value="University of Merathwa">
                      University of Merathwa
                    </option>
                  </select>
                </div>

                {/* Major/Specialization */}
                <div>
                  <label className="block text-sm mb-1">
                    Major/Specialization<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-gray-50"
                    required
                  >
                    <option value="">Select Specialization</option>
                    <option value="Cardiology">Cardiology</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm mb-1">
                    Experience<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-gray-50"
                    placeholder="Years of Experience"
                    required
                  />
                </div>

                {/* Additional Certifications */}
                <div>
                  <label className="block text-sm mb-1">
                    Additional Certifications
                  </label>
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      name="additionalCertifications"
                      value={formData.additionalCertifications}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md bg-gray-50"
                      placeholder="Enter Certification"
                    />
                    <button
                      type="button"
                      onClick={addCertification}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.certificationInput.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs"
                      >
                        {cert}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeCertification(cert)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Graduation Date */}
                <div>
                  <label className="block text-sm mb-1">
                    Graduation Date<span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    showIcon
                    name="graduationDate"
                    selected={formData.graduationDate ? new Date(formData.graduationDate) : null}
                    onChange={handleDateChange}
                    dateFormat="MM/dd/yyyy"
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>

                {/* Medical License Number */}
                <div>
                  <label className="block text-sm mb-1">
                    Medical License Number
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="medicalLicenseNumber"
                    value={formData.medicalLicenseNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-gray-50"
                    placeholder="123456789"
                  />
                </div>

                {/* Medical License Issuer */}
                <div>
                  <label className="block text-sm mb-1">
                    Medical License Issuer
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="medicalLicenseIssuer"
                    value={formData.medicalLicenseIssuer}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-gray-50"
                    placeholder="Medical Board of California"
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center justify-center w-10 h-10 rounded-md border"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md"
                >
                  Next
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}