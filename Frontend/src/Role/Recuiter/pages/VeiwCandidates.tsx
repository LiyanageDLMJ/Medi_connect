import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../components/NavBar/Sidebar";
import { FaDownload, FaSearch } from 'react-icons/fa';

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  cv: string;
  appliedDate: string;
}

const ViewCandidates = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/JobApplication/getApplications');
      setApplications(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Candidate Applications</h1>
            <div className="mt-4 flex items-center">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">CV</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{application.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{application.email}</div>
                        <div className="text-sm text-gray-500">{application.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {application.experience}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.appliedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={application.cv}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaDownload className="mr-2" />
                          View CV
                        </a>
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

export default ViewCandidates;