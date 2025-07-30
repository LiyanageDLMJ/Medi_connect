import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

interface Degree {
  _id: string;
  degreeName: string;
  institution: string;
  institutionId?: string;
  status: string;
  mode: string;
  applicationDeadline: string;
  eligibility: string;
  seatsAvailable: number;
  applicantsApplied: number;
  duration: string;
  tuitionFee: string;
  image?: string;
  description?: string;
  skillsRequired?: string;
  perks?: string[];
  createdAt: string;
  updatedAt: string;
}

const DegreeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [degree, setDegree] = useState<Degree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDegreeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/degrees/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch degree details');
        }
        const data = await response.json();
        setDegree(data);
      } catch (error) {
        console.error('Error fetching degree details:', error);
        setError('Failed to load degree details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDegreeDetails();
    }
  }, [id]);

  const handleApply = () => {
    if (degree) {
      navigate('/medical_student/degreeapplication', {
        state: {
          degree: {
            _id: degree._id,
            name: degree.degreeName,
            institution: degree.institution,
            institutionId: degree.institutionId,
          }
        }
      });
    }
  };

  const getImagePath = (imagePath?: string): string => {
    if (!imagePath) {
      return "/assets/images/default-image.jpg";
    }
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const cleanedPath = imagePath.replace(/^\/?image\//, "");
    return `http://localhost:3000/image/${cleanedPath}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto md:ml-[250px]">
          <TopBar />
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">Loading degree details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !degree) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto md:ml-[250px]">
          <TopBar />
          <div className="flex items-center justify-center h-full">
            <div className="text-red-600">Error: {error || 'Degree not found'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:ml-[250px]">
        <TopBar />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate('/medical_student/higher-education')}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Degrees
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{degree.degreeName}</h1>
              <p className="text-xl text-gray-600">{degree.institution}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Image */}
                <div className="mb-6">
                  <img
                    src={getImagePath(degree.image)}
                    alt={degree.degreeName}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => (e.currentTarget.src = "/assets/images/default-image.jpg")}
                  />
                </div>

                {/* Description */}
                {degree.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{degree.description}</p>
                  </div>
                )}

                {/* Eligibility */}
                {degree.eligibility && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Eligibility</h2>
                    <p className="text-gray-700 leading-relaxed">{degree.eligibility}</p>
                  </div>
                )}

                {/* Skills Required */}
                {degree.skillsRequired && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Skills Required</h2>
                    <p className="text-gray-700 leading-relaxed">{degree.skillsRequired}</p>
                  </div>
                )}

                {/* Perks */}
                {degree.perks && degree.perks.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Perks & Benefits</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {degree.perks.map((perk, index) => (
                        <li key={index}>{perk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                  {/* Status */}
                  <div className="mb-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      degree.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {degree.status}
                    </span>
                  </div>

                  {/* Key Details */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Mode</h3>
                      <p className="text-lg font-semibold">{degree.mode}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                      <p className="text-lg font-semibold">{degree.duration}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Tuition Fee</h3>
                      <p className="text-lg font-semibold">{degree.tuitionFee}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Application Deadline</h3>
                      <p className="text-lg font-semibold">
                        {new Date(degree.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Available Seats</h3>
                      <p className="text-lg font-semibold">{degree.seatsAvailable}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Applications Received</h3>
                      <p className="text-lg font-semibold">{degree.applicantsApplied}</p>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={handleApply}
                    disabled={degree.status !== 'Open'}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 ${
                      degree.status === 'Open'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {degree.status === 'Open' ? 'Apply Now' : 'Applications Closed'}
                  </button>

                  {/* Created Date */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(degree.createdAt).toLocaleDateString()}
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