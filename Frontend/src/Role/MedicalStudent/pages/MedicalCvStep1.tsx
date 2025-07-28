import React from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from "../components/Sidebar";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";

const MedicalCvStep1: React.FC = () => {
  const navigate = useNavigate();
  const savedData: Record<string, string> = JSON.parse(
    typeof window !== "undefined" && localStorage.getItem("medicalCvStep1") || "{}"
  );

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form));
    localStorage.setItem('medicalCvStep1', JSON.stringify(data));
    navigate('../cv-step2');
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto ">
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

        <main className="p-8 md:p-10 w-full flex justify-center">
          <div className="w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Medical CV – Step 1/2: Personal Info</h1>
            <form onSubmit={handleNext} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="fullName">Full Name*</label>
                  <input id="fullName" name="fullName" placeholder="Full Name" defaultValue={savedData.fullName || ""} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="email">Email*</label>
                  <input id="email" name="email" type="email" placeholder="Email" defaultValue={savedData.email || ""} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="phone">Phone*</label>
                  <input id="phone" name="phone" placeholder="Phone" defaultValue={savedData.phone || ""} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="location">Current Location*</label>
                  <input id="location" name="location" placeholder="Current Location" defaultValue={savedData.location || ""} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md" required />
                </div>
              </div>
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md">Next</button>
            </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
};

export default MedicalCvStep1;
