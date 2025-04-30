import React, { useState, useEffect } from 'react';

type Job = {
  _id: string;
  jobId: string;
  title: string;
  department: string;
  jobType: string;
  hospitalName: string;
  location: string;
  description: string;
  requirements: string;
  salaryRange?: string;
  status: string;
  postedDate: string;
  urgent: boolean;
};

function Reports() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch(() => setError('Something went wrong'));
  }, []);

  return (
    <div>
      <h1>Job Reports</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            <strong>{job.title}</strong> - {job.department} - {job.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reports;
