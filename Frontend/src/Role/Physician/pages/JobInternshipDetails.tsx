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
} from "lucide-react"

const JobInternshipDetails = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:3000/JobPost/viewJobs/${jobId}`)
        setJob(response.data)
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

  // No edit or delete functions needed

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

  // No role checking needed

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

        {/* No update messages needed */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-6 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
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
                
                </div>
              </div>
              <hr className="border-gray-200" />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                <p className="text-gray-700 whitespace-pre-line mb-6">{job.description}</p>

                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
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

            {/* Actions section completely removed */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobInternshipDetails