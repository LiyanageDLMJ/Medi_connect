import  { useState } from "react";
import * as React from "react";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

// Mock feedback data
const feedbacks = [
  {
    id: "1",
    user: "John Doe",
    rating: 4,
    heading: "Smooth Process",
    comment: "Great application process, very smooth!",
    date: "2024-06-01"
  },
  {
    id: "2",
    user: "Anonymous",
    rating: 5,
    heading: "Excellent Experience",
    comment: "Loved the experience, easy to use.",
    date: "2024-06-02"
  },
  {
    id: "3",
    user: "Jane Smith",
    rating: 3,
    heading: "Could be clearer",
    comment: "Some steps were confusing, but overall good.",
    date: "2024-06-03"
  },
  {
    id: "4",
    user: "Michael Brown",
    rating: 2,
    heading: "Needs Improvement",
    comment: "The process was slow and not intuitive.",
    date: "2024-06-04"
  },
  {
    id: "5",
    user: "Emily White",
    rating: 5,
    heading: "Fantastic Support",
    comment: "Support team was very helpful!",
    date: "2024-06-05"
  },
  {
    id: "6",
    user: "Chris Green",
    rating: 1,
    heading: "Disappointing",
    comment: "Had issues with the application, not satisfied.",
    date: "2024-06-06"
  },
  {
    id: "7",
    user: "Anonymous",
    rating: 4,
    heading: "Good but can improve",
    comment: "Overall good, but some features are missing.",
    date: "2024-06-07"
  },
  {
    id: "8",
    user: "Sarah Lee",
    rating: 5,
    heading: "Loved it!",
    comment: "Very user-friendly and efficient.",
    date: "2024-06-08"
  },
  {
    id: "9",
    user: "John Doe",
    rating: 3,
    heading: "Average Experience",
    comment: "It was okay, nothing special.",
    date: "2024-06-09"
  },
  {
    id: "10",
    user: "Priya Kumar",
    rating: 2,
    heading: "Could be better",
    comment: "Faced some technical issues during the process.",
    date: "2024-06-10"
  },
  {
    id: "11",
    user: "Jane Smith",
    rating: 5,
    heading: "Perfect!",
    comment: "Everything worked perfectly, highly recommend.",
    date: "2024-06-11"
  },
  {
    id: "12",
    user: "Michael Brown",
    rating: 4,
    heading: "Very Good",
    comment: "Good experience overall, would use again.",
    date: "2024-06-12"
  }
];

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0][0];
  return names[0][0] + names[names.length - 1][0];
};

const Feedbacks: React.FC = () => {
  // Filter state
  const [userFilter, setUserFilter] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [userDropdown, setUserDropdown] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 5;

  // Unique users for dropdown
  const uniqueUsers = Array.from(new Set(feedbacks.map(fb => fb.user)));

  // Filtered feedbacks
  const filteredFeedbacks = feedbacks.filter(fb =>
    (userDropdown === "" || fb.user === userDropdown) &&
    (userFilter === "" || fb.user.toLowerCase().includes(userFilter.toLowerCase()) || fb.comment.toLowerCase().includes(userFilter.toLowerCase()) || fb.heading.toLowerCase().includes(userFilter.toLowerCase())) &&
    (minRating === 0 || fb.rating >= minRating)
  );

  // Summary calculations (use filteredFeedbacks for stats)
  const totalReviews = filteredFeedbacks.length;
  const averageRating = totalReviews === 0 ? 0 : (filteredFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / totalReviews);
  const ratingCounts = [1, 2, 3, 4, 5].map(r => filteredFeedbacks.filter(fb => fb.rating === r).length);

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * feedbacksPerPage,
    currentPage * feedbacksPerPage
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [userFilter, minRating, userDropdown]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 overflow-auto "> {/* Add padding for sidebar */}
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-0 bg-white">
          <h1 className="text-2xl font-bold mb-6 pt-8 pl-10">User Feedbacks</h1>
          {/* Filter Bar and Summary in White Card, filter first */}
          <div className="w-full bg-white rounded-none shadow-none p-0 mb-0">
            {/* Filter Bar (right-aligned, first line) */}
            <div className="flex flex-wrap gap-4 items-center justify-end w-full mb-4 px-8">
              <input
                type="text"
                placeholder="Filter by text"
                value={userFilter}
                onChange={e => setUserFilter(e.target.value)}
                className="border rounded p-2 min-w-[180px]"
              />
              <select
                value={userDropdown}
                onChange={e => setUserDropdown(e.target.value)}
                className="border rounded p-2 min-w-[160px]"
              >
                <option value="">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
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
            {/* Enhanced Summary Section (full width, second line) */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-x-8 w-full px-8 md:px-40 pb-4 mb-8">
              {/* Total Reviews */}
              <div className="flex flex-col items-start text-left min-w-[120px] py-2 pt-10 md:col-span-2 pl-2">
                <span className="text-gray-500 text-lg mb-1">Total Reviews</span>
                <div className="flex items-center gap-2">
                  <span className="text-6xl font-extrabold text-gray-900">{totalReviews}</span>
                  {/* Example growth badge, static for now */}
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">5% <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg></span>
                </div>
                <span className="text-xs text-gray-400 mt-1">Growth in feedbacks on this year</span>
              </div>
              {/* Average Rating */}
              <div className="flex flex-col items-start text-left min-w-[180px] py-2 pt-10 border-l border-gray-200 md:col-span-2 pl-8">
                <span className="text-gray-500 text-lg mb-1">Average Rating</span>
                <div className="flex items-center gap-2">
                  <span className="text-6xl font-extrabold text-gray-900">{averageRating.toFixed(1)}</span>
                  <div className="flex items-center">
              {[1,2,3,4,5].map(star => (
                      <svg key={star} className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              ))}
            </div>
                </div>
                <span className="text-xs text-gray-400 mt-1">Average rating on this year</span>
              </div>
              {/* Rating Distribution Bar (span 2 columns on md+) */}
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
          {/* Feedback List (no extra card, white background) */}
          <div className="bg-white rounded-none shadow-none divide-y divide-gray-200 pl-10">
            {paginatedFeedbacks.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No feedbacks found.</div>
            ) : (
              paginatedFeedbacks.map(fb => (
                <div key={fb.id} className="flex flex-col md:flex-row items-start md:items-center gap-2 px-6 py-4">
                  <div className="flex items-center gap-3 mb-1">
                    {/* Profile Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-gray-200">
                      {getInitials(fb.user)}
                    </div>
                    <span className="font-semibold text-gray-800 truncate">{fb.user}</span>
                    <span className="text-xs text-gray-400 ml-auto">{fb.date}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} className={`w-4 h-4 ${star <= fb.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-base font-medium text-gray-700 truncate">{fb.heading}</span>
                    </div>
                    <div className="text-gray-700 text-sm break-words">{fb.comment}</div>
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