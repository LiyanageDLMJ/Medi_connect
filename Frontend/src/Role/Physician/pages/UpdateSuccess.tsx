"use client";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/NavBar/Sidebar";
import axios from "axios";

interface LocationState {
  doctorId?: string;
}

export default function UpdateSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { doctorId } = (state || {}) as LocationState;

  // Automatically redirect to the doctor's profile once the component mounts.
  useEffect(() => {
    const redirect = async () => {
      try {
        // If the doctorId was passed via navigation state, use it directly.
        if (doctorId) {
          navigate(`/physician/profile/${doctorId}`);
          return;
        }

        // Otherwise, try to infer the ID (example: stored in localStorage or fetched from backend)
        const storedId = localStorage.getItem("doctorId");
        if (storedId) {
          navigate(`/physician/profile/${storedId}`);
          return;
        }

        // Fallback: request backend for currently authenticated profile (adjust endpoint as needed)
        const res = await axios.get("http://localhost:3000/physician/profile/me");
        const fetchedId = res.data?._id || res.data?.id;
        if (fetchedId) {
          navigate(`/physician/profile/${fetchedId}`);
        }
      } catch (err) {
        console.error("Failed to redirect to profile:", err);
      }
    };

    // Give user a brief moment to see the success message before redirecting
    const timer = setTimeout(redirect, 2000);
    return () => clearTimeout(timer);
  }, [doctorId, navigate]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4 text-green-600">
            CV Updated Successfully!
          </h1>
          <p className="text-gray-600 mb-6">Redirecting to your profile...</p>
          {doctorId && (
            <button
              onClick={() => navigate(`/physician/profile/${doctorId}`)}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Profile Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
