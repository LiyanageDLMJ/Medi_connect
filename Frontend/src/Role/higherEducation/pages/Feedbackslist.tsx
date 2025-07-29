import  { useState, useEffect } from "react";
import * as React from "react";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

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

const Feedbacks: React.FC = () => {
  // State for feedback data
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [userFilter, setUserFilter] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [applicantTypeFilter, setApplicantTypeFilter] = useState("all"); // Add applicant type filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const feedbacksPerPage = 10;

  // Fetch feedbacks from backend
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      const headers: any = { 'Content-Type': 'application/json' };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Build query parameters
      const params = new URLSearchParams();
      params.append('source', 'degree_application'); // Always filter for degree application feedback
      params.append('page', currentPage.toString());
      params.append('limit', feedbacksPerPage.toString());

      const response = await fetch(`http://localhost:3000/feedback/list?${params.toString()}`, { headers });
      const data: FeedbackResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.success === false ? 'Failed to fetch feedbacks' : 'Network error');
      }

      setFeedbacks(data.feedbacks);
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
  }, [currentPage, applicantTypeFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Filter feedbacks based on text and rating
  const filteredFeedbacks = feedbacks.filter(fb =>
    (userFilter === "" || 
     (fb.userName && fb.userName.toLowerCase().includes(userFilter.toLowerCase())) ||
     fb.feedback.toLowerCase().includes(userFilter.toLowerCase()) ||
     fb.heading.toLowerCase().includes(userFilter.toLowerCase())) &&
    (minRating === 0 || fb.rating >= minRating) &&
    (applicantTypeFilter === "all" || fb.userType === applicantTypeFilter)
  );

  // Summary calculations (use filteredFeedbacks for stats)
  const totalReviews = filteredFeedbacks.length;
  const averageRating = totalReviews === 0 ? 0 : (filteredFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / totalReviews);
  const ratingCounts = [1, 2, 3, 4, 5].map(r => filteredFeedbacks.filter(fb => fb.rating === r).length);

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
      case 'degree_application': return 'Degree Application';
      case 'course_posting': return 'Course Posting';
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

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto md:ml-64">
          <TopBar />
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
        <div className="flex-1 overflow-auto md:ml-64">
          <TopBar />
          <div className="flex items-center justify-center h-full">
            <div className="text-red-600">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-64">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-0 bg-white">
          <h1 className="text-2xl font-bold mb-6 pt-8 pl-10">Student & Professional Feedback</h1>
          <p className="text-gray-600 mb-4 pl-10">Feedback from students and professionals who applied to your degree programs</p>
          
          {/* Filter Bar */}
          <div className="w-full bg-white rounded-none shadow-none p-0 mb-0">
            <div className="flex flex-wrap gap-4 items-center justify-end w-full mb-4 px-8">
              <input
                type="text"
                placeholder="Filter by text"
                value={userFilter}
                onChange={e => setUserFilter(e.target.value)}
                className="border rounded p-2 min-w-[180px]"
              />
              <select
                value={applicantTypeFilter}
                onChange={e => setApplicantTypeFilter(e.target.value)}
                className="border rounded p-2"
              >
                <option value="all">All Applicants</option>
                <option value="MedicalStudent">Medical Students</option>
                <option value="Doctor">Professional Doctors</option>
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

            {/* Enhanced Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-x-8 w-full px-8 md:px-40 pb-4 mb-8">
              {/* Total Reviews */}
              <div className="flex flex-col items-start text-left min-w-[120px] py-2 pt-10 md:col-span-2 pl-2">
                <span className="text-gray-500 text-lg mb-1">Total Applications</span>
                <div className="flex items-center gap-2">
                  <span className="text-6xl font-extrabold text-gray-900">{totalCount}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    {totalReviews} filtered
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1">Total applications with feedback</span>
              </div>
              
              {/* Average Rating */}
              <div className="flex flex-col items-start text-left min-w-[180px] py-2 pt-10 border-l border-gray-200 md:col-span-2 pl-8">
                <span className="text-gray-500 text-lg mb-1">Average Rating</span>
                <div className="flex items-center gap-2">
                  <span className="text-6xl font-extrabold text-gray-900">{averageRating.toFixed(1)}</span>
                  <div className="flex items-center">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-1">Average rating of filtered feedbacks</span>
              </div>
              
              {/* Rating Distribution Bar */}
              <div className="flex flex-col items-start text-left min-w-[180px] py-6 px-4 md:col-span-2 border-l border-gray-200 pl-8">
                <span className="text-gray-500 text-lg mb-2">Rating Distribution</span>
                <div className="flex flex-col gap-1 w-full">
                  {[5,4,3,2,1].map((star, idx) => (
                    <div key={star} className="flex items-center gap-2 w-full">
                      <span className="text-sm text-gray-700 w-4">{star}</span>
                      <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
                        <div
                          className={`h-2 rounded ${star === 5 ? 'bg-green-400' : star === 4 ? 'bg-blue-400' : star === 3 ? 'bg-yellow-400' : star === 2 ? 'bg-orange-400' : 'bg-red-400'}`}
                          style={{ width: `${totalReviews === 0 ? 0 : (ratingCounts[star-1] / totalReviews) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right ml-auto">{ratingCounts[star-1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                    <span className="text-xs text-gray-400">{formatDate(fb.createdAt)}</span>
                    <span className="text-base font-medium text-gray-700">{fb.heading}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} className={`w-4 h-4 ${star <= fb.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-gray-700 text-sm break-words mb-2">{fb.feedback}</div>
                    <div className="flex gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        fb.userType === 'MedicalStudent' ? 'bg-green-100 text-green-700' :
                        fb.userType === 'Doctor' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {fb.userType === 'MedicalStudent' ? 'Medical Student' :
                         fb.userType === 'Doctor' ? 'Professional Doctor' :
                         fb.userType || 'Unknown'}
                      </span>
                      {fb.sourceDetails && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded truncate max-w-[200px]" title={fb.sourceDetails}>
                          {fb.sourceDetails.replace('After submitting application for ', '').split(' at ')[0]}
                        </span>
                      )}
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

export default Feedbacks; 