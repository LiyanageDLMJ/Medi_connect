import { FaCalendarAlt, FaMapMarkerAlt, FaBriefcase, FaHospital, FaMoneyBillAlt } from "react-icons/fa";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

  interface Job {
    id: number;
    title: string;
    hospital: string;
    date: string;
    location: string;
    type: string;
    salary: string;
    status: string;
    statusColor: string;
  }

  interface JobsProps {
    jobs: Job[];
    totalJobs: number;
  }

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
            key={job.id}
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
                  <FaHospital className="text-gray-500" /> {job.hospital}
                </p>
              </div>
            </div>

            {/* Job Details */}
            <div className="mt-4 text-gray-600">
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" /> {job.date}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-500" /> {job.location}
              </p>
              <p className="flex items-center gap-2">
                <FaBriefcase className="text-gray-500" /> {job.type}
              </p>
              <p className="flex items-center gap-2">
                <FaMoneyBillAlt className="text-gray-500" /> {job.salary}
              </p>
            </div>

            {/* Status Label */}
            <span className={`inline-block mt-3 px-3 py-1 text-white text-sm font-semibold rounded ${job.statusColor}`}>
              {job.status}
            </span>

            {/* Buttons */}
            <div className="mt-4 flex gap-4">
              <button className="btn btn-details">Details</button>
              <button className="btn btn-apply" onClick={()=>navigate ("/physician/job-application")}>Apply</button>
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
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      hospital: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      salary: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      statusColor: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalJobs: PropTypes.number.isRequired,
};

export default Jobs;

