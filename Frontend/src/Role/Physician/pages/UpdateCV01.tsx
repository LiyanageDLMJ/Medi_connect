"use client"

import type React from "react"
import { useState } from "react"
import { Bell, ChevronDown, ChevronLeft, ChevronRight, Menu, Search, User } from "lucide-react"
import Sidebar from '../../higherEducation/components/Sidebar';

interface ProfileFormData {
  name: string
  professionalTitle: string
  location: string
  linkedIn: string
  careerSummary: string
  phone: string
  email: string
}

export default function UpdateCV01() {
  const [activeTab, setActiveTab] = useState<"basic" | "cv" | "settings">("cv")
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "Bright Web",
    professionalTitle: "Resident Physician",
    location: "Perth, Western Australia",
    linkedIn: "+94 76 864 5011", // This appears to be incorrect in the mockup
    careerSummary:
      "Dr. Anya Sharma is a board-certified cardiologist dedicated to providing comprehensive and compassionate heart care. She specializes in interventional cardiology, with a focus on minimally invasive procedures.",
    phone: "+94 76 864 5011",
    email: "gayashan@gmail.com",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission logic here
  }

  return (
    <div >
      <Sidebar />

      <div className=" flex-1 overflow-auto md:pl-64">
      
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
            <img src="/placeholder.svg?height=24&width=24" alt="English flag" className="w-6 h-6 rounded" />
            <span className="text-sm font-medium">English</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <img src="/placeholder.svg?height=32&width=32" alt="User avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium">Moni Roy</p>
              <p className="text-xs text-gray-500">Dentist</p>
            </div>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Setup Profile</h1>

        {/* Tabs */}
        <div className="flex border-b mb-8">
          <button
            className={`flex items-center gap-2 px-6 py-4 ${
              activeTab === "basic" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            <User className="w-5 h-5" />
            <span>Basic Details</span>
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-4 ${
              activeTab === "cv" ? "border-b-2 border-blue-500 text-white bg-blue-500" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("cv")}
          >
            <span>Update CV</span>
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-4 ${
              activeTab === "settings" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <span>Profile Settings</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-4 ml-auto text-red-500">
            <span>Reset Previous</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Your Name*
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium">
                  Current Location*
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="linkedIn" className="block text-sm font-medium">
                  LinkedIn Link
                </label>
                <input
                  id="linkedIn"
                  name="linkedIn"
                  type="text"
                  value={formData.linkedIn}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Contact (Phone)*
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="professionalTitle" className="block text-sm font-medium">
                  Professional Title*
                </label>
                <div className="relative">
                  <input
                    id="professionalTitle"
                    name="professionalTitle"
                    type="text"
                    value={formData.professionalTitle}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md pr-10"
                    required
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="careerSummary" className="block text-sm font-medium">
                  Career Summary*
                </label>
                <textarea
                  id="careerSummary"
                  name="careerSummary"
                  value={formData.careerSummary}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md h-40 resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Contact (Email)*
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        </form>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
          <span>Showing 1-09 of 78</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-md border hover:bg-gray-100">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-md border hover:bg-gray-100">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
      </div>
    </div>

  )
}
