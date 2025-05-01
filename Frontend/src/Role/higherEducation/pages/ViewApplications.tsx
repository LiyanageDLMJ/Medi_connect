import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Adjust path as needed
import TopBar from "../components/TopBar"; // Adjust path as needed

// Define the shape of an application
interface Application {
  id: string;
  degreeId: string;
  degreeName: string;
  institution: string;
  coverLetter: string;
  name: string;
  email: string;
  phone: string;
  currentEducation: string;
  linkedIn: string;
  portfolio: string;
  additionalInfo: string;
  documentPath: string | null;
  status: string;
  appliedDate: string;
}

const ViewApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/degreeApplications/view");
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        console.error("Error fetching applications:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-60">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
          <h2 className="text-2xl font-semibold mb-4">View Applications</h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading applications...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : applications.length === 0 ? (
            <p className="text-center text-gray-500">No applications found.</p>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Degree Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{application.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{application.degreeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{application.institution}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{application.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{application.appliedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold text-white rounded ${
                            application.status === "Submitted"
                              ? "bg-yellow-500"
                              : application.status === "PENDING"
                              ? "bg-yellow-500"
                              : application.status === "ACCEPTED"
                              ? "bg-green-500"
                              : application.status === "REJECTED"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewApplications;