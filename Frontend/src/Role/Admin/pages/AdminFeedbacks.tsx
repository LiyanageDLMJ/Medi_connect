import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// Hardcoded feedbacks: some from system, some from higher education
const feedbacks = [
  // System feedbacks
  {
    id: "s1",
    user: "System Monitor",
    rating: 5,
    heading: "System Stable",
    comment: "No downtime reported in the last 30 days.",
    date: "2024-06-01",
    source: "system"
  },
  {
    id: "s2",
    user: "Admin Bot",
    rating: 4,
    heading: "Update Successful",
    comment: "Platform update deployed without issues.",
    date: "2024-06-02",
    source: "system"
  },
  {
    id: "s3",
    user: "System Monitor",
    rating: 3,
    heading: "Minor Glitch",
    comment: "Brief lag detected, auto-resolved.",
    date: "2024-06-03",
    source: "system"
  },
  // Higher education feedbacks (copied from higherEducation)
  {
    id: "1",
    user: "John Doe",
    rating: 4,
    heading: "Smooth Process",
    comment: "Great application process, very smooth!",
    date: "2024-06-01",
    source: "higherEducation"
  },
  {
    id: "2",
    user: "Anonymous",
    rating: 5,
    heading: "Excellent Experience",
    comment: "Loved the experience, easy to use.",
    date: "2024-06-02",
    source: "higherEducation"
  },
  {
    id: "3",
    user: "Jane Smith",
    rating: 3,
    heading: "Could be clearer",
    comment: "Some steps were confusing, but overall good.",
    date: "2024-06-03",
    source: "higherEducation"
  },
  {
    id: "4",
    user: "Michael Brown",
    rating: 2,
    heading: "Needs Improvement",
    comment: "The process was slow and not intuitive.",
    date: "2024-06-04",
    source: "higherEducation"
  },
  {
    id: "5",
    user: "Emily White",
    rating: 5,
    heading: "Fantastic Support",
    comment: "Support team was very helpful!",
    date: "2024-06-05",
    source: "higherEducation"
  }
];

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0][0];
  return names[0][0] + names[names.length - 1][0];
};

const AdminFeedbacks: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'higherEducation'>('all');
  const [userFilter, setUserFilter] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 5;

  // Filtered feedbacks
  const filteredFeedbacks = feedbacks.filter(fb =>
    (filter === 'all' || fb.source === 'higherEducation') &&
    (userFilter === "" || fb.user.toLowerCase().includes(userFilter.toLowerCase()) || fb.comment.toLowerCase().includes(userFilter.toLowerCase()) || fb.heading.toLowerCase().includes(userFilter.toLowerCase())) &&
    (minRating === 0 || fb.rating >= minRating)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * feedbacksPerPage,
    currentPage * feedbacksPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, userFilter, minRating]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Topbar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-0 bg-white">
          <h1 className="text-4xl font-bold mb-2 pt-4 pl-10">Feedbacks</h1>
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 items-center justify-end w-full mb-4 px-8">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as 'all' | 'higherEducation')}
              className="border rounded p-2 min-w-[180px]"
            >
              <option value="all">All Feedback</option>
              <option value="higherEducation">Higher Education Only</option>
            </select>
            <input
              type="text"
              placeholder="Filter by text"
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              className="border rounded p-2 min-w-[180px]"
            />
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
            {paginatedFeedbacks.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No feedbacks found.</div>
            ) : (
              paginatedFeedbacks.map(fb => (
                <div key={fb.id} className="flex flex-col md:flex-row items-start md:items-center gap-2 px-6 py-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-gray-200">
                      {getInitials(fb.user)}
                    </div>
                    <span className="font-semibold text-gray-800 truncate">{fb.user}</span>
                    <span className="text-xs text-gray-400 ml-auto">{fb.date}</span>
                    {fb.source === 'system' && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-300 text-xs rounded-full text-gray-700">System</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{fb.heading}</div>
                    <div className="text-gray-700 mt-1">{fb.comment}</div>
                    <div className="flex items-center mt-1">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} className={`w-5 h-5 ${star <= fb.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbacks; 