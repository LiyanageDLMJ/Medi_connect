"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import NavBar from "../components/NavBar/NavBar"


interface FormData {
  jobTitle: string
  hospital: string
  medicalField: string
  experienceRequired: string
  jobDescription: string
  qualifications: string
  applicationDeadline: string
  contactEmail: string
  contactPhone: string
  salary: string
  location: string
}

const initialFormData: FormData = {
  jobTitle: "",
  hospital: "",
  medicalField: "",
  experienceRequired: "",
  jobDescription: "",
  qualifications: "",
  applicationDeadline: "",
  contactEmail: "",
  contactPhone: "",
  salary: "",
  location: "",
}

function JobPostingForm({ formData, handleChange, handleSubmit }: any) {
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
            placeholder="e.g. Cardiologist, Nurse Practitioner"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hospital/Facility Name</label>
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
            placeholder="Enter hospital or facility name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medical Field</label>
          <select
            name="medicalField"
            value={formData.medicalField}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            <option value="">Select medical field</option>
            <option value="cardiology">Cardiology</option>
            <option value="dermatology">Dermatology</option>
            <option value="emergency">Emergency Medicine</option>
            <option value="family">Family Medicine</option>
            <option value="internal">Internal Medicine</option>
            <option value="neurology">Neurology</option>
            <option value="obstetrics">Obstetrics & Gynecology</option>
            <option value="oncology">Oncology</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="psychiatry">Psychiatry</option>
            <option value="radiology">Radiology</option>
            <option value="surgery">Surgery</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required</label>
          <select
            name="experienceRequired"
            value={formData.experienceRequired}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          >
            <option value="">Select required experience</option>
            <option value="entry">Entry Level (0-2 years)</option>
            <option value="junior">Junior (2-5 years)</option>
            <option value="mid">Mid-Level (5-8 years)</option>
            <option value="senior">Senior (8-12 years)</option>
            <option value="expert">Expert (12+ years)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
            placeholder="City, State"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
            placeholder="e.g. $120,000 - $180,000 per year"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          rows={5}
          required
          placeholder="Describe the job responsibilities, duties, and expectations..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications & Requirements</label>
        <textarea
          name="qualifications"
          value={formData.qualifications}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          rows={5}
          required
          placeholder="List required certifications, degrees, skills, and other qualifications..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
          <input
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
            placeholder="contact@hospital.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
            placeholder="(123) 456-7890"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          Post Job
        </button>
      </div>
    </form>
  )
}

export default function HospitalJobPostingForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Submitted Data:", formData)
    alert("Job Posting Submitted Successfully!")
  }

  return (
    <div>
      <NavBar />
      <div className="w-full bg-white-100 rounded-lg overflow-hidden shadow-lg ">
        <div className="bg-blue-600 py-8 px-6">
          <h2 className="text-2xl font-bold text-white text-center">Hospital Job Posting Form</h2>
          <p className="text-blue-100 text-center mt-2">Create a new job posting for medical professionals</p>
        </div>
        <JobPostingForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
      </div>
    </div>
  )
}

