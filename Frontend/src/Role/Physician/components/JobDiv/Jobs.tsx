import { FaCalendarAlt, FaMapMarkerAlt, FaBriefcase, FaHospital, FaMoneyBillAlt } from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

interface Job {
  jobId: string;
  title: string;
  hospitalName: string;
  postedDate: string;
  location: string;
  jobType: string;
  salaryRange: string;
  status: string;
  applicationDeadline: string;
}

interface JobsProps {
  jobs: Job[];
  totalJobs: number;
}

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "OPEN":
      return "bg-green-500";
    case "PENDING":
      return "bg-orange-500";
    case "INTERVIEW":
      return "bg-blue-900";
    case "CLOSED":
      return "bg-red-700";
    default:
      return "bg-gray-500";
  }
};

const Jobs: React.FC<JobsProps> = ({ jobs, totalJobs }) => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">
        Showing <span className="text-blue-600">{jobs.length}</span> of total{" "}
        <span className="text-blue-600">{totalJobs}</span> Doctor Jobs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.jobId} // Use jobId as the unique identifier from the backend
            className="bg-gray-100 shadow-lg rounded-lg p-6 transition duration-300 hover:bg-blue-200 hover:shadow-xl"
          >
            {/* Job Title & Hospital */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded">
                {job.title.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaHospital className="text-gray-500" /> {job.hospitalName}
                </p>
              </div>
            </div>

            {/* Job Details */}
            <div className="mt-4 text-gray-600">
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" />
                <span><strong>Posted Date:</strong> {new Date(job.postedDate).toLocaleDateString()}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-500" /> {job.location}
              </p>
              <p className="flex items-center gap-2">
                <FaBriefcase className="text-gray-500" /> {job.jobType}
              </p>
              <p className="flex items-center gap-2">
                <FaMoneyBillAlt className="text-gray-500" /> {job.salaryRange}
              </p>
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" />
                <span style={{ color: 'red', fontWeight: 'bold' }}>Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "N/A"}</span>
              </p>
            </div>

            {/* Status Label */}
            <span
              className={`inline-block mt-3 px-3 py-1 text-white text-sm font-semibold rounded ${getStatusColor(
                job.status
              )}`}
            >
              {job.status}
            </span>

            {/* Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                className="btn btn-details"
                onClick={() => navigate(`/physician/job-details/${job.jobId}`)} // Use jobId here as well
              >
                Details
              </button>
              <button 
                className="btn btn-apply" 
                onClick={() => navigate(`/physician/job-application/${job.jobId}`)}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Jobs.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      jobId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      hospitalName: PropTypes.string.isRequired,
      postedDate: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      jobType: PropTypes.string.isRequired,
      salaryRange: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalJobs: PropTypes.number.isRequired,
};

export default Jobs;