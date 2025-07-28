import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Await, useNavigate } from 'react-router-dom';
import RecruiterViewPopup from '../UserManagement/RecruiterViewPopup';
import JobApplicationTable from './JobApplicationTable';
import { Link } from 'react-router-dom';


interface JobViewPopupProps {
  job: {
    _id: string;
    jobId: string;
    title: string;
    department: string;
    recruiterId: string;
    jobType: string;
    hospitalName: string;
    location: string;
    description: string;
    requirements: string;
    salaryRange?: string;
    status: string;
    postedDate: string;
    applicationDeadline: string;
  };
  onClose: () => void;
  onDelete?: (jobId: string) => void;
}



type Recruiter = {
  _id: string;
  email: string;
  role: string;
  companyName: string;
  companyType: string;
  position: string;
  contactNumber: string;
  photoUrl?: string;
  school?: string;
  location?: string;
  bio?: string;
  higherEducation?: string;
  status?: string;
  deletedAt?: string;

};






function JobViewPopup({ job, onClose, onDelete }: JobViewPopupProps) {


  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [showRecruiterPopup, setShowRecruiterPopup] = useState(false);
  const [applicantCount, setApplicantCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchRecruiters = async () => {

      try {
        const res = await axios.get(`http://localhost:3000/api/admin/recruiters/${job.recruiterId}`);
        setRecruiter(res.data)
      } catch (error) {
        console.error('Error fetching recruiter:', error);
      }
    }

    fetchRecruiters();

  }, []);




  useEffect(() => {

    const applicantCount = async () => {
      const res = await axios.get(`http://localhost:3000/api/admin/applicantscount/${job._id}`);
      setApplicantCount(res.data.applicants);
    }

    applicantCount();

  }, []);




  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ backgroundColor: '#0000006f' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header with avatar */}
        <div className="px-8 py-6 border-b border-gray-200 flex items-start space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
            {job.title.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
                <p className="text-sm text-gray-500">{job.hospitalName} • {job.department}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Scrollable content */}
        <div className="p-8 space-y-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <input type="text" value={job.jobType} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={job.location} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input type="text" value={job.status} disabled className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 ${job.status === 'OPEN' ? 'text-green-700' : job.status === 'CLOSED' ? 'text-gray-700' : 'text-blue-700'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" value={job.department} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
              <input type="text" value={job.hospitalName} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            {job.salaryRange && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <input type="text" value={job.salaryRange} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posted Date</label>
              <input type="text" value={new Date(job.postedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input type="text" value={new Date(job.applicationDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">Job Applications</label>

              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" >
                <Link to={`/admin/job-applicants/${job._id}`}>
                  <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">
                    {applicantCount} Applicants
                  </button>
                </Link>
              </div>


            </div>
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter</label>

              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" >
                <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer" onClick={() => setShowRecruiterPopup(true)}>
                  {recruiter?.companyName}
                </button>
              </div>


            </div>
          </div>
          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea value={job.description || 'No description Found'} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 resize-none" rows={10} />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>




            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" >
              <dl className=" list-inside pt-2   space-y-1 pl-4">
                {job.requirements.split('\n').map((requirement, index) => (
                  <p key={index} className="">{requirement}</p>
                ))}
              </dl>

            </div>

          </div>
        </div>
        {/* Footer with actions */}
        <div className="px-8 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={() => {
              if (onDelete) {
                onDelete(job._id);
              }
              onClose();
            }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
      {/* Render RecruiterViewPopup over JobViewPopup */}
      {showRecruiterPopup && recruiter && (
        <RecruiterViewPopup
          recruiter={recruiter}
          onClose={() => setShowRecruiterPopup(false)}
          onDelete={() => { }}
        />
      )}
    </div>
  );
}

export default JobViewPopup;