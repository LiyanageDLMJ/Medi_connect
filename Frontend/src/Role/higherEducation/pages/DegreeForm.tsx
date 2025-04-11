import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type DegreeFormData = {
  degreeName: string;
  degreeLevel: "Bachelor" | "Master" | "PhD";
  mode: "Full-time" | "Part-time";
  duration: number;
  tuitionFee: number;
};

const DegreeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DegreeFormData>();

  const onSubmit: SubmitHandler<DegreeFormData> = (data) => {
    console.log("Submitted data:", data);
    // Send data to API or store it
    reset(); // clear the form
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Degree</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Degree Name */}
        <div>
          <label className="block font-medium">Degree Name</label>
          <input
            {...register("degreeName", { required: "Degree name is required" })}
            className="w-full border p-2 rounded"
            placeholder="e.g. Bachelor of Computer Science"
          />
          {errors.degreeName && (
            <p className="text-red-500 text-sm">{errors.degreeName.message}</p>
          )}
        </div>

        {/* Degree Level */}
        <div>
          <label className="block font-medium">Degree Level</label>
          <select
            {...register("degreeLevel", { required: true })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        {/* Mode */}
        <div>
          <label className="block font-medium">Mode of Study</label>
          <select
            {...register("mode", { required: true })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block font-medium">Duration (Years)</label>
          <input
            type="number"
            {...register("duration", {
              required: true,
              min: { value: 1, message: "Minimum duration is 1 year" },
            })}
            className="w-full border p-2 rounded"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm">{errors.duration.message}</p>
          )}
        </div>

        {/* Tuition Fee */}
        <div>
          <label className="block font-medium">Tuition Fee (LKR)</label>
          <input
            type="number"
            {...register("tuitionFee", {
              required: true,
              min: { value: 0, message: "Fee must be positive" },
            })}
            className="w-full border p-2 rounded"
          />
          {errors.tuitionFee && (
            <p className="text-red-500 text-sm">{errors.tuitionFee.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DegreeForm;
