import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/NavBar/Sidebar";

const JobInternshipDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching job details for jobId:", jobId); // Debug log
        const response = await axios.get(`http://localhost:3000/JobPost/viewJobs/${jobId}`);
        setJob(response.data);
        setLoading(false);
      } catch (err: any) {
        setError("Failed to fetch job details. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Sidebar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
        <p className="text-gray-600 mb-2">
          <strong>Hospital:</strong> {job.hospitalName}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Location:</strong> {job.location}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Job Type:</strong> {job.jobType}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Salary Range:</strong> {job.salaryRange}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Status:</strong> {job.status}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Description:</strong> {job.description}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Requirements:</strong> {job.requirements}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Posted Date:</strong> {new Date(job.postedDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Urgent:</strong> {job.urgent ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
};

export default JobInternshipDetails;