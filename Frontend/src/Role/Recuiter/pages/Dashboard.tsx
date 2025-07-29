"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Bell, Search, ClipboardList, MessageSquare } from "lucide-react"
import Sidebar from "../components/NavBar/Sidebar" // Corrected import path

const getDefaultAvatar = (companyName?: string) => {
  const name = companyName || 'Recruiter';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=32&background=184389&color=fff`;
};

const RecruiterHospitalDashboard: React.FC = () => {
  const [recruiterProfile, setRecruiterProfile] = useState<{ companyName?: string; photoUrl?: string }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")
      if (!token || !userId) return

      try {
        const res = await fetch("http://localhost:3000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setRecruiterProfile({ companyName: data.companyName, photoUrl: data.photoUrl });
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchProfile()
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64 bg-gray-50">
        <div className="flex items-center justify-between p-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img src={recruiterProfile.photoUrl || getDefaultAvatar(recruiterProfile.companyName)} alt="User avatar" className="object-cover w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-gray-700">{recruiterProfile.companyName || "Recruiter"}</p>
                <p className="text-xs text-black-500">Hospital</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-l from-sky-200 to-sky-100">
        <div className="relative px-6 py-16 md:px-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-12 md:gap-20">
              <div className="md:w-1/2 w-full mb-8 md:mb-0 z-10 flex flex-col items-start justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-700 mb-8 text-left">Recruiters & Hospitals</h1>
                <div className="bg-sky-200 rounded-xl p-8 md:p-10 max-w-xl w-full">
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed text-left">
                    Discover top medical talent and streamline your hiring process with global healthcare connections.
                  </h2>
                </div>
              </div>
              <div className="md:w-1/2 w-full flex justify-center md:justify-end z-20 relative">
                <img
                  src="https://indoeuropean.eu/wp-content/uploads/2021/08/best-hospital-in-south-india.jpg"
                  alt="Medical professionals"
                  className="max-w-xs md:max-w-md lg:max-w-lg h-auto rounded-xl shadow-md border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Welcome Section */}
        <div className="px-6 py-12 md:px-16 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 text-left">
              Welcome to MediConnect: Empowering Medical Recruitment with Smart Digital Solutions
            </h2>
            <p className="text-slate-700 text-lg mb-12 max-w-4xl text-left">
              At MediConnect, we specialize in bridging the gap between medical professionals, students, recruiters, and
              institutions through an innovative digital platform. Whether you're a recruiter sourcing top talent, a
              hospital looking to fill critical roles, or an institution advertising advanced programs, MediConnect is
              your go-to hub for smart talent acquisition and global networking.
            </p>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="px-6 py-12 md:px-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-10 text-left">
              Why Choose MediConnect for Your Recruitment Needs?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-4">1. Targeted Healthcare Recruitment</h3>
                <p className="text-slate-600">
                  MediConnect is designed exclusively for the healthcare sector, ensuring you connect with qualified
                  medical professionals and students who align with your specific needs.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-4">2. Intelligent Talent Matching</h3>
                <p className="text-slate-600">
                  Leverage advanced features such as AI-powered candidate matching, automated screening, and
                  personalized recommendations to efficiently identify and engage top talent.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-4">3. Streamlined Communication & Management</h3>
                <p className="text-slate-600">
                  From direct messaging with candidates to real-time application tracking and tailored dashboards, we
                  ensure smooth collaboration and efficient hiring processes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="px-6 py-16 md:px-16 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-10 text-left">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col bg-blue-50 p-6 rounded-lg shadow-sm border border-gray-100 h-full">
                <h3 className="text-lg font-semibold mb-4">1. Advanced Candidate Search</h3>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Access a comprehensive database of medical professionals and students worldwide.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Utilize powerful filters and personalized recommendations to find the perfect match for your
                      roles.
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex justify-center items-center">
                  <Search className="h-20 w-20 text-indigo-600" />
                </div>
              </div>
              <div className="flex flex-col bg-blue-50 p-6 rounded-lg shadow-sm border border-gray-100 h-full">
                <h3 className="text-lg font-semibold mb-4">2. Applicant Tracking & Management</h3>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Efficiently manage applications, track candidate progress, and organize your recruitment pipeline.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Receive automated feedback and insights to optimize your hiring strategy.
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex justify-center items-center">
                  <ClipboardList className="h-20 w-20 text-indigo-600" />
                </div>
              </div>
              <div className="flex flex-col bg-blue-50 p-6 rounded-lg shadow-sm border border-gray-100 h-full">
                <h3 className="text-lg font-semibold mb-4">3. Direct Messaging & Collaboration</h3>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Communicate directly with candidates and institutions through our secure messaging system.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Stay informed with instant notifications on new applications, messages, and interview schedules.
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex justify-center items-center ">
                  <MessageSquare className="h-20 w-20 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecruiterHospitalDashboard
