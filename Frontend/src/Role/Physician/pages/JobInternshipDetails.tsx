"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Sidebar from "../components/NavBar/Sidebar"
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Pencil,
  Trash2,
  Save,
  X,
  Check,
} from "lucide-react"

const JobInternshipDetails = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState("")

  // Form state for editing
  const [editForm, setEditForm] = useState({
    title: "",
    hospitalName: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "",
    salaryRange: "",
    status: "",
    urgent: false,
  })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:3000/JobPost/viewJobs/${jobId}`)
        setJob(response.data)
        // Initialize edit form with current job data
        setEditForm({
          title: response.data.title || "",
          hospitalName: response.data.hospitalName || "",
          description: response.data.description || "",
          requirements: response.data.requirements || "",
          location: response.data.location || "",
          jobType: response.data.jobType || "",
          salaryRange: response.data.salaryRange || "",
          status: response.data.status || "Open",
          urgent: response.data.urgent || false,
        })
        setLoading(false)
      } catch (err: any) {
        setError("Failed to fetch job details. Please try again later.")
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  const goBack = () => {
    window.history.back()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditForm({
      ...editForm,
      [name]: value,
    })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setEditForm({
      ...editForm,
      [name]: checked,
    })
  }

  // Update the handleUpdateJob function to match the exact API endpoint format shown in Postman
  const handleUpdateJob = async () => {
    if (isEditing) {
      // Save the changes
      try {
        setUpdateError("")
        setUpdateSuccess(false)

        // Format the data to match what the API expects
        const jobData = {
          title: editForm.title,
          hospitalName: editForm.hospitalName,
          description: editForm.description,
          requirements: editForm.requirements,
          location: editForm.location,
          jobType: editForm.jobType,
          salaryRange: editForm.salaryRange,
          status: editForm.status,
          urgent: editForm.urgent,
        }

        // Use the exact endpoint format from Postman
        const response = await axios.put(`http://localhost:3000/JobPost/updateJobs/${jobId}`, jobData)

        if (response.data) {
          // Update the job with the response data
          setJob(response.data.job || response.data)
          setUpdateSuccess(true)
          setTimeout(() => setUpdateSuccess(false), 3000)
          setIsEditing(false)
        }
      } catch (err: any) {
        setUpdateError(err.response?.data?.message || "Failed to update job. Please try again.")
        console.error("Error updating job:", err)
      }
    } else {
      // Enter edit mode
      setIsEditing(true)
    }
  }

  const cancelEdit = () => {
    // Reset form to current job data
    setEditForm({
      title: job.title || "",
      hospitalName: job.hospitalName || "",
      description: job.description || "",
      requirements: job.requirements || "",
      location: job.location || "",
      jobType: job.jobType || "",
      salaryRange: job.salaryRange || "",
      status: job.status || "Open",
      urgent: job.urgent || false,
    })
    setIsEditing(false)
    setUpdateError("")
  }

  const handleDeleteJob = async () => {
    try {
      await axios.delete(`http://localhost:3000/JobPost/deleteJobs/${job._id}`)
      alert("Job deleted successfully")
      navigate("/jobs")
    } catch (err: any) {
      alert("Failed to delete job. Please try again.")
      console.error("Error deleting job:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto md:pl-64 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto md:pl-64 flex items-center justify-center">
          <div className="w-full max-w-md border rounded-lg shadow-sm bg-white">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-red-500">Error</h2>
            </div>
            <div className="p-4">
              <p>{error}</p>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={goBack}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 font-medium transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto md:pl-64 flex items-center justify-center">
          <div className="w-full max-w-md border rounded-lg shadow-sm bg-white">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Job Not Found</h2>
            </div>
            <div className="p-4">
              <p>The job you're looking for doesn't exist or has been removed.</p>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={goBack}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 font-medium transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-64 p-6 md:p-8">
        <button
          className="mb-6 flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100"
          onClick={goBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </button>

        {updateSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-800">
            <Check className="h-4 w-4" />
            Job updated successfully
          </div>
        )}

        {updateError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            {updateError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-6 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {isEditing ? (
                    <div className="w-full">
                      <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={editForm.title}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-1">
                          Hospital Name
                        </label>
                        <input
                          type="text"
                          id="hospitalName"
                          name="hospitalName"
                          value={editForm.hospitalName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            id="status"
                            name="status"
                            value={editForm.status}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                            <option value="Filled">Filled</option>
                          </select>
                        </div>
                        <div className="flex items-center mt-6">
                          <input
                            type="checkbox"
                            id="urgent"
                            name="urgent"
                            checked={editForm.urgent}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <label htmlFor="urgent" className="ml-2 block text-sm text-gray-700">
                            Mark as Urgent
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                        <p className="text-gray-500 mt-1 flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {job.hospitalName}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            job.status === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {job.status}
                        </span>
                        {job.urgent && (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Urgent
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <hr className="border-gray-200" />
              <div className="p-6">
                {isEditing ? (
                  <>
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-lg font-semibold mb-2">
                        Job Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={editForm.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="requirements" className="block text-lg font-semibold mb-2">
                        Requirements
                      </label>
                      <textarea
                        id="requirements"
                        name="requirements"
                        value={editForm.requirements}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                    <p className="text-gray-700 whitespace-pre-line mb-6">{job.description}</p>

                    <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                    <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Job Details</h2>
              </div>
              <div className="p-4 space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={editForm.location}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Type
                      </label>
                      <select
                        id="jobType"
                        name="jobType"
                        value={editForm.jobType}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 mb-1">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        id="salaryRange"
                        name="salaryRange"
                        value={editForm.salaryRange}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-gray-600">{job.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Job Type</h4>
                        <p className="text-gray-600">{job.jobType}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Salary Range</h4>
                        <p className="text-gray-600">{job.salaryRange}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Posted Date</h4>
                        <p className="text-gray-600">{formatDate(job.postedDate)}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Hospital Information</h2>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">{job.hospitalName}</h4>
                      <p className="text-gray-600 text-sm">{job.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white border rounded-lg shadow-sm mt-6">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Actions</h2>
              </div>
              <div className="p-4 space-y-3">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateJob}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-green-500 rounded-md text-white bg-green-500 hover:bg-green-600 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleUpdateJob}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                    Update Job
                  </button>
                )}

                {!isEditing &&
                  (showDeleteConfirm ? (
                    <div className="border border-red-200 rounded-md p-3 bg-red-50">
                      <p className="text-sm text-red-800 mb-3">
                        Are you sure you want to delete this job? This action cannot be undone.
                      </p>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="py-1 px-3 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 text-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteJob}
                          className="py-1 px-3 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Job
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobInternshipDetails
