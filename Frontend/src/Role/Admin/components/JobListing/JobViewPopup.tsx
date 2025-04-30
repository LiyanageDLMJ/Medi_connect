import React from 'react';


interface JobViewPopupProps {
  job: {
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
  };
  onClose: () => void;
}

function JobViewPopup({ job, onClose }: JobViewPopupProps) {
  return (
    <div className="fixed inset-0 overflow-y-scroll  flex items-center justify-center p-4 z-50" style={{backgroundColor: '#0000006f'}}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden  ">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-sm text-gray-500">
              {job.hospitalName} • {job.department}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Job Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Job Type</h3>
              <p className="mt-1 text-sm text-gray-900">{job.jobType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1 text-sm text-gray-900">{job.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                  job.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {job.status}
                </span>
              </p>
            </div>
          </div>

          {job.salaryRange && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Salary Range</h3>
              <p className="mt-1 text-sm text-gray-900">{job.salaryRange}</p>
            </div>
          )}

          {/* Job Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Job Description</h3>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{job.description ? job.description: "No description Found"}</p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Requirements</h3>
            <p className=" mt-1 text-sm text-gray-900 list-disc list-inside space-y-1" >
              {job.requirements.split('\n').map((requirement, index) => (
                <p key={index} >{requirement}</p>
              ))}
            </p>
          </div>

          {/* Posted Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Posted Date</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(job.postedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t  border-gray-200 flex justify-end">
        <button
           
            className="px-4 py-2 text-sm cursor-pointer me-3 font-medium text-white bg-red-600 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Delete
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobViewPopup;