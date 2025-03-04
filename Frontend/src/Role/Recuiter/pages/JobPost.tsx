import { useState, type ChangeEvent, type FormEvent } from "react"


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
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = true,
  options = [],
  rows = 5,
}: {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  type?: string
  placeholder?: string
  required?: boolean
  options?: string[]
  rows?: number
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required={required}
          aria-label={label}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          rows={rows}
          required={required}
          placeholder={placeholder}
          aria-label={label}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required={required}
          placeholder={placeholder}
          aria-label={label}
        />
      )}
    </div>
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-blue-500 py-6 px-8">
          <h2 className="text-2xl font-bold text-white text-center">Hospital Job Posting Form</h2>
          <p className="text-blue-100 text-center mt-2">Create a new job posting for medical professionals</p>
        </div>

        <form onSubmit={handleSubmit} className="py-8 px-8 space-y-6">
          <FormField
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="e.g. Cardiologist, Nurse Practitioner"
          />
          <FormField
            label="Hospital/Facility Name"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            placeholder="Enter hospital or facility name"
          />
          <FormField
            label="Medical Field"
            name="medicalField"
            value={formData.medicalField}
            onChange={handleChange}
            type="select"
            options={[
              "cardiology",
              "dermatology",
              "emergency",
              "family",
              "internal",
              "neurology",
              "obstetrics",
              "oncology",
              "pediatrics",
              "psychiatry",
              "radiology",
              "surgery",
              "other",
            ]}
          />
          <FormField
            label="Experience Required"
            name="experienceRequired"
            value={formData.experienceRequired}
            onChange={handleChange}
            type="select"
            options={[
              "entry",
              "junior",
              "mid",
              "senior",
              "expert",
            ]}
          />
          <FormField
            label="Job Description"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            type="textarea"
            placeholder="Describe the job responsibilities, duties, and expectations..."
          />
          <FormField
            label="Qualifications & Requirements"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            type="textarea"
            placeholder="List required certifications, degrees, skills, and other qualifications..."
          />
          <FormField
            label="Application Deadline"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleChange}
            type="date"
          />
          <FormField
            label="Contact Email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            type="email"
            placeholder="contact@hospital.com"
          />
          <FormField
            label="Contact Phone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            type="tel"
            placeholder="(123) 456-7890"
          />
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

