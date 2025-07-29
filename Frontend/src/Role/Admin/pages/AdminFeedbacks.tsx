import  { useState, useEffect } from "react";
import * as React from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/AdminDashboardHeader";

interface Feedback {
  _id: string;
  userId?: string;
  userType?: string;
  userName?: string;
  userEmail?: string;
  rating: number;
  heading: string;
  feedback: string;
  source: 'degree_application' | 'course_posting' | 'general';
  sourceDetails?: string;
  institutionId?: string;
  degreeId?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

interface FeedbackResponse {
  success: boolean;
  feedbacks: Feedback[];
  statistics: {
    totalFeedbacks: number;
    avgRating: number;
    pendingCount: number;
    reviewedCount: number;
    resolvedCount: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const getInitials = (name: string) => {
  if (!name) return "A";
  const names = name.split(' ');
  if (names.length === 1) return names[0][0];
  return names[0][0] + names[names.length - 1][0];
};

const AdminFeedbacks: React.FC = () => {
  // State for feedback data
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    totalFeedbacks: 0,
    avgRating: 0,
    pendingCount: 0,
    reviewedCount: 0,
    resolvedCount: 0
  });
  
  // Filter state
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const feedbacksPerPage = 10;

  // Fetch feedbacks from backend
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem('userId');
      const headers: any = {};
      if (userId) {
        headers['x-user-id'] = userId;
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (sourceFilter !== 'all') {
        params.append('source', sourceFilter);
      }
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (userTypeFilter !== 'all') params.append('userType', userTypeFilter);
      params.append('page', currentPage.toString());
      params.append('limit', feedbacksPerPage.toString());

      const response = await fetch(`http://localhost:3000/feedback/admin?${params.toString()}`, { headers });
      const data: FeedbackResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.success === false ? 'Failed to fetch feedbacks' : 'Network error');
      }

      setFeedbacks(data.feedbacks);
      setStatistics(data.statistics);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.totalCount);

    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedbacks when component mounts or filters change
  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage, sourceFilter, statusFilter, userTypeFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sourceFilter, statusFilter, userTypeFilter]);

  // Filter feedbacks based on text and rating
  const filteredFeedbacks = feedbacks.filter(fb =>
    (userFilter === "" || 
     (fb.userName && fb.userName.toLowerCase().includes(userFilter.toLowerCase())) ||
     fb.feedback.toLowerCase().includes(userFilter.toLowerCase()) ||
     fb.heading.toLowerCase().includes(userFilter.toLowerCase())) &&
    (minRating === 0 || fb.rating >= minRating)
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get source display name
  const getSourceDisplayName = (source: string) => {
    switch (source) {
      case 'degree_application': return 'From Students';
      case 'course_posting': return 'From Institutions';
      case 'general': return 'General';
      default: return source;
    }
  };

  // Get status display name
  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'reviewed': return 'Reviewed';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  // Update feedback status
  const updateFeedbackStatus = async (feedbackId: string, newStatus: string, adminResponse?: string) => {
    try {
      const userId = localStorage.getItem('userId');
      const headers: any = {
        'Content-Type': 'application/json'
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }

      const response = await fetch(`http://localhost:3000/feedback/${feedbackId}/status`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ status: newStatus, adminResponse })
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback status');
      }

      // Refresh feedbacks
      fetchFeedbacks();

    } catch (error) {
      console.error('Error updating feedback status:', error);
      alert('Failed to update feedback status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Topbar />
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">Loading feedbacks...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Topbar />
          <div className="flex items-center justify-center h-full">
            <div className="text-red-600">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Topbar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-0 bg-white">
          <h1 className="text-4xl font-bold mb-2 pt-4 pl-10">Admin Feedbacks</h1>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-10 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Total Feedbacks</h3>
              <p className="text-3xl font-bold text-blue-600">{statistics.totalFeedbacks}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Average Rating</h3>
              <p className="text-3xl font-bold text-green-600">{statistics.avgRating.toFixed(1)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">{statistics.pendingCount}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Reviewed</h3>
              <p className="text-3xl font-bold text-blue-600">{statistics.reviewedCount}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Resolved</h3>
              <p className="text-3xl font-bold text-green-600">{statistics.resolvedCount}</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 items-center justify-end w-full mb-4 px-10">
            <input
              type="text"
              placeholder="Filter by text"
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              className="border rounded p-2 min-w-[180px]"
            />
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="border rounded p-2 min-w-[160px]"
            >
              <option value="all">All Feedback</option>
              <option value="degree_application">From Students</option>
              <option value="course_posting">From Institutions</option>
              <option value="general">General</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border rounded p-2 min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={userTypeFilter}
              onChange={e => setUserTypeFilter(e.target.value)}
              className="border rounded p-2 min-w-[160px]"
            >
              <option value="all">All User Types</option>
              <option value="MedicalStudent">Medical Student</option>
              <option value="Doctor">Doctor</option>
              <option value="Recruiter">Recruiter</option>
              <option value="EducationalInstitute">Educational Institute</option>
              <option value="Admin">Admin</option>
            </select>
            <select
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              className="border rounded p-2"
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars & up</option>
              <option value={3}>3 Stars & up</option>
              <option value={2}>2 Stars & up</option>
              <option value={1}>1 Star & up</option>
            </select>
          </div>

          {/* Feedback List */}
          <div className="bg-white rounded-none shadow-none divide-y divide-gray-200 pl-10">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No feedbacks found.</div>
            ) : (
              filteredFeedbacks.map(fb => (
                <div key={fb._id} className="flex flex-col md:flex-row items-start md:items-center gap-2 px-6 py-4">
                  <div className="flex items-center gap-3 mb-1">
                    {/* Profile Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-gray-200">
                      {getInitials(fb.userName || 'Anonymous')}
                    </div>
                    <span className="font-semibold text-gray-800 truncate">{fb.userName || 'Anonymous'}</span>
                    <span className="text-xs text-gray-400 ml-auto">{formatDate(fb.createdAt)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} className={`w-4 h-4 ${star <= fb.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-base font-medium text-gray-700 truncate">{fb.heading}</span>
                    </div>
                    <div className="text-gray-700 text-sm break-words mb-2">{fb.feedback}</div>
                    <div className="flex gap-2 text-xs mb-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {getSourceDisplayName(fb.source)}
                      </span>
                      <span className={`px-2 py-1 rounded ${
                        fb.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        fb.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {getStatusDisplayName(fb.status)}
                      </span>
                      {fb.userType && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {fb.userType}
                        </span>
                      )}
                      {fb.sourceDetails && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded truncate max-w-[200px]" title={fb.sourceDetails}>
                          {fb.sourceDetails}
                        </span>
                      )}
                    </div>
                    {fb.adminResponse && (
                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 mb-2">
                        <strong>Admin Response:</strong> {fb.adminResponse}
                      </div>
                    )}
                    {/* Admin Actions */}
                    <div className="flex gap-2">
                      <select
                        value={fb.status}
                        onChange={(e) => updateFeedbackStatus(fb._id, e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button
                        onClick={() => {
                          const response = prompt('Enter admin response (optional):');
                          if (response !== null) {
                            updateFeedbackStatus(fb._id, fb.status, response);
                          }
                        }}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Add Response
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbacks; 