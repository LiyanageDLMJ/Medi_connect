import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  TrendingUp,
  Users,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  MessageCircle,
  FileText,
  Target,
  Zap,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../../../Components/FooterDiv/Footer";
import MedicalStudentImage from "../../../MedicalStudent.png";
import { Link } from "react-router-dom";

const MedicalStudentDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    messages: 0,
    profileViews: 0,
  });

  useEffect(() => {
    // Simulate stats loading
    setTimeout(() => {
      setStats({
        applications: 12,
        interviews: 3,
        messages: 8,
        profileViews: 45,
      });
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <Sidebar />

      <div className="flex-1 overflow-auto md:ml-64">
        {/* Simple TopBar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search opportunities, institutions..."
                  className="pl-10 pr-4 py-2 rounded-full bg-gray-100/80 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
                  <Bell className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  3
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/50">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Medical Student
                  </p>
                  <p className="text-xs text-gray-500">Active Now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10"></div>
          <div className="relative px-6 py-12 md:px-16 md:py-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                      <Zap className="h-4 w-4" />
                      Welcome back, Medical Student!
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                      Your Medical Career
                      <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Journey Starts Here
                      </span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                      Discover exclusive opportunities, connect with top
                      healthcare institutions, and advance your medical career
                      with smart digital solutions.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/medical_student/cv-step01"
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Create Your CV
                    </Link>
                    <Link
                      to="/medical_student/job-internship-search"
                      className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Find Opportunities
                    </Link>
                  </div>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-3xl"></div>
                    <img
                      src={MedicalStudentImage}
                      alt="Medical Student"
                      className="relative z-10 max-w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 py-12 md:px-16 bg-white/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.applications}
                    </p>
                    <p className="text-gray-600 font-medium">Applications</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.interviews}
                    </p>
                    <p className="text-gray-600 font-medium">Interviews</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.messages}
                    </p>
                    <p className="text-gray-600 font-medium">Messages</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-orange-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.profileViews}
                    </p>
                    <p className="text-gray-600 font-medium">Profile Views</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-12 md:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to advance your medical career in one place
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* CV Builder */}
              <Link to="/medical_student/medical-cv-step01" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    Create Professional CV
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Build a compelling medical CV that stands out to recruiters
                    and institutions worldwide.
                  </p>
                </div>
              </Link>

              {/* Job Search */}
              <Link to="/medical_student/job-internship" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                    Find Opportunities
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Discover internships, jobs, and research positions from top
                    healthcare institutions.
                  </p>
                </div>
              </Link>

              {/* Higher Education */}
              <Link to="/medical_student/higher-education" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    Higher Education
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Explore advanced degree programs and specializations from
                    prestigious institutions.
                  </p>
                </div>
              </Link>

              {/* Track Applications */}
              <Link to="/medical_student/MedStudentDashboard" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                    Track Applications
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Monitor your application status and get real-time updates on
                    your submissions.
                  </p>
                </div>
              </Link>

              {/* Messages */}
              <Link to="/medical_student/messages" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                    Messages
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Connect with recruiters, institutions, and other medical
                    professionals directly.
                  </p>
                </div>
              </Link>

              {/* Profile */}
              <Link to="/medical_student/your-profile" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                    Your Profile
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Update your profile, manage preferences, and showcase your
                    achievements.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 py-16 md:px-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose MediConnect?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of medical students who have transformed their
                careers with our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Purpose-Built for Medical Careers
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Our platform is designed exclusively for healthcare
                  professionals, with features tailored to medical education and
                  career advancement.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Top Healthcare Institutions
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Connect with prestigious hospitals, research centers, and
                  educational institutions from around the world.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Smart Matching & AI
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Our intelligent algorithms match you with the perfect
                  opportunities based on your skills, interests, and career
                  goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MedicalStudentDashboard;