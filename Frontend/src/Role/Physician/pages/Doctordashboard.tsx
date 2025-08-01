import React, { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import Sidebar from "../components/NavBar/Sidebar";
import doctorImage from "../../../Doctor.png";
import { FaSearch, FaFileAlt, FaComments } from "react-icons/fa";

const DoctorDashboard: React.FC = () => {
  const [profile, setProfile] = useState<{ name?: string; specialty?: string; photoUrl?: string }>({});

  useEffect(() => {
    // Fetch doctor profile on mount
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return;
      try {
        const res = await fetch('http://localhost:3000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': userId,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({ name: data.name, specialty: data.specialty, photoUrl: data.photoUrl });
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <Sidebar />

      <div className="flex-1 overflow-auto md:pl-64">
        <div className="flex items-center justify-between p-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 w-80 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
                <Bell className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition-colors duration-200" />
              </div>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                2
              </span>
            </div>
            {/* <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <img src="/placeholder.svg?height=20&width=30" alt="English flag" className="h-5" />
              <span className="text-gray-700">English</span>
              <span className="text-gray-400">▼</span>
            </div>
          </div> */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={profile.photoUrl || "/placeholder.svg?height=32&width=32"}
                  alt="User avatar"
                  className="h-8 w-8 object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{profile.name || "Doctor"}</p>
                <p className="text-xs text-gray-500">{profile.specialty || "Specialty"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-l from-sky-200 to-sky-100">
        <div className="relative px-6 py-12 md:px-16 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 z-10">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-700 mb-8">
                  Doctors
                </h1>
                <div className="bg-sky-200 rounded-xl p-8 md:p-10 max-w-2xl max-h-2xl ">
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
                    Advance your medical career with exclusive job opportunities
                    and global healthcare connections.
                  </h2>
                </div>
              </div>
              <div className="md:w-1/2  flex justify-end z-20 relative">
                <img
                  src={doctorImage}
                  alt="Medical professionals"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Welcome Section */}
        <div className="px-6 py-8 md:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6">
              Welcome to MediConnect: Empowering Medical Careers with Smart
              Digital Solutions
            </h2>
            <p className="text-slate-700 text-lg mb-12 max-w-4xl">
              At MediConnect, we specialize in bridging the gap between medical
              professionals, students, recruiters, and institutions through an
              innovative digital platform. Whether you're a physician looking
              for new roles, a student seeking higher education opportunities, a
              recruiter sourcing top talent, or an institution advertising
              advanced programs, MediConnect is your go-to hub for smart career
              management and global networking.
            </p>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="px-6 py-8 md:px-16 bg-white-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-10 text-center">
              Why Choose MediConnect?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Purpose-Built Box */}
              <div className="bg-blue-50 rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-6 text-center text-indigo-900">
                    Purpose-Built for Healthcare Careers
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-center flex-grow">
                    MediConnect is designed exclusively for the healthcare sector, aligning with the industry's evolving needs. Our tools and features are crafted to support medical professionals at every stage of their career.
                  </p>
                </div>
              </div>

              {/* Intelligent Tools Box */}
              <div className="bg-blue-50 rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-6 text-center text-indigo-900">
                    Intelligent Tools for Career Growth
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-center flex-grow">
                    Leverage advanced features such as CV comparison, automated feedback, and personalized recommendations to enhance your career prospects and visibility.
                  </p>
                </div>
              </div>

              {/* Streamlined Communication Box */}
              <div className="bg-blue-50 rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-6 text-center text-indigo-900">
                    Streamlined Recruitment & Communication
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-center flex-grow">
                    From direct messaging between users to real-time notifications and tailored dashboards, we ensure smooth collaboration and efficient hiring or program admissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="px-6 py-12 md:px-16 bg-white-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-10 text-center">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Search Tools Box */}
              <div className="bg-blue-50 rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <FaSearch className="h-12 w-12 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-6 text-center text-indigo-900">
                    Comprehensive Search Tools
                  </h3>
                  <div className="flex flex-col gap-4 mb-6 flex-grow">
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-600 text-lg mt-1">▶</span>
                      <p className="text-slate-600 leading-relaxed">
                        Explore jobs, internships, and academic programs worldwide.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-600 text-lg mt-1">▶</span>
                      <p className="text-slate-600 leading-relaxed">
                        Get personalized recommendations based on your qualifications, experience, and interests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Enhancement Box */}
              <div className="bg-blue-50 rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <FaFileAlt className="h-12 w-12 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-6 text-center text-indigo-900">
                    CV Enhancement & Feedback
                  </h3>
                  <div className="flex flex-col gap-4 mb-6 flex-grow">
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-600 text-lg mt-1">▶</span>
                      <p className="text-slate-600 leading-relaxed">
                        Upload and manage your CVs with ease.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-600 text-lg mt-1">▶</span>
                      <p className="text-slate-600 leading-relaxed">
                        Compare your profile with top candidates and get insights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Communication Box */}
              <div className="bg-blue-50 rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <FaComments className="h-12 w-12 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-6 text-center text-indigo-900">
                    Streamlined Recruitment & Communication
                  </h3>
                  <div className="flex flex-col gap-4 mb-6 flex-grow">
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-600 text-lg mt-1">▶</span>
                      <p className="text-slate-600 leading-relaxed">
                        Stay informed with instant updates on applications, messages, and deadlines.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-600 text-lg mt-1">▶</span>
                      <p className="text-slate-600 leading-relaxed">
                        Use our secure direct messaging system to connect with recruiters or institutions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default DoctorDashboard;
