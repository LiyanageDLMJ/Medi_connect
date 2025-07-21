import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaMapMarkerAlt, FaGlobe, FaUsers, FaUserCheck, FaMoneyBillAlt, FaCalendarAlt, FaClock } from "react-icons/fa";

const DegreeDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [degree, setDegree] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instituteProfile, setInstituteProfile] = useState<any>(null);

  useEffect(() => {
    const fetchDegree = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/degrees/viewDegrees/${id}`);
        if (!response.ok) throw new Error("Degree not found");
        const data = await response.json();
        setDegree(data);
        // Fetch institute profile by institution name
        if (data.institution) {
          const instRes = await fetch(`http://localhost:3000/by-institute-name/${encodeURIComponent(data.institution)}`);
          if (instRes.ok) {
            const instData = await instRes.json();
            setInstituteProfile(instData);
          } else {
            setInstituteProfile(null);
          }
        }
      } catch (err: any) {
        setError(err.message || "Error fetching degree");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDegree();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <TopBar />
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Loading degree details...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !degree) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <TopBar />
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">{error || "Degree Not Found"}</h2>
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">&larr; Back</button>
          </div>
        </div>
      </div>
    );
  }

  console.log("Degree object in details page:", degree);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <TopBar />
        <div className="flex flex-col md:flex-row p-6 md:pl-72 gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 hover:underline">&larr; Back to Degrees</button>
            <div className="bg-white rounded-xl shadow p-8 mb-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Left/Main Content */}
                <div className="flex-1">
                  <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h1 className="text-2xl font-bold mb-0">{degree.degreeName}</h1>
                       
                      </div>
                      <Link
                        to="/physician/degreeapplication"
                        state={{
                          degree: {
                            degreeId: degree._id, // Pass the real MongoDB ObjectId
                            name: degree.degreeName,
                            institution: degree.institution,
                            courseId: degree.courseId,
                            status: degree.status,
                            mode: degree.mode,
                            applicationDeadline: degree.applicationDeadline,
                            eligibility: degree.eligibility,
                            seatsAvailable: degree.seatsAvailable,
                            applicantsApplied: degree.applicantsApplied,
                            duration: degree.duration,
                            tuitionFee: degree.tuitionFee,
                            image: degree.image,
                            description: degree.description,
                            skillsRequired: degree.skillsRequired,
                            perks: degree.perks,
                          }
                        }}
                      >
                        <button className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition w-auto">Apply</button>
                      </Link>
                    </div>
                  </div>
                  <h2 className="font-semibold text-lg mb-2">Description</h2>
                  <p className="text-gray-700 mb-4">{degree.description || "No description provided."}</p>
                  <h3 className="font-semibold mb-1">Eligibility</h3>
                  <p className="text-gray-700 mb-4">{degree.eligibility || "-"}</p>
                
                  {/* Skills Required Section */}
                  <h3 className="font-semibold mb-1">Skills Required</h3>
                  <p className="text-gray-700 mb-4">{degree.skillsRequired || "-"}</p>
                  {/* Perks & Benefits Section */}
                  <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="font-semibold text-lg mb-4">Perks & Benefits</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.isArray(degree.perks) && degree.perks.length > 0 ? (
                        degree.perks.map((perk: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-full">✅</span>
                            <span>{perk}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">No perks listed.</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Sidebar */}
                <div className="flex flex-col gap-6 w-full md:w-96">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-2">
                    <h3 className="font-semibold  text-gray-700 text-lg">Degree Details</h3>
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span><span className="text-gray-500">Institution:</span> {degree.institution}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <FaGlobe className="text-green-500" />
                      <span><span className="text-gray-500">Mode:</span> {degree.mode}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <FaMoneyBillAlt className="text-yellow-500" />
                      <span><span className="text-gray-500">Tuition Fee:</span> {degree.tuitionFee}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <FaCalendarAlt className="text-pink-500" />
                      <span><span className="text-gray-500">Application Deadline:</span> {degree.applicationDeadline ? new Date(degree.applicationDeadline).toLocaleDateString() : "-"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <FaClock className="text-indigo-500" />
                      <span><span className="text-gray-500">Duration:</span> {degree.duration || "-"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <FaUsers className="text-purple-500" />
                      <span><span className="text-gray-500">Seats Available:</span> {degree.seatsAvailable ?? "-"}</span>
                    </div>
                     <div className="flex items-center gap-3 text-gray-700 text-sm">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${degree.status === 'Open' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span><span className="text-gray-500">Status:</span> {degree.status || "-"}</span>
                    </div>
                  
              
                  </div>
                  {/* Institution Description Card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold mb-3 text-gray-700 text-lg">Institution Description</h3>
                    <p className="text-gray-700 text-sm">
                      {instituteProfile?.instituteDescription || "No institution description provided."}
                    </p>
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

export default DegreeDetails; 