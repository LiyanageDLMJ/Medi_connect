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
    department: string;
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [recruiterProfile, setRecruiterProfile] = useState<{ companyName?: string; photoUrl?: string }>({});

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
    // Fetch recruiter profile on mount
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
          setRecruiterProfile({ companyName: data.companyName, photoUrl: data.photoUrl });
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchProfile();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (userId) headers['x-user-id'] = userId;
      const response = await axios.get('http://localhost:3000/jobApplicationControl/getApplications', { headers });
      setApplications(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch applications');
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

  const handleViewCV = (application: Application) => {
    if (!application.cv) {
      alert('CV file not available for this candidate');
      return;
    }

    const cvUrl = `http://localhost:3000/${application.cv}`;
    
    // Try to open the CV in a new tab
    const newWindow = window.open(cvUrl, '_blank');
    
    if (!newWindow) {
      // If popup is blocked, show an alert with the URL
      alert(`CV URL: ${cvUrl}\n\nIf the CV doesn't open automatically, please copy and paste this URL into your browser.`);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication) return;

    setUpdateLoading(true);
    try {
      await axios.patch(
        `http://localhost:3000/jobApplicationControl/updateStatus/${selectedApplication._id}`,
        {
          status: newStatus,
          recruiterFeedback: feedback
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

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
      setError(error.response?.data?.message || error.message || 'Failed to update status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col md:flex-row">
      <div className="w-full md:w-64 flex-shrink-0 md:sticky md:top-0 md:h-screen z-10">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto flex flex-col items-center justify-start px-4 py-8 min-h-screen">
        <div className="w-full max-w-7xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 md:p-10 mx-auto border border-white/20">
          {/* Enhanced Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-blue-900 to-indigo-500 rounded-2xl text-white">
            <div>
              <h1 className="text-3xl font-bold">Candidate Applications</h1>
              <p className="text-blue-100 mt-1">Manage and review job applications</p>
            </div>
            <div className="flex items-center justify-end w-full md:w-auto">
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <img
                  src={recruiterProfile.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
                  className="w-10 h-10 rounded-full border-2 border-white/30"
                  alt="Profile"
                />
                <span className="font-semibold">{recruiterProfile.companyName || "Recruiter"}</span>
              </div>
            </div>
          </div>
            
          {/* Enhanced Search and Filter Section */}
          <div className="mb-6 flex flex-col lg:flex-row items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
            {/* Search Field */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-gray-700 transition-all duration-200"
              >
                <option value="all">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="phone-screen">Phone Screen</option>
                <option value="interview-scheduled">Interview Scheduled</option>
                <option value="in-review">In Review</option>
                <option value="final-interview">Final Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 bg-white shadow-sm font-medium"
            >
              Clear Filters
            </button>
          </div>

          {/* Enhanced Results Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-sm text-gray-700">
              <span className="font-semibold text-blue-800">Showing {filteredApplications.length} of {applications.length} candidates</span>
              {statusFilter !== 'all' && (
                <span className="ml-4 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Status: {statusFilter.replace('-', ' ')}
                </span>
              )}
              {searchTerm && (
                <span className="ml-4 inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Search: "{searchTerm}"
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center flex-1 py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 font-medium">Loading candidates...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col min-h-0 border border-gray-100 overflow-hidden">
              {/* Enhanced table header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex-shrink-0">
                <table className="w-full table-fixed">
                  <thead>
                    <tr>
                      <th className="w-[12%] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="w-[18%] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="w-[12%] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="w-[20%] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="w-[12%] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="w-[10%] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="w-[10%] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        CV
                      </th>
                      <th className="w-[10%] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Enhanced scrollable table body */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                <table className="w-full table-fixed">
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredApplications.map((application, index) => (
                      <tr 
                        key={application._id} 
                        className={`hover:bg-blue-50/50 transition-all duration-200 ${
                          !application.viewedByRecruiter ? 'bg-blue-50/30 border-l-4 border-blue-400' : ''
                        } ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}
                      >
                        <td className="w-[12%] px-4 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900 truncate text-sm">{application.name}</div>
                          {!application.viewedByRecruiter && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              New
                            </span>
                          )}
                        </td>
                        <td className="w-[18%] px-4 py-4">
                          <div className="text-sm text-gray-900 truncate">{application.email}</div>
                          <div className="text-sm text-gray-500">{application.phone}</div>
                        </td>
                        <td className="w-[12%] px-4 py-4">
                          <div className="text-sm font-medium text-gray-900 truncate" title={application.jobId?.title || 'N/A'}>
                            {application.jobId?.title || 'N/A'}
                          </div>
                        </td>
                        <td className="w-[20%] px-4 py-4">
                          <div className="text-sm text-gray-900 truncate" title={application.experience}>
                            {application.experience}
                          </div>
                        </td>
                        <td className="w-[12%] px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(application.appliedDate)}
                        </td>
                        <td className="w-[10%] px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                            {application.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="w-[10%] px-4 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewCV(application)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                          >
                            <FaDownload className="mr-1" />
                            View
                          </button>
                        </td>
                        <td className="w-[10%] px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleViewCandidate(application)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-md hover:bg-blue-50"
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
                              className="text-green-600 hover:text-green-900 transition-colors duration-200 p-1 rounded-md hover:bg-green-50"
                              title="Update Status"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Enhanced empty state */}
              {filteredApplications.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaSearch className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No applications found</p>
                  <p className="text-gray-400 mt-2">Try adjusting your search criteria or filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Status Update Modal */}
      {showStatusModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 max-w-md mx-4 shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Update Application Status</h2>
            <p className="text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg">
              Candidate: <span className="font-semibold text-gray-900">{selectedApplication.name}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Add feedback for the candidate..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedApplication(null);
                  setNewStatus('');
                  setFeedback('');
                }}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 font-medium"
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