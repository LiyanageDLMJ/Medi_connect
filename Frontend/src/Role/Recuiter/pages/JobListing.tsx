"use client"

import type React from "react"

import { useState } from "react"
import NavBar from "../components/NavBar/NavBar"
import { FaBuilding, FaEdit, FaTrashAlt } from "react-icons/fa"

type Job = {
  id: number
  title: string
  hospital: string
  date: string
  location: string
  type: string
  salary: string
  status: string
}

const JobListing = () => {
  // Current hospital
  const currentHospital = "Mayo Clinic"

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      title: "Cardiologist",
      hospital: "Mayo Clinic",
      date: "2025-04-10",
      location: "USA",
      type: "Full-Time",
      salary: "$200,000",
      status: "Open",
    },
    {
      id: 2,
      title: "Pediatrician",
      hospital: "Mayo Clinic",
      date: "2025-04-05",
      location: "Canada",
      type: "Part-Time",
      salary: "$120,000",
      status: "Closed",
    },
  ])

  const [newJob, setNewJob] = useState<Omit<Job, "id">>({
    title: "",
    hospital: currentHospital,
    date: "",
    location: "",
    type: "",
    salary: "",
    status: "",
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  // Filter jobs for current hospital
  const hospitalJobs = jobs.filter((job) => job.hospital === currentHospital)
  const openJobs = hospitalJobs.filter((job) => job.status === "Open").length

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingJob) {
      setEditingJob({ ...editingJob, [e.target.name]: e.target.value })
    } else {
      setNewJob({ ...newJob, [e.target.name]: e.target.value })
    }
  }

  const handleAddJob = () => {
    if (Object.values(newJob).some((field) => field === "")) {
      alert("Please fill in all fields")
      return
    }
    setJobs([...jobs, { id: jobs.length + 1, ...newJob }])
    setNewJob({
      title: "",
      hospital: currentHospital,
      date: "",
      location: "",
      type: "",
      salary: "",
      status: "",
    })
    setShowAddForm(false)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setShowAddForm(true)
  }

  const handleUpdateJob = () => {
    if (!editingJob) return
    setJobs(jobs.map((job) => (job.id === editingJob.id ? editingJob : job)))
    setEditingJob(null)
    setShowAddForm(false)
  }

  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id))
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Manage Job Postings</h2>

        {/* Hospital Card */}
        <div className="mb-4 p-4 border rounded-lg shadow bg-white">
          <div className="flex items-center mb-2">
            <FaBuilding className="mr-2 text-blue-500" />
            <h3 className="text-lg font-semibold">{currentHospital}</h3>
          </div>
          <p className="text-sm">
            Total Jobs: {hospitalJobs.length} | Open Positions: {openJobs}
          </p>
        </div>

        {/* Job List Table */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Job Listings</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Salary</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitalJobs.map((job) => (
                <tr key={job.id} className="border">
                  <td className="border p-2">{job.title}</td>
                  <td className="border p-2">{job.date}</td>
                  <td className="border p-2">{job.location}</td>
                  <td className="border p-2">{job.type}</td>
                  <td className="border p-2">{job.salary}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        job.status === "Open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEditJob(job)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg mr-1"
                    >
                      <FaEdit className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg"
                    >
                      <FaTrashAlt className="inline mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Job Button */}
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4">
            Add New Job
          </button>
        )}

        {/* Add/Edit Job Form */}
        {showAddForm && (
          <div className="mb-4 p-4 border rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{editingJob ? "Edit Job" : "Add New Job"}</h3>
            <input
              name="title"
              value={editingJob ? editingJob.title : newJob.title}
              onChange={handleChange}
              placeholder="Job Title"
              className="border p-2 m-2 w-full"
            />
            <input
              name="date"
              value={editingJob ? editingJob.date : newJob.date}
              onChange={handleChange}
              placeholder="Posting Date (YYYY-MM-DD)"
              className="border p-2 m-2 w-full"
            />
            <input
              name="location"
              value={editingJob ? editingJob.location : newJob.location}
              onChange={handleChange}
              placeholder="Location"
              className="border p-2 m-2 w-full"
            />
            <input
              name="type"
              value={editingJob ? editingJob.type : newJob.type}
              onChange={handleChange}
              placeholder="Job Type (Full-Time, Part-Time)"
              className="border p-2 m-2 w-full"
            />
            <input
              name="salary"
              value={editingJob ? editingJob.salary : newJob.salary}
              onChange={handleChange}
              placeholder="Salary"
              className="border p-2 m-2 w-full"
            />
            <input
              name="status"
              value={editingJob ? editingJob.status : newJob.status}
              onChange={handleChange}
              placeholder="Status (Open/Closed)"
              className="border p-2 m-2 w-full"
            />
            <div>
              <button
                onClick={editingJob ? handleUpdateJob : handleAddJob}
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg mr-2"
              >
                {editingJob ? "Update Job" : "Add Job"}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingJob(null)
                }}
                className="bg-gray-500 text-white px-4 py-2 mt-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobListing
