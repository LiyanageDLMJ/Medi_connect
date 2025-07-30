import React, { useEffect, useState } from 'react';
import { Bell, Search, MessageSquare, GraduationCap, Globe, Building2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../../../Components/FooterDiv/Footer";
import edudash from "../../../edudash.png";
import { useNotification } from "../../../context/NotificationContext";
import { Stethoscope, FileText, MessageCircle, Heart, UserCheck, Eye, Users, Target, Award, Zap, BookOpen, Briefcase, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const getDefaultAvatar = (institutionName?: string) => {
  const name = institutionName || 'Institution';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=32&background=184389&color=fff`;
};

const InstitutionDashboard: React.FC = () => {
  const [profile, setProfile] = useState<{ name?: string; photoUrl?: string }>({});
  const [stats, setStats] = useState({
    activePrograms: 0,
    totalApplications: 0,
    enrolledStudents: 0,
    messages: 0,
    profileViews: 0,
    internationalStudents: 0,
  });
  const { unreadCount } = useNotification();

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

    // Simulate stats loading
    setTimeout(() => {
      setStats({
        activePrograms: 12,
        totalApplications: 234,
        enrolledStudents: 89,
        messages: 15,
        profileViews: 156,
        internationalStudents: 45,
      });
    }, 1000);
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
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={profile.photoUrl || getDefaultAvatar(profile.name)}
                  alt="User avatar"
                  className="h-8 w-8 object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{profile.name || "Institution"}</p>
                <p className="text-xs text-gray-500">Educational Institution</p>
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
                      <GraduationCap className="h-4 w-4" />
                      Welcome back, {profile.name || "Educational Institution"}!
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                      Shape the Future of
                      <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Medical Education
                      </span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                      Connect with aspiring medical students worldwide, showcase
                      your programs, and build a global network of healthcare
                      professionals.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/higher-education/degree-listing"
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Post Program
                    </Link>
                    <Link
                      to="/higher-education/view-applications"
                      className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      View Applications
                    </Link>
                  </div>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-3xl"></div>
                    <img
                      src={edudash}
                      alt="Higher Education"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.activePrograms}
                    </p>
                    <p className="text-gray-600 font-medium">Active Programs</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.totalApplications}
                    </p>
                    <p className="text-gray-600 font-medium">Applications</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.enrolledStudents}
                    </p>
                    <p className="text-gray-600 font-medium">
                      Enrolled Students
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-orange-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.messages}
                    </p>
                    <p className="text-gray-600 font-medium">Messages</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-pink-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.internationalStudents}
                    </p>
                    <p className="text-gray-600 font-medium">International</p>
                  </div>
                  <div className="p-3 bg-pink-100 rounded-xl group-hover:bg-pink-200 transition-colors duration-300">
                    <Globe className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.profileViews}
                    </p>
                    <p className="text-gray-600 font-medium">Profile Views</p>
                  </div>
                  <div className="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors duration-300">
                    <Eye className="h-6 w-6 text-indigo-600" />
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
                Everything you need to manage your educational programs and
                connect with students
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Post Program */}
              <Link to="/higher-education/degree-listing" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    Post New Program
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create and publish new degree programs to attract students
                    worldwide.
                  </p>
                </div>
              </Link>

              {/* View Applications */}
              <Link to="/higher-education/ViewApplications" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                    View Applications
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Review and manage student applications for your programs.
                  </p>
                </div>
              </Link>

              {/* Degree Listing */}
              <Link to="/higher-education/DegreeListing" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    Manage Programs
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Update and manage your existing degree programs and
                    requirements.
                  </p>
                </div>
              </Link>

              {/* Performance Insights */}
              <Link
                to="/higher-education/PerformanceInsights"
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                    Performance Insights
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track program performance and student engagement metrics.
                  </p>
                </div>
              </Link>

              {/* Messages */}
              <Link to="/higher-education/messages" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                    Messages
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Communicate with prospective students and manage inquiries.
                  </p>
                </div>
              </Link>

              {/* Your Profile */}
              <Link to="/higher-education/update-profile" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                    Institution Profile
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Update your institution profile and showcase your
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
                Join hundreds of educational institutions that trust us for
                their student recruitment needs
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
                  Global Student Reach
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Connect with medical students and professionals worldwide
                  through our comprehensive platform.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Streamlined Management
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Efficiently manage programs, applications, and student
                  communications in one platform.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Smart Communication
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Advanced messaging and notification systems to keep you
                  connected with students.
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

export default InstitutionDashboard;