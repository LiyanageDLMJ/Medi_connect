import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Mail, Phone, Star, DollarSign, Users, Video, ArrowRight } from "lucide-react"
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  User,
} from "lucide-react";
import Sidebar from "../components/Sidebar"

interface PhysicianProfile {
  yourName: string;
  professionalTitle: string;
  currentLocation: string;
  contactEmail: string;
  contactPhone: string;
  careerSummary: string;
  specialization: string;
  experience: string;
  university: string;
  medicalDegree: string;
  linkedinLink?: string;
  
}

export default function DoctorProfile() {

const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<PhysicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/physician/profile/${id}`);
        console.log(response.data);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>Profile not found</div>;


  return (
 <div>
      <Sidebar />
  <div className="flex-1 overflow-auto md:pl-64">
    <div className="min-h-screen bg-blue-5">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-4">
            
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Doctor Profile</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Info Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex gap-4">
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt={profile.yourName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.yourName}</h2>
                  <p className="text-gray-600 mb-3">{profile.professionalTitle}</p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.currentLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{profile.contactPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Short Bio */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Summary</h3>
              <ul className="space-y-3 text-sm text-gray-600">{profile.careerSummary}
                <li className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>Positive Feedback:</strong> "Dr. {profile.yourName} was excellent at explaining my condition in
                    simple terms, which helped me understand my treatment options better."
                  </span>
                </li>
                
              </ul>
              <button className="text-blue-600 hover:text-blue-700 font-medium mt-3 text-sm">Read more</button>
            </div>

            {/* Services and Price List */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Services and price list</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Orthopedic cansultation</span>
                  <span className="font-semibold text-gray-900">$550</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Delivery blocks</span>
                  <span className="font-semibold text-gray-900">$460</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Ultasound injestion</span>
                  <span className="font-semibold text-gray-900">$460</span>
                </div>
              </div>

              <button className="text-blue-600 hover:text-blue-700 font-medium mt-3 text-sm">Read more</button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                  <span className="text-white text-xs">📷</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                  <span className="text-white text-xs">🐦</span>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-white text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                  <span className="text-white text-xs">💬</span>
                </div>
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors">
                  <span className="text-white text-xs">in</span>
                </div>
              </div>
            </div>

            {/* About the Doctor */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the doctor</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">10 years of experience</p>
                    <p className="text-sm text-gray-600">At oral surgery mg USA and oral surgery clinics New York</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">85% Recommend</p>
                    <p className="text-sm text-gray-600">
                      358 patients world recommend this doctor to their friends and family
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Online consultations</p>
                    <p className="text-sm text-gray-600">The consultation is possible on site and online</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2">
                Book an appointment now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}
