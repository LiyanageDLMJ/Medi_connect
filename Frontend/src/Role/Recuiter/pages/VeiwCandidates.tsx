import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../components/NavBar/Sidebar";
import { FaDownload, FaSearch, FaEdit, FaEye } from 'react-icons/fa';

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  cv: string;
  appliedDate: string;
  status: string;
  viewedByRecruiter: boolean;
  viewedAt: string | null;
  recruiterFeedback: string;
  jobId: {
    title: string;
    hospitalName: string;
    location: string;
  };
}

const ViewCandidates = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const statusOptions = [
    'applied',
    'phone-screen',
    'interview-scheduled',
    'in-review',
    'final-interview',
    'offer',
    'rejected',
    'withdrawn'
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Fix: Change to match your actual backend route
      const response = await axios.get('http://localhost:3000/jobApplicationControl/getApplications');
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

  const getStatusColor = (status: string) => {
    const colors = {
      'applied': 'bg-blue-100 text-blue-800',
      'phone-screen': 'bg-yellow-100 text-yellow-800',
      'interview-scheduled': 'bg-purple-100 text-purple-800',
      'in-review': 'bg-orange-100 text-orange-800',
      'final-interview': 'bg-indigo-100 text-indigo-800',
      'offer': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleViewCandidate = async (application: Application) => {
    try {
      // Mark as viewed if not already viewed
      if (!application.viewedByRecruiter) {
        // Fix: Change to match your actual backend route
        await axios.patch(`http://localhost:3000/jobApplicationControl/markAsViewed/${application._id}`, {
          recruiterId: 'current-recruiter-id'
        });
        
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app._id === application._id 
              ? { ...app, viewedByRecruiter: true, viewedAt: new Date().toISOString() }
              : app
          )
        );
      }
    } catch (error) {
      console.error('Error marking as viewed:', error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication) return;

    setUpdateLoading(true);
    try {
      // Fix: Change to match your actual backend route
      await axios.patch(`http://localhost:3000/jobApplicationControl/updateStatus/${selectedApplication._id}`, {
        status: newStatus,
        recruiterFeedback: feedback
      });

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app._id === selectedApplication._id 
            ? { ...app, status: newStatus, recruiterFeedback: feedback }
            : app
        )
      );

      setShowStatusModal(false);
      setSelectedApplication(null);
      setNewStatus('');
      setFeedback('');
    } catch (error: any) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdateLoading(false);
    }
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
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Candidate Applications</h1>
            <div className="flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png" className="w-10 h-10 rounded-full mr-2" />
              <span className="font-semibold text-gray-700">Mayo Clinic</span>
            </div>
          </div>
            
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Viewed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">CV</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application._id} className={`hover:bg-gray-50 ${!application.viewedByRecruiter ? 'bg-blue-50' : ''}`}>
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
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                          {application.status.replace('-', ' ')}
                        </span>
                      </td>
                      
                      {/* Add this missing "Viewed" column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {application.viewedByRecruiter ? (
                            <span className="text-green-600 flex items-center text-sm">
                              <FaEye className="mr-1" />
                              Viewed
                            </span>
                          ) : (
                            <span className="text-orange-600 flex items-center text-sm font-semibold">
                              <FaEye className="mr-1" />
                              New
                            </span>
                          )}
                        </div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewCandidate(application)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="View Candidate"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setNewStatus(application.status);
                            setFeedback(application.recruiterFeedback || '');
                            setShowStatusModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Update Status"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h2 className="text-lg font-bold mb-4">Update Application Status</h2>
            <p className="text-sm text-gray-600 mb-4">
              Candidate: <span className="font-semibold">{selectedApplication.name}</span>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add feedback for the candidate..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedApplication(null);
                  setNewStatus('');
                  setFeedback('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCandidates;