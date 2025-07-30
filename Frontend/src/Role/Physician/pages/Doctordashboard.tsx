import React, { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import Sidebar from "../components/NavBar/Sidebar";
import doctorImage from "../../../Doctor.png";
import Footer from "../../../Components/FooterDiv/Footer";
import { FaSearch, FaFileAlt, FaComments } from "react-icons/fa";
import { useNotification } from "../../../context/NotificationContext";
import { Stethoscope, FileText, MessageCircle, Heart, UserCheck, Eye, Users, Target, Award, Zap, BookOpen, Briefcase, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
const DoctorDashboard: React.FC = () => {
  const [profile, setProfile] = useState<{ name?: string; specialty?: string; photoUrl?: string }>({});
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    profileViews: 0,
    messages: 0,
    savedJobs: 0,
    recommendations: 0,
  });
  const { unreadCount } = useNotification();

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

    // Simulate stats loading
    setTimeout(() => {
      setStats({
        applications: 15,
        interviews: 7,
        profileViews: 67,
        messages: 9,
        savedJobs: 12,
        recommendations: 23,
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
 <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10"></div>
          <div className="relative px-6 py-12 md:px-16 md:py-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                      <Stethoscope className="h-4 w-4" />
                      Welcome back, Dr. {profile.name || "Physician"}!
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                      Advance Your
                      <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Medical Career
                      </span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                      Discover exclusive opportunities, connect with top
                      healthcare institutions, and take your medical career to
                      the next level with our comprehensive platform.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/physician/update-cv01"
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Update CV
                    </Link>
                    <Link
                      to="/physician/job-internship-search"
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
                      src={doctorImage}
                      alt="Medical Professional"
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
                      {stats.applications}
                    </p>
                    <p className="text-gray-600 font-medium">Applications</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300 group">
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
              </div> */}

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
                      {stats.savedJobs}
                    </p>
                    <p className="text-gray-600 font-medium">Saved Jobs</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
                    <Heart className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-pink-600 group-hover:scale-110 transition-transform duration-300">
                      {stats.recommendations}
                    </p>
                    <p className="text-gray-600 font-medium">Recommendations</p>
                  </div>
                  <div className="p-3 bg-pink-100 rounded-xl group-hover:bg-pink-200 transition-colors duration-300">
                    <UserCheck className="h-6 w-6 text-pink-600" />
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
                Everything you need to advance your medical career in one place
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Update CV */}
              <Link to="/physician/update-cv01" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    Update Professional CV
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create a compelling medical CV that showcases your expertise
                    and attracts top opportunities.
                  </p>
                </div>
              </Link>

              {/* Job Search */}
              <Link to="/physician/job-internship" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                    Find Opportunities
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Discover exclusive job opportunities from top healthcare
                    institutions worldwide.
                  </p>
                </div>
              </Link>

              {/* Higher Education */}
              <Link to="/physician/higher-education" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    Higher Education
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Explore advanced degree programs and specializations to
                    further your medical expertise.
                  </p>
                </div>
              </Link>

              {/* Track Applications */}
              <Link to="/physician/track-job-application" className="group">
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
              <Link to="/physician/messages" className="group">
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
              <Link to="/physician/your-profile" className="group">
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
                Join thousands of medical professionals who have transformed
                their careers with our platform
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
                  professionals, with features tailored to medical career
                  advancement.
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
                  opportunities based on your skills, experience, and career
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

export default DoctorDashboard;
