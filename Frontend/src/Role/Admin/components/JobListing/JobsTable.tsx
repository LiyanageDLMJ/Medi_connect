import React, { useState, useEffect } from 'react';
import JobViewPopup from './JobViewPopup';

type Job = {
  _id: string;
  jobId: string;
  title: string;
  department: string;
  jobType: string;
  hospitalName: string;
  location: string;
  description: string;
  requirements: string;
  salaryRange?: string;
  status: string;
  postedDate: string;
  urgent: boolean;
};

function JobsTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const jobsPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch(() => setError('Something went wrong'));
  }, []);

  // Handle Search Button Click
  const handleSearch = () => {
    setSearch(searchInput.trim());
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle Sort Button Click
  const handleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1); // Reset to first page on sort
  };

  // Function to handle opening job view popup
  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
  };

  // Function to close job view popup
  const handleCloseJobView = () => {
    setSelectedJob(null);
  };

  // Filter jobs by search term
  const filteredJobs = jobs.filter((job) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.department.toLowerCase().includes(term) ||
      job.hospitalName.toLowerCase().includes(term)
    );
  });

  // Sort jobs by postedDate
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const dateA = new Date(a.postedDate).getTime();
    const dateB = new Date(b.postedDate).getTime();
    return sortDirection === 'asc' ? dateB - dateA :  dateA - dateB;
  });

  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const startIdx = (currentPage - 1) * jobsPerPage;
  const endIdx = startIdx + jobsPerPage;
  const jobsToDisplay = sortedJobs.slice(startIdx, endIdx);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative w-96">
            <div className='absolute inset-y-0 left-0 pl-3 flex w-96 items-center'>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="block w-full pl-5 pr-3 mr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search About Jobs"
              />
              <button
                className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                onClick={handleSearch}
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Right-side controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Sort Button */}
            <button
              className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSort}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
              </svg>
               Sort {sortDirection === 'asc' ? 'Descending' : ' Ascending'}
            </button>
            {/* Export Button (unchanged) */}
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hospital
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobsToDisplay.map((job) => (
              <tr key={job._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      {job.title.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.jobType}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.hospitalName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === "OPEN"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                      }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                    onClick={() => handleViewJob(job)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {jobsToDisplay.length} of {sortedJobs.length} jobs
          </div>
          <div className="flex space-x-1">
            <button
              className="px-3 py-1  rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded-md  cursor-pointer border border-gray-300 ${currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded-md  cursor-pointer border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Job View Popup */}
      {selectedJob && (
        <JobViewPopup 
          job={selectedJob} 
          onClose={handleCloseJobView} 
        />
      )}
    </>
  );
}

export default JobsTable;