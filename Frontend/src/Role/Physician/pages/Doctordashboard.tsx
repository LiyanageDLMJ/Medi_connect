import React, { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import Sidebar from "../components/NavBar/Sidebar";
import doctorImage from "../../../Doctor.png";
import Footer from "../../../Components/FooterDiv/Footer";
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
        <div className="px-6 py-8 md:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-10">
              Why Choose MediConnect?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  1. Purpose-Built for Healthcare Careers
                </h3>
                <p className="text-slate-600">
                  MediConnect is designed exclusively for the healthcare sector,
                  aligning with the industry's evolving needs. Our tools and
                  features are crafted to support medical professionals at every
                  stage of their career.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  2. Intelligent Tools for Career Growth
                </h3>
                <p className="text-slate-600">
                  Leverage advanced features such as CV comparison, automated
                  feedback, and personalized recommendations to enhance your
                  career prospects and visibility.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  3. Streamlined Recruitment & Communication
                </h3>
                <p className="text-slate-600">
                  From direct messaging between users to real-time notifications
                  and tailored dashboards, we ensure smooth collaboration and
                  efficient hiring or program admissions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="px-6 py-12 md:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-10">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-4">
                  1. Comprehensive Search Tools
                </h3>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Explore jobs, internships, and academic programs
                      worldwide.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Get personalized recommendations based on your
                      qualifications, experience, and interests.
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex justify-center items-center">
                  <FaSearch className="h-20 w-20 text-indigo-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-4">
                  2. CV Enhancement & Feedback
                </h3>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Upload and manage your CVs.
                    </p>
                  </div>
                
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Compare your profile with top candidates.
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto flex justify-center items-center">
                  <FaFileAlt className="h-20 w-20 text-indigo-600" />
                </div>
                
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-4">
                  3. Streamlined Recruitment & Communication
                </h3>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Stay informed with instant updates on applications,
                      messages, and deadlines.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-600">▶</span>
                      <p className="text-slate-600">
                        Use our secure direct messaging system to connect with
                        recruiters or institutions.
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-center items-center ">
                    <FaComments className="h-20 w-20 text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
