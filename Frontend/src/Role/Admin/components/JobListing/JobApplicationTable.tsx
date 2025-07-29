import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

type jobIdUrl = {
  _id: string;
};


type applicants = {
  _id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  userType: "Doctor" | "MedicalStudent";
  photoUrl: string;
  school?: string;
  location?: string;
  bio?: string;
  higherEducation?: string;
  // MedicalStudent-specific fields
  currentInstitute?: string;
  yearOfStudy?: number;
  fieldOfStudy?: string;
  // Doctor-specific fields
  profession?: string;
  specialty?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};


type Job = {
  _id: string;
  jobId: string;
  title: string;
  department: string;
  jobType: string;
  recruiterId: string;
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


function JobApplicationTable() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState<applicants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // UI state for design
  const [searchInput, setSearchInput] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 10;
  const [profession, setProfession] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [currentInstitute, setCurrentInstitute] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [job, setJob] = useState<Job | null>(null);
  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:3000/api/admin/jobapplications/${jobId}`)
      .then(res => setApplicants(res.data))
      .catch(() => setError('Failed to fetch applicants'))
      .finally(() => setLoading(false));
  }, [jobId]);

  // Fetch job data
  useEffect(() => {
    if (!jobId) return;
    axios.get(`http://localhost:3000/api/admin/jobs/${jobId}`)
      .then(res => setJob(res.data))
      .catch(() => setJob(null));
  }, [jobId]);

  // Unique values for dropdowns
  const uniqueRoles = Array.from(new Set(applicants.map(a => a.userType))).filter(Boolean);
  const uniqueLocations = Array.from(new Set(applicants.map(a => a.location))).filter(Boolean);
  const uniqueProfessions = Array.from(new Set(applicants.map(a => a.profession))).filter(Boolean);
  const uniqueSpecialties = Array.from(new Set(applicants.map(a => a.specialty))).filter(Boolean);
  const uniqueInstitutes = Array.from(new Set(applicants.map(a => a.currentInstitute))).filter(Boolean);
  const uniqueYears = Array.from(new Set(applicants.map(a => a.yearOfStudy))).filter(Boolean);
  const uniqueFields = Array.from(new Set(applicants.map(a => a.fieldOfStudy))).filter(Boolean);

  // Filter and paginate (UI only, not functional logic)
  const filteredApplicants = applicants.filter(app => {
    const term = searchInput.trim().toLowerCase();
    const matchesSearch =
      !term ||
      app.email.toLowerCase().includes(term) ||
      app.name?.toLowerCase().includes(term);
    const matchesRole = !role || app.userType === role;
    const matchesLocation = !location || (app.location && app.location === location);
    // Doctor-specific filters
    const matchesProfession = !profession || app.profession === profession;
    const matchesSpecialty = !specialty || app.specialty === specialty;
    // MedicalStudent-specific filters
    const matchesInstitute = !currentInstitute || app.currentInstitute === currentInstitute;
    const matchesYear = !yearOfStudy || String(app.yearOfStudy) === yearOfStudy;
    const matchesField = !fieldOfStudy || app.fieldOfStudy === fieldOfStudy;
    // Apply filters based on role
    if (role === 'Doctor') {
      return matchesSearch && matchesRole && matchesLocation && matchesProfession && matchesSpecialty;
    } else if (role === 'MedicalStudent') {
      return matchesSearch && matchesRole && matchesLocation && matchesInstitute && matchesYear && matchesField;
    } else {
      return matchesSearch && matchesRole && matchesLocation;
    }
  });
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);
  const startIdx = (currentPage - 1) * applicantsPerPage;
  const endIdx = startIdx + applicantsPerPage;
  const applicantsToDisplay = filteredApplicants.slice(startIdx, endIdx);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}
      {/* Job Data Card - LinkedIn style */}

    <div className="p-6 bg-white rounded-lg shadow-sm">


        {job && (
          <div>
            <div className="mb-8 bg-white rounded-xl shadow border border-gray-200 flex flex-col md:flex-row p-0 overflow-hidden">
              {/* Left: Logo/Avatar */}

              {/* Right: Job Info */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex flex-col md:flex-row md:items-center   mb-2">
                  <div className="h-15   w-15 rounded-lg bg-blue-200 mr-4 flex items-center justify-center text-blue-700 text-3xl font-bold">
                    {job.title.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
                      <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm">
                        <span className="font-medium">{job.hospitalName}</span>
                        <span className="mx-1">•</span>
                        <span>{job.location}</span>
                        <span className="mx-1">•</span>
                        <span>{job.department}</span>
                        {job.salaryRange && <><span className="mx-1">•</span><span>Salary: {job.salaryRange}</span></>}
                      </div>
                    </div>

                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-gray-500 text-xs mb-2">
                  <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                  <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                  <span>Status: <span className={`font-semibold ${job.status === "OPEN" ? "text-blue-700" : "text-green-700"}`}>{job.status}</span></span>
                  <span>Type: {job.jobType}</span>
                  {job.urgent && <span className="text-red-600 font-semibold">Urgent</span>}
                </div>
                <div className="mt-2">
                  <h2 className="text-base font-semibold mt-5 text-gray-800 mb-1">About the job</h2>
                  <p className="text-gray-700 text-sm mb-2  whitespace-pre-line">{job.description || 'No description found.'}</p>
                  <h3 className="text-base font-semibold  mt-5 text-gray-800 mb-1">Requirements</h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm">
                    {job.requirements.split('\n').map((req, idx) => (
                      <p key={idx} className='text-gray-700 text-sm mb-2 whitespace-pre-line'>{req}</p>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto mb-8 p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-500">
          <div className="space-y-5 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Bar</label>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="block w-full pl-4 pr-3 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                <select
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  value={role}
                  onChange={e => {
                    setRole(e.target.value);
                    setProfession('');
                    setSpecialty('');
                    setCurrentInstitute('');
                    setYearOfStudy('');
                    setFieldOfStudy('');
                  }}
                >
                  <option value="">All</option>
                  {uniqueRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                >
                  <option value="">All</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              {/* Doctor-specific filters */}
              {role === 'Doctor' && (
                <>
                  <div className="min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                    <select
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      value={profession}
                      onChange={e => setProfession(e.target.value)}
                    >
                      <option value="">All</option>
                      {uniqueProfessions.map(prof => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                    <select
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      value={specialty}
                      onChange={e => setSpecialty(e.target.value)}
                    >
                      <option value="">All</option>
                      {uniqueSpecialties.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {/* MedicalStudent-specific filters */}
              {role === 'MedicalStudent' && (
                <>
                  <div className="min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Institute</label>
                    <select
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      value={currentInstitute}
                      onChange={e => setCurrentInstitute(e.target.value)}
                    >
                      <option value="">All</option>
                      {uniqueInstitutes.map(inst => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-[120px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                    <select
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      value={yearOfStudy}
                      onChange={e => setYearOfStudy(e.target.value)}
                    >
                      <option value="">All</option>
                      {uniqueYears.map(year => (
                        <option key={year} value={String(year)}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                    <select
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      value={fieldOfStudy}
                      onChange={e => setFieldOfStudy(e.target.value)}
                    >
                      <option value="">All</option>
                      {uniqueFields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setSearchInput('');
                  setRole('');
                  setLocation('');
                  setProfession('');
                  setSpecialty('');
                  setCurrentInstitute('');
                  setYearOfStudy('');
                  setFieldOfStudy('');
                }}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                onClick={() => setCurrentPage(1)}
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Apply Search
              </button>
            </div>
          </div>
        </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : applicantsToDisplay.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8">No applicants found.</td></tr>
            ) : applicantsToDisplay.map(app => (
            <tr key={app._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {app.photoUrl ? (
                    <img
                      src={app.photoUrl}
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold">
                      {app.name ? app.name.charAt(0).toUpperCase() : app.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-0">
                      <div className="text-sm font-medium text-gray-900">{app.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{app.userType}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.userType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Resume</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {startIdx + 1} to {Math.min(endIdx, filteredApplicants.length)} of {filteredApplicants.length} applicants
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded-md border border-gray-300 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
    </div>
    </>
  );
}

export default JobApplicationTable;