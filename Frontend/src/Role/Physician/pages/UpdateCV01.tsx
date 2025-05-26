"use client";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  User,
} from "lucide-react";
import Sidebar from "../components/NavBar/Sidebar";
import { useFormContext } from "../../../context/FormContext";
import UpdateCV02 from "./UpdateCV02";

export default function UpdateCV01() {
  const { formData, setFormData } = useFormContext();
  const navigate = useNavigate();
  const [phoneError, setPhoneError] = useState<string>("");

  const validatePhoneNumber = (phone: string) => {
    //phone number validation
    const phoneRegex = /^(?:\+94|0)[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "contactPhone") {
      if (!validatePhoneNumber(value) && value !== "") {
        setPhoneError(
          "Please enter a valid phone number (+94XXXXXXXXX or 0XXXXXXXXX)"
        );
      } else {
        setPhoneError("");
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("hiiiiiii");
    navigate("/physician/update-cv02");
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

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Update CV</h1>

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

          {/* Form */}
          <form
            onSubmit={handleNext}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="yourName"
                    className="block text-sm font-medium"
                  >
                    Your Full Name*
                  </label>
                  <input
                    id="yourName"
                    name="yourName"
                    type="text"
                    value={formData.yourName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="currentLocation"
                    className="block text-sm font-medium"
                  >
                    Current Location*
                  </label>
                  <input
                    id="currentLocation"
                    name="currentLocation"
                    type="text"
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="linkedinLink"
                    className="block text-sm font-medium"
                  >
                    LinkedIn Link
                  </label>
                  <input
                    id="linkedinLink"
                    name="linkedinLink"
                    type="text"
                    value={formData.linkedinLink}
                    onChange={handleInputChange}
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-medium"
                  >
                    Contact (Phone)*
                  </label>
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-gray-50 border ${
                      phoneError ? "border-red-500" : "border-gray-200"
                    } rounded-md`}
                    placeholder="+94771234567"
                    required
                  />
                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="professionalTitle"
                    className="block text-sm font-medium"
                  >
                    Professional Title*
                  </label>
                  <input
                    id="professionalTitle"
                    name="professionalTitle"
                    type="text"
                    value={formData.professionalTitle}
                    onChange={handleInputChange}
                    placeholder="cardiologist"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="careerSummary"
                    className="block text-sm font-medium"
                  >
                    Career Summary*
                  </label>
                  <textarea
                    id="careerSummary"
                    name="careerSummary"
                    value={formData.careerSummary}
                    onChange={handleInputChange}
                    placeholder="A brief summary of your career"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md h-40 resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium"
                  >
                    Contact (Email)*
                  </label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"                     
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
              >
                Next
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
