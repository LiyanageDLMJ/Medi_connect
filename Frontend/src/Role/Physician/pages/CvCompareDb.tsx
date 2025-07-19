"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@mui/material";
import Sidebar from "../components/NavBar/Sidebar";
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";
import axios from "axios";

type ComparisonData = {
  yourName: string;
  otherName: string;
  totalExperience: string;
  educationLevel: string;
  certifications: number;
  specialization: string;
  university: string;
  graduationDate: string;
};

export default function CVComparison() {
  const [yourProfile, setYourProfile] = useState<string>("");
  const [otherProfile, setOtherProfile] = useState<string>("");
  const [isCompared, setIsCompared] = useState<boolean>(false);
  const [yourProfileData, setYourProfileData] = useState<ComparisonData | null>(
    null,
  );
  const [otherProfileData, setOtherProfileData] =
    useState<ComparisonData | null>(null);
  const [yourSuggestions, setYourSuggestions] = useState<string[]>([]);
  const [otherSuggestions, setOtherSuggestions] = useState<string[]>([]);
  const [showYourDropdown, setShowYourDropdown] = useState<boolean>(false);
  const [showOtherDropdown, setShowOtherDropdown] = useState<boolean>(false);

  // Fetch suggestions for autocomplete
  const fetchSuggestions = async (
    name: string,
    setSuggestions: (suggestions: string[]) => void,
    setShowDropdown: (show: boolean) => void,
  ) => {
    if (name.length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/CvdoctorUpdate/viewDoctorsCv",
        {
          params: { yourName: name },
        },
      );
      setSuggestions(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  // Fetch full CV data for a selected profile
  const fetchProfileData = async (
    name: string,
    setProfileData: (data: ComparisonData | null) => void,
  ) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/CvdoctorUpdate/getDoctorCv",
        {
          params: { yourName: name },
        },
      );
      const data = response.data;
      setProfileData({
        yourName: data.yourName,
        otherName: data.otherName,
        totalExperience: data.experience,
        educationLevel: data.medicalDegree,
        certifications: data.certificationInput?.length || 0,
        specialization: data.specialization,
        university: data.university,
        graduationDate: data.graduationDate,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setProfileData(null);
    }
  };

  // Handle input change and fetch suggestions
  const handleYourProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYourProfile(value);
    fetchSuggestions(value, setYourSuggestions, setShowYourDropdown);
  };

  const handleOtherProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherProfile(value);
    fetchSuggestions(value, setOtherSuggestions, setShowOtherDropdown);
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (name: string, isYourProfile: boolean) => {
    if (isYourProfile) {
      setYourProfile(name);
      fetchProfileData(name, setYourProfileData);
      setShowYourDropdown(false);
    } else {
      setOtherProfile(name);
      fetchProfileData(name, setOtherProfileData);
      setShowOtherDropdown(false);
    }
  };

  const handleCompare = () => {
    if (yourProfile && otherProfile) {
      fetchProfileData(yourProfile, setYourProfileData);
      fetchProfileData(otherProfile, setOtherProfileData);
      setIsCompared(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-64">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-white border-b">
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

        <div className="w-full max-w-7xl mx-auto py-12 px-8">
          <h1 className="text-4xl font-extrabold mb-12 mt-10 text-gray-800">CV Comparison</h1>

          <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
            {/* Your Profile input */}
            <div className="relative flex-1">
              <Input
                placeholder="Enter your profile name"
                value={yourProfile}
                onChange={handleYourProfileChange}
                className="flex-1"
              />
              {showYourDropdown && yourSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 mt-1 rounded shadow-lg z-10">
                  {yourSuggestions.map((name, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(name, true)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <span className="font-medium mr-50">vs</span>
            {/* Other profile input */}
            <div className="relative flex-1">
              <Input
                placeholder="Enter other profile name"
                value={otherProfile}
                onChange={handleOtherProfileChange}
                className="flex-1"
              />
              {showOtherDropdown && otherSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 mt-1 rounded shadow-lg z-10">
                  {otherSuggestions.map((name, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(name, false)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              variant="contained"
              onClick={handleCompare}
              className="px-6 py-2 bg-blue-500 text-white"
            >
              Compare
            </Button>
          </div>

          {isCompared && yourProfileData && otherProfileData && (
            <div className="border rounded-2xl overflow-hidden shadow-lg bg-white">
              <table className="w-full text-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-6 font-bold text-2xl">Features</th>
                    <th className="text-left p-6 font-bold text-2xl">{yourProfileData.yourName}</th>
                    <th className="text-left p-6 font-bold text-2xl">{otherProfileData.yourName}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-6 font-semibold">Total Experience</td>
                    <td className="p-6">{yourProfileData.totalExperience}</td>
                    <td className="p-6">{otherProfileData.totalExperience}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-6 font-semibold">Education Level</td>
                    <td className="p-6">{yourProfileData.educationLevel}</td>
                    <td className="p-6">{otherProfileData.educationLevel}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-6 font-semibold">Certifications</td>
                    <td className="p-6">{yourProfileData.certifications}</td>
                    <td className="p-6">{otherProfileData.certifications}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-6 font-semibold">Specialization</td>
                    <td className="p-6">{yourProfileData.specialization}</td>
                    <td className="p-6">{otherProfileData.specialization}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-6 font-semibold">University/Medical School</td>
                    <td className="p-6">{yourProfileData.university}</td>
                    <td className="p-6">{otherProfileData.university}</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-6 font-semibold">Graduation Date</td>
                    <td className="p-6">{yourProfileData.graduationDate}</td>
                    <td className="p-6">{otherProfileData.graduationDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
