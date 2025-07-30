import React, { useEffect, useState } from 'react';
import { BookOpen, Users, MessageSquare } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Footer from "../../../Components/FooterDiv/Footer";
import edudash from "../../../edudash.png"

const InstitutionDashboard: React.FC = () => {
  const [profile, setProfile] = useState<{ name?: string; photoUrl?: string }>({});

  useEffect(() => {
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
          setProfile({ name: data.name, photoUrl: data.photoUrl });
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <TopBar />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-l from-sky-200 to-sky-100">
          <div className="relative px-6 py-12 md:px-16 md:py-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 z-10">
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-700 mb-8">
                    Educational Institutions
                  </h1>
                  <div className="bg-sky-200 rounded-xl p-8 md:p-10 max-w-2xl max-h-2xl">
                    <h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
                      Connect with aspiring medical students and showcase your advanced programs worldwide.
                    </h2>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-end z-20 relative">
                  <img
                    src={edudash}
                    alt="Higher Education - Graduation cap, key, and education tag"
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
              Welcome to MediConnect: Empowering Educational Excellence with Smart Digital Solutions
            </h2>
            <p className="text-slate-700 text-lg mb-12 max-w-4xl">
              At MediConnect, we specialize in bridging the gap between medical professionals, students, recruiters, and
              institutions through an innovative digital platform. Whether you're an educational institution looking to
              attract top medical students, a recruiter sourcing talent, or a student seeking opportunities, MediConnect
              is your go-to hub for smart academic management and global networking.
            </p>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="px-6 py-8 md:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-10">
              Why Choose MediConnect for Your Institution?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">1. Global Student Reach</h3>
                <p className="text-slate-600">
                  Connect with medical students and professionals worldwide through our comprehensive platform,
                  expanding your institution's global presence and attracting diverse talent.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">2. Streamlined Program Management</h3>
                <p className="text-slate-600">
                  Efficiently manage degree programs, track applications, and communicate with prospective students
                  through our integrated tools designed specifically for educational institutions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">3. Advanced Communication Tools</h3>
                <p className="text-slate-600">
                  From direct messaging with students to real-time application tracking and automated notifications,
                  we ensure smooth communication and efficient admissions processes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="px-6 py-12 md:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-10">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-4">1. Program Management</h3>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Post and manage your degree programs with detailed information and requirements.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Reach a global audience of medical students and professionals.
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex justify-center items-center">
                  <BookOpen className="h-20 w-20 text-indigo-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-4">2. Application Management</h3>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Review and manage student applications efficiently with our streamlined tracking system.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Access comprehensive student profiles and academic records.
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex justify-center items-center">
                  <Users className="h-20 w-20 text-indigo-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-4">3. Student Communication</h3>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Communicate directly with prospective students through our secure messaging system.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-600">▶</span>
                    <p className="text-slate-600">
                      Stay informed with instant notifications on new applications and inquiries.
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex justify-center items-center">
                  <MessageSquare className="h-20 w-20 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default InstitutionDashboard;
