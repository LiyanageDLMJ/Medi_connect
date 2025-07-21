"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEdit, FaTrash, FaExclamationCircle, FaCheckSquare, FaRegSquare, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import Sidebar from "../components/NavBar/Sidebar";

// Job interface to match the database schema
interface Job {
  _id: string;
  jobId: string;
  title: string;
  department: string;
  hospitalName: string;
  location: string;
  jobType: string;
  description: string;
  requirements: string;
  salaryRange?: string;
  urgent: boolean;
  createdAt: string;
  applicationDeadline?: string;
}

// Form validation schema using Zod
const formSchema = z.object({
  jobId: z.string().min(1, { message: "Job ID is required" }),
  title: z.string().min(2, { message: "Job title is required" }),
  department: z.string().min(2, { message: "Department is required" }),
  hospitalName: z.string().min(2, { message: "Hospital name is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  jobType: z.string().min(1, { message: "Job type is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  requirements: z.string().min(10, { message: "Requirements must be at least 10 characters" }),
  salaryRange: z.string().optional(),
  urgent: z.boolean().default(false),
  applicationDeadline: z.string().min(1, { message: "Application deadline is required" }),
});

type FormData = z.infer<typeof formSchema>;

export default function JobManagement() {
  // Router for navigation
  const router = {
    push: (path: string) => {
      window.location.href = path;
    }
  };

  // State for view mode
  const [currentView, setCurrentView] = useState<'list' | 'edit'>('list');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Job listing states
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Edit job states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');

  // Recruiter profile state
  const [recruiterProfile, setRecruiterProfile] = useState<{ companyName?: string; photoUrl?: string }>({});

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobId: "",
      title: "",
      department: "",
      hospitalName: "",
      location: "",
      jobType: "",
      description: "",
      requirements: "",
      salaryRange: "",
      urgent: false,
      applicationDeadline: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  // Check if edit mode from URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('edit-job')) {
      const jobId = path.split('/').pop();
      if (jobId) {
        setCurrentView('edit');
        setSelectedJobId(jobId);
      }
    } else {
      setCurrentView('list');
      fetchJobs();
    }
  }, []);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch job data for editing
  useEffect(() => {
    if (currentView === 'edit' && selectedJobId) {
      fetchJobById(selectedJobId);
    }
  }, [currentView, selectedJobId]);

  // Fetch all jobs
  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (userId) headers['x-user-id'] = userId;
      const response = await axios.get("http://localhost:3000/JobPost/viewJobs", { headers });
      if (!response.data) {
        throw new Error('No data received');
      }
      setJobs(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch job listings. Please try again.");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single job by ID
  const fetchJobById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3000/JobPost/viewJobs/${id}`);
      const jobData = response.data;

      // Set all form values
      Object.keys(jobData).forEach((key) => {
        if (form.formState.defaultValues && key in form.formState.defaultValues) {
          setValue(key as keyof FormData, jobData[key]);
        }
      });
      // Set applicationDeadline if present
      if (jobData.applicationDeadline) {
        setValue("applicationDeadline", jobData.applicationDeadline.split("T")[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load job data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Transition to edit mode
  const handleEdit = (jobId: string) => {
    if (!jobId) {
      setError("Invalid job ID");
      return;
    }
    
    // Update URL without page reload
    window.history.pushState({}, '', `/edit-job/${jobId}`);
    setSelectedJobId(jobId);
    setCurrentView('edit');
  };

  // Delete job confirmation
  const confirmDelete = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  // Delete job
  const handleDelete = async () => {
    if (!jobToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await axios.delete(`http://localhost:3000/JobPost/deleteJobs/${jobToDelete}`);
      if (response.status === 200) {
        setJobs(jobs.filter(job => job._id !== jobToDelete));
        setShowDeleteModal(false);
        setJobToDelete(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete job. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Submit updated job
  const onSubmit = async (values: FormData) => {
    if (!selectedJobId) return;
    
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.put(`http://localhost:3000/JobPost/updateJobs/${selectedJobId}`, values);
      setMessage("Job updated successfully!");
      
      // Wait 1 second then return to listings
      setTimeout(() => {
        window.history.pushState({}, '', '/job-listings');
        setCurrentView('list');
        fetchJobs();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Back to listing
  const backToListing = () => {
    window.history.pushState({}, '', '/job-listings');
    setCurrentView('list');
    setSelectedJobId(null);
    reset();
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      job.department?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      job.hospitalName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
    const matchesJobType = jobTypeFilter === 'all' || job.jobType === jobTypeFilter;
    
    return matchesSearch && matchesDepartment && matchesJobType;
  });

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] to-[#e3eafc] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 md:sticky md:top-0 md:h-screen z-10">
        <Sidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto" style={{ maxHeight: '100vh' }}>
        <div className="flex justify-end items-center p-4">
          <img
            src={recruiterProfile.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
            className="w-10 h-10 rounded-full mr-2"
            alt="Profile"
          />
          <span className="font-semibold text-gray-700">{recruiterProfile.companyName || "Recruiter"}</span>
        </div>
        {/* JOB LISTINGS VIEW */}
        {currentView === 'list' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Job Listings</h1>
              <button
                onClick={() => router.push('/recruiter/JobPost')}
                className="bg-[#184389] text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Post New Job
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              {/* Search bar */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by title, department, or hospital..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Department Filter */}
                <div className="relative min-w-[200px]">
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  >
                    <option value="all">All Departments</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Emergency">Emergency Medicine</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Nephrology">Nephrology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Obstetrics">Obstetrics & Gynecology</option>
                    <option value="Urology">Urology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Job Type Filter */}
                <div className="relative min-w-[180px]">
                  <select
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  >
                    <option value="all">All Job Types</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                
                {/* Clear Filters Button */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDepartmentFilter('all');
                    setJobTypeFilter('all');
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              </div>
              
              {/* Results count and active filters */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  Showing {filteredJobs.length} of {jobs.length} jobs
                  {departmentFilter !== 'all' && (
                    <span className="ml-2">
                      • Department: <span className="font-semibold">{departmentFilter}</span>
                    </span>
                  )}
                  {jobTypeFilter !== 'all' && (
                    <span className="ml-2">
                      • Type: <span className="font-semibold">{jobTypeFilter}</span>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="ml-2">
                      • Search: <span className="font-semibold">"{searchTerm}"</span>
                    </span>
                  )}
                </div>
                
                {/* Quick filter tags */}
                <div className="flex items-center gap-2">
                  {(departmentFilter !== 'all' || jobTypeFilter !== 'all' || searchTerm) && (
                    <span className="text-xs text-gray-500">Active filters:</span>
                  )}
                  {departmentFilter !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {departmentFilter}
                      <button
                        onClick={() => setDepartmentFilter('all')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {jobTypeFilter !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {jobTypeFilter}
                      <button
                        onClick={() => setJobTypeFilter('all')}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-1 text-gray-600 hover:text-gray-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500"></div>
                <p className="mt-2 text-gray-600">Loading job listings...</p>
              </div>
            ) : (
              <>
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No job listings found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => (
                      <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                                {job.title}
                              </h2>
                              <p className="text-sm text-gray-600">{job.hospitalName} • {job.location}</p>
                            </div>
                            {job.urgent && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded flex items-center">
                                <FaExclamationCircle className="mr-1" /> Urgent
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {job.department}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {job.jobType}
                            </span>
                            {job.salaryRange && (
                              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                {job.salaryRange}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-700">Description:</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Posted: {job.createdAt ? formatDate(job.createdAt) : 'N/A'}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(job.jobId)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit job"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => confirmDelete(job._id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete job"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* EDIT JOB VIEW */}
        {currentView === 'edit' && (
          <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden my-8">
            <div className="bg-[#184389] px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">Edit Job Posting</h2>
                <p className="text-sm text-white">Update the details for this job posting</p>
              </div>
              <button 
                onClick={backToListing}
                className="text-white hover:text-gray-200"
              >
                <FaArrowLeft /> <span className="sr-only">Back to listings</span>
              </button>
            </div>

            {isLoading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500"></div>
                <p className="mt-2 text-gray-600">Loading job data...</p>
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p>{error}</p>
                  <button 
                    onClick={backToListing} 
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Return to listings
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium">Job ID</label>
                      <input 
                        type="text"
                        {...register("jobId")}
                        placeholder="e.g. 1001"
                        className="w-full border rounded px-3 py-2"
                      />
                      {errors.jobId && <p className="text-red-500 text-sm">{errors.jobId.message}</p>}
                    </div>
                    <div>
                      <label className="block font-medium">Job Title</label>
                      <input 
                        type="text"
                        {...register("title")}
                        placeholder="e.g. Cardiologist"
                        className="w-full border rounded px-3 py-2"
                      />
                      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium">Department</label>
                      <select {...register("department")} className="w-full border rounded px-3 py-2">
                        <option value="">Select department</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Emergency">Emergency Medicine</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Gastroenterology">Gastroenterology</option>
                        <option value="Pulmonology">Pulmonology</option>
                        <option value="Nephrology">Nephrology</option>
                        <option value="Endocrinology">Endocrinology</option>
                        <option value="Obstetrics">Obstetrics & Gynecology</option>
                        <option value="Urology">Urology</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
                    </div>
                    <div>
                      <label className="block font-medium">Job Type</label>
                      <select {...register("jobType")} className="w-full border rounded px-3 py-2">
                        <option value="">Select job type</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Internship">Internship</option>
                      </select>
                      {errors.jobType && <p className="text-red-500 text-sm">{errors.jobType.message}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-medium">Hospital Name</label>
                    <input 
                      type="text"
                      {...register("hospitalName")}
                      placeholder="e.g. Memorial General Hospital"
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors.hospitalName && <p className="text-red-500 text-sm">{errors.hospitalName.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block font-medium">Location</label>
                    <input 
                      type="text"
                      {...register("location")}
                      placeholder="e.g. New York, NY"
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                  </div>
                  <div>
                    <label className="block font-medium">Application Deadline</label>
                    <input
                      type="date"
                      {...register("applicationDeadline")}
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors.applicationDeadline && <p className="text-red-500 text-sm">{errors.applicationDeadline.message}</p>}
                  </div>
                </div>
                
                {/* Job Details Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium">Job Description</label>
                    <textarea
                      {...register("description")}
                      placeholder="Describe the responsibilities and duties of this position"
                      className="w-full border rounded px-3 py-2 min-h-[100px]"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block font-medium">Requirements</label>
                    <textarea
                      {...register("requirements")}
                      placeholder="List qualifications, experience, and credentials required"
                      className="w-full border rounded px-3 py-2 min-h-[100px]"
                    />
                    {errors.requirements && <p className="text-red-500 text-sm">{errors.requirements.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block font-medium">Salary Range (Optional)</label>
                    <input 
                      type="text"
                      {...register("salaryRange")}
                      placeholder="e.g. $200,000 - $250,000"
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors.salaryRange && <p className="text-red-500 text-sm">{errors.salaryRange.message}</p>}
                  </div>
                </div>
                
                {/* Urgent Hiring Section */}
                <div className="flex items-center space-x-3 border rounded p-4">
                  <button type="button" onClick={() => setValue("urgent", !watch("urgent"))} className="text-xl">
                    {watch("urgent") ? <FaCheckSquare className="text-blue-600" /> : <FaRegSquare />}
                  </button>
                  <div>
                    <label className="font-medium cursor-pointer">Urgent Hiring</label>
                    <p className="text-sm text-gray-500">Mark this position as urgent to prioritize in listings</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={backToListing}
                    className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded transition-all hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 bg-[#184389] text-white font-semibold py-2 rounded transition-all ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-800"
                    }`}
                  >
                    {isSubmitting ? "Updating..." : "Update Job"}
                  </button>
                </div>
                
                {message && (
                  <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {message}
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            {error && (
              <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                {error}
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setError(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium rounded bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium rounded bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}