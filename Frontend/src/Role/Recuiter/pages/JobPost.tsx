"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaCheckSquare, FaRegSquare } from "react-icons/fa"
import Sidebar from "../components/NavBar/Sidebar"
import { useState } from "react"

const formSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job title is required" }),
  department: z.string().min(2, { message: "Department is required" }),
  hospitalName: z.string().min(2, { message: "Hospital name is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  jobType: z.string().min(1, { message: "Job type is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  requirements: z.string().min(10, { message: "Requirements must be at least 10 characters" }),
  salary: z.string().optional(),
  urgent: z.boolean().default(false),
})

export default function JobPostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      department: "",
      hospitalName: "",
      location: "",
      jobType: "",
      description: "",
      requirements: "",
      salary: "",
      urgent: false,
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      alert("Job post submitted successfully!")
      form.reset()
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div>
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-64">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden my-8">
          <div className="bg-[#184389] px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Post a Medical Position</h2>
            <p className="text-sm text-white">Create a new job posting for doctors at your hospital</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Job Title</label>
                <input
                  type="text"
                  {...register("jobTitle")}
                  placeholder="e.g. Cardiologist"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle.message}</p>}
              </div>
              <div>
                <label className="block font-medium">Department</label>
                <select {...register("department")} className="w-full border rounded px-3 py-2">
                  <option value="">Select department</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="emergency">Emergency Medicine</option>
                  <option value="endocrinology">Endocrinology</option>
                  <option value="gastroenterology">Gastroenterology</option>
                  <option value="general-surgery">General Surgery</option>
                  <option value="hematology">Hematology</option>
                  <option value="neurology">Neurology</option>
                  <option value="obstetrics">Obstetrics & Gynecology</option>
                  <option value="urology">Urology</option>
                  <option value="other">Other</option>
                </select>
                {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block font-medium">Job Type</label>
                <select {...register("jobType")} className="w-full border rounded px-3 py-2">
                  <option value="">Select job type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="locum">Locum</option>
                </select>
                {errors.jobType && <p className="text-red-500 text-sm">{errors.jobType.message}</p>}
              </div>
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
                {...register("salary")}
                placeholder="e.g. $200,000 - $250,000"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center space-x-3 border rounded p-4">
              <button type="button" onClick={() => setValue("urgent", !watch("urgent"))} className="text-xl">
                {watch("urgent") ? <FaCheckSquare className="text-blue-600" /> : <FaRegSquare />}
              </button>
              <div>
                <label className="font-medium cursor-pointer">Urgent Hiring</label>
                <p className="text-sm text-gray-500">Mark this position as urgent to prioritize in listings</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#184389] text-white font-semibold py-2 rounded transition-all ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-800"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
