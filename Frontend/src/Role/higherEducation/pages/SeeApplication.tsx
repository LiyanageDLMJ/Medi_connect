import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const SeeApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [applicant, setApplicant] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/viewDegreeApplications/view/${id}`);
        if (!response.ok) throw new Error("Failed to fetch application");
        const data = await response.json();
        setApplicant(data);
        // Try to fetch user info by email (or userId if available)
        if (data.email) {
          const userRes = await fetch(`http://localhost:3000/by-email/${encodeURIComponent(data.email)}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);
          } else {
            setUser(null); // User not found, leave blank
          }
        }
      } catch (err: any) {
        setError(err.message || "Error fetching application");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApplication();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error || !applicant) return <div>Error: {error || "Application not found"}</div>;

  // Helper for status color
function getStatusColor(status: string) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <TopBar />
        <div className="flex flex-col md:flex-row p-6 gap-6">
          {/* Left Panel: Summary/Contact */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-8 flex flex-col items-center border border-gray-100">
            <img
              src={
                user?.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || applicant.name || 'Applicant')}&background=E0E7FF&color=3730A3&size=96&rounded=true`
              }
              alt={user?.name || applicant.name}
              className="w-24 h-24 rounded-full object-cover border mb-4 shadow-sm"
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || applicant.name || 'Applicant')}&background=E0E7FF&color=3730A3&size=96&rounded=true`;
              }}
            />
            <h2 className="text-xl font-bold mb-1">{user?.name || applicant.name}</h2>
            <div className="text-gray-500 mb-2">{user?.profession || user?.fieldOfStudy || ""}</div>
            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(applicant.status)}`}>{applicant.status}</span>
            {/* Applied Degree Card */}
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4 mb-2">
              <div className="text-xs text-gray-500 mb-1">Applied Degree</div>
              <div className="font-semibold text-gray-800">{applicant.degreeName}</div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Application Date</span>
                <span>
                  {applicant.appliedDate || (applicant.submissionDate ? new Date(applicant.submissionDate).toLocaleDateString() : "")}
                </span>
              </div>
            </div>
            {/* Contact Section */}
            <div className="mt-6 w-full border-t pt-4">
              <h3 className="font-semibold mb-2 text-gray-700">Contact</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Email:</span> {applicant.email}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Phone:</span> {applicant.phone}
                </div>
                {user?.website && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Website:</span> <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{user.website}</a>
                  </div>
                )}
                {user?.linkedIn && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="font-medium">LinkedIn:</span> <a href={user.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:underline">{user.linkedIn}</a>
                </div>
              )}
            </div>
            </div>
          </div>
          {/* Right Panel: Detailed Profile */}
          <div className="w-full md:w-2/3 bg-white rounded-xl shadow p-8 border border-gray-100">
            {/* Tabs */}
            <div className="flex gap-4 border-b mb-6">
              {["Applicant Profile", "Resume", "Hiring Progress"].map((tab, idx) => (
                <button
                  key={tab}
                  className={`pb-2 px-2 text-base font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === idx
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-gray-500 hover:text-blue-600"
                  }`}
                  onClick={() => setActiveTab(idx)}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <div>
              {activeTab === 0 && (
                <>
                  {/* Personal Info Section */}
                  <h3 className="font-semibold mb-2 text-lg text-gray-700">Personal Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6 text-gray-700 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Full Name</div>
                      <div className="font-medium">{user?.name || applicant.name}</div>
                </div>
                <div>
                      <div className="text-xs text-gray-500">Gender</div>
                      <div className="font-medium">{user?.gender || ""}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Date of Birth</div>
                      <div className="font-medium">{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : ""}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Language</div>
                      <div className="font-medium">{user?.language || ""}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-500">Address</div>
                      <div className="font-medium">{user?.location || user?.currentInstitute || ""}</div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  {/* Professional Info Section */}
                  <h3 className="font-semibold mb-2 text-lg text-gray-700">Professional Info</h3>
                  <div className="mb-2">
                    <div className="text-xs text-gray-500">About Me</div>
                    <div className="text-gray-700 mb-2">{user?.about || ""}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4 text-gray-700 text-sm">
                    <div>
                      <div className="text-xs text-gray-500">Current Job</div>
                      <div className="font-medium">{user?.profession || user?.fieldOfStudy || ""}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Experience in Years</div>
                      <div className="font-medium">{user?.experienceYears || ""}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Highest Qualification Held</div>
                      <div className="font-medium">{user?.highestQualification || ""}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Skill set</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(user?.skills || []).map((skill: string, idx: number) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Resume and Hiring Progress tabs can be implemented as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeApplication; 