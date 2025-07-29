import React, { useState, useEffect } from 'react';
import JobViewPopup from './JobViewPopup';

type Job = {
  _id: string;
  jobId: string;
  title: string;
  department: string;
  jobType: string;
  recruiterId: string
  hospitalName: string;
  location: string;
  description: string;
  requirements: string;
  salaryRange?: string;
  status: string;
  postedDate: string;
  applicationDeadline: string;
  urgent: boolean;
};

function JobsTable({ selectedCompanyName, setSelectedCompanyName }: { selectedCompanyName?: string, setSelectedCompanyName?: (name: string) => void }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobType, setJobType] = useState('');
  const [department, setDepartment] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchApplied, setSearchApplied] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  // Get unique values for dropdowns
  const uniqueDepartments = Array.from(new Set(jobs.map(j => j.department))).filter(Boolean);
  const uniqueHospitals = Array.from(new Set(jobs.map(j => j.hospitalName))).filter(Boolean);
  const uniqueLocations = Array.from(new Set(jobs.map(j => j.location))).filter(Boolean);
  const uniqueJobTypes = Array.from(new Set(jobs.map(j => j.jobType))).filter(Boolean);
  const uniqueStatuses = Array.from(new Set(jobs.map(j => j.status))).filter(Boolean).filter(status => status !== "REMOVED");

  const jobsPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/jobs')
      .then((res) => res.json())
      .then((data) => {
        // Filter out jobs with status "REMOVED"
        const activeJobs = data.filter((job: Job) => job.status !== "REMOVED");
        setJobs(activeJobs);
      })
      .catch(() => setError('Something went wrong'));
  }, []);

  useEffect(() => {
    if (selectedCompanyName && selectedCompanyName !== hospitalName) {
      setHospitalName(selectedCompanyName);
      setSearchApplied(true);
      let filtered = jobs.filter((job) => job.hospitalName === selectedCompanyName && job.status !== "REMOVED");
      setFilteredJobs(filtered);
      setCurrentPage(1);
    }
    // Optionally, clear the filter if selectedCompanyName is empty
    // else if (selectedCompanyName === "") {
    //   setHospitalName("");
    //   setFilteredJobs([]);
    //   setSearchApplied(false);
    // }
  }, [selectedCompanyName, jobs]);

  // Handle Search Button Click
  const handleSearch = () => {
    setSearchApplied(true);
    let filtered = jobs.filter((job) => {
      // First, exclude removed jobs
      if (job.status === "REMOVED") {
        return false;
      }
      
      const term = searchInput.trim().toLowerCase();
      const matchesSearch =
        !term ||
        job.title.toLowerCase().includes(term) ||
        job.hospitalName.toLowerCase().includes(term) ||
        job.department.toLowerCase().includes(term);
      const matchesJobType = !jobType || job.jobType === jobType;
      const matchesDepartment = !department || job.department === department;
      const matchesHospital = !hospitalName || job.hospitalName === hospitalName;
      const matchesLocation = !location || job.location === location;
      const matchesStatus = !status || job.status === status;
      return matchesSearch && matchesJobType && matchesDepartment && matchesHospital && matchesLocation && matchesStatus;
    });
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleCancel = () => {
    setSearchInput('');
    setJobType('');
    setDepartment('');
    setHospitalName('');
    setLocation('');
    setStatus('');
    setFilteredJobs([]);
    setSearchApplied(false);
    setCurrentPage(1);
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

  // Function to handle job deletion
  const handleDeleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the job from the local state
        setJobs(jobs.filter(job => job._id !== jobId));
        setFilteredJobs(filteredJobs.filter(job => job._id !== jobId));
        
        // Show success message
        setDeleteMessage('Job has been successfully removed!');
        
        // Clear the message after 3 seconds
        setTimeout(() => {
          setDeleteMessage('');
        }, 10000);
      } else {
        console.error('Failed to delete job');
        setDeleteMessage('Failed to remove job. Please try again.');
        setTimeout(() => {
          setDeleteMessage('');
        }, 10000);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setDeleteMessage('Error removing job. Please try again.');
      setTimeout(() => {
        setDeleteMessage('');
      }, 3000);
    }
  };

  // Filter jobs by search term
  const jobsList = searchApplied ? filteredJobs : jobs;
  const filteredJobsBySearch = jobsList.filter((job) => true); // placeholder, now jobsList is already filtered
  const sortedJobs = [...filteredJobsBySearch].sort((a, b) => {
    const dateA = new Date(a.postedDate).getTime();
    const dateB = new Date(b.postedDate).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
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
      
      {/* Success/Error Message */}
      {deleteMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          deleteMessage.includes('successfully') 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            {deleteMessage.includes('successfully') ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{deleteMessage}</span>
          </div>
        </div>
      )}

      <div className="p-6 bg-white rounded-lg shadow-sm">
        {/* Advanced Search Section */}
        <div className="mx-auto mb-10 p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, hospital, or department"
                className="block w-full pl-4 pr-3 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All types</option>
                {uniqueJobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">All departments</option>
                {uniqueDepartments.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
            {/* Hospital Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
              >
                <option value="">All hospitals</option>
                {uniqueHospitals.map((hosp) => (
                  <option key={hosp} value={hosp}>{hosp}</option>
                ))}
              </select>
            </div>
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">All locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                {uniqueStatuses.map(stat => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-blue-200">
            <button className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
              onClick={handleSort}
            >
              <svg
                className="w-4 h-4 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {sortDirection === 'asc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                )}
              </svg>
              Sort {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </button>
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors" onClick={handleSearch}>
              Apply Search
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
          onDelete={handleDeleteJob}
        />
      )}
    </>
  );
}

export default JobsTable;