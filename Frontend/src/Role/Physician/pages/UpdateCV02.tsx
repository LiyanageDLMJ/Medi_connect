"use client"

import type React from "react"
import { useState } from "react"
import { Bell, ChevronDown, ChevronLeft, ChevronRight, Menu, Search, User, X, Calendar } from "lucide-react"
import Sidebar from '../../higherEducation/components/Sidebar';



export default function UpdateCV02() {
  const [activeTab, setActiveTab] = useState<"basic" | "cv" | "settings">("cv")
    const [formData, setFormData] = useState({
        medicalDegree: "",
        university: "",
        specialization: "",
        experience: "",
        additionalCertifications: "",
        graduationDate: "",
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
   
    const [certifications, setCertifications] = useState<string[]>(["PALS", "USMLE"])
    const [certificationInput, setCertificationInput] = useState("")
  
    const addCertification = () => {
      if (certificationInput && !certifications.includes(certificationInput)) {
        setCertifications([...certifications, certificationInput])
        setCertificationInput("")
      }
    }
  
    const removeCertification = (cert: string) => {
      setCertifications(certifications.filter((c) => c !== cert))
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
        <div className="bg-white p-6 rounded-md shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            {/* Medical Degree */}
            <div>
              <label className="block text-sm mb-1">
                Medical Degree<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full p-2 border rounded-md bg-gray-50 appearance-none pr-10">
                  <option>MBBS</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* University/Medical School */}
            <div>
              <label className="block text-sm mb-1">
                University/Medical School<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full p-2 border rounded-md bg-gray-50 appearance-none pr-10">
                  <option>University of Merathwa</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Major/Specialization */}
            <div>
              <label className="block text-sm mb-1">
                Major/Specialization<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full p-2 border rounded-md bg-gray-50 appearance-none pr-10">
                  <option>Cardiology</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm mb-1">
                Experience<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full p-2 border rounded-md bg-gray-50 appearance-none pr-10">
                  <option>Cardiology</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Additional Certifications */}
            <div>
              <label className="block text-sm mb-1">Additional Certifications</label>
              <div className="relative">
                <input
                  type="text"
                  value={certificationInput}
                  onChange={(e) => setCertificationInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCertification()}
                  className="w-full p-2 border rounded-md bg-gray-50 pr-10"
                  placeholder="ACLS"
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
                  onClick={addCertification}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                      cert === "PALS" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {cert}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeCertification(cert)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Graduation Date */}
            <div>
              <label className="block text-sm mb-1">
                Graduation Date<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 border rounded-md bg-gray-50 pr-10"
                  placeholder="MM/DD/YYYY"
                  defaultValue="02/12/2001"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10">
            <button className="flex items-center justify-center w-10 h-10 rounded-md border">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-md">Next</button>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Showing 1-50 of 78</span>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-md border">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-1 rounded-md border">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
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
