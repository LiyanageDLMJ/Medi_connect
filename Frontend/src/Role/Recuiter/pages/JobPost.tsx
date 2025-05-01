"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import Sidebar from "../components/NavBar/Sidebar";
import { useState } from "react";
import axios from "axios";

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
});

type FormData = z.infer<typeof formSchema>;

// Generic input field component
type FieldProps = {
  register: any;
  errors: any;
  name: keyof FormData;
  label: string;
  placeholder: string;
  type?: "text" | "textarea";
};

const FormField = ({ register, errors, name, label, placeholder, type = "text" }: FieldProps) => (
  <div>
    <label className="block font-medium">{label}</label>
    {type === "textarea" ? (
      <textarea
        {...register(name)}
        placeholder={placeholder}
        className="w-full border rounded px-3 py-2 min-h-[100px]"
      />
    ) : (
      <input
        type="text"
        {...register(name)}
        placeholder={placeholder}
        className="w-full border rounded px-3 py-2"
      />
    )}
    {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
  </div>
);

const TextField = (props: FieldProps) => <FormField {...props} type="text" />;
const TextAreaField = (props: FieldProps) => <FormField {...props} type="textarea" />;

// Form sections
type FormSectionProps = {
  register: any;
  errors: any;
  watch?: any;
  setValue?: any;
};

const BasicInfoSection = ({ register, errors }: FormSectionProps) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField register={register} errors={errors} name="jobId" label="Job ID" placeholder="e.g. 1001" />
      <TextField register={register} errors={errors} name="title" label="Job Title" placeholder="e.g. Cardiologist" />
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
    <TextField
      register={register}
      errors={errors}
      name="hospitalName"
      label="Hospital Name"
      placeholder="e.g. Memorial General Hospital"
    />
    <TextField register={register} errors={errors} name="location" label="Location" placeholder="e.g. New York, NY" />
  </>
);

const JobDetailsSection = ({ register, errors }: FormSectionProps) => (
  <>
    <TextAreaField
      register={register}
      errors={errors}
      name="description"
      label="Job Description"
      placeholder="Describe the responsibilities and duties of this position"
    />
    <TextAreaField
      register={register}
      errors={errors}
      name="requirements"
      label="Requirements"
      placeholder="List qualifications, experience, and credentials required"
    />
    <TextField
      register={register}
      errors={errors}
      name="salaryRange"
      label="Salary Range (Optional)"
      placeholder="e.g. $200,000 - $250,000"
    />
  </>
);

const UrgentHiringSection = ({ register, watch, setValue }: FormSectionProps) => (
  <div className="flex items-center space-x-3 border rounded p-4">
    <button type="button" onClick={() => setValue("urgent", !watch("urgent"))} className="text-xl">
      {watch("urgent") ? <FaCheckSquare className="text-blue-600" /> : <FaRegSquare />}
    </button>
    <div>
      <label className="font-medium cursor-pointer">Urgent Hiring</label>
      <p className="text-sm text-gray-500">Mark this position as urgent to prioritize in listings</p>
    </div>
  </div>
);

export default function JobPostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = form;

  const [message, setMessage] = useState("");

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);

    try {
      console.log("Submitting Job Data:", values); // Debug log
      const response = await axios.post("http://localhost:3000/JobPost/postJobs", values);
      setMessage("Job posted successfully!");
      console.log("Response:", response.data);
      reset();
    } catch (error: any) {
      setMessage("Failed to post job. Please try again.");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
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
            <BasicInfoSection register={register} errors={errors} />
            <JobDetailsSection register={register} errors={errors} />
            <UrgentHiringSection register={register} errors={errors} watch={watch} setValue={setValue} />
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
          {message && <p className="text-center text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
}
