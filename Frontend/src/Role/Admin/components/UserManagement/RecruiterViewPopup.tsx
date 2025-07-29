import React, { useEffect, useState } from "react";

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

type RecruiterViewPopupProps = {
  recruiter: Recruiter;
  onClose: () => void;
  onDelete: (recruiterId: string) => void;
  onViewJobs?: (companyName: string) => void;
};

const RecruiterViewPopup: React.FC<RecruiterViewPopupProps> = ({ recruiter, onClose, onDelete, onViewJobs }) => {
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setJobCount(null);
    fetch(`http://localhost:3000/api/admin/recruiter/${recruiter._id}/jobcount`)
      .then(res => res.json())
      .then(data => {
        setJobCount(data.count);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch job count');
        setLoading(false);
      });
  }, [recruiter._id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "#0000006f" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header with avatar */}
        <div className="px-8 py-6 border-b border-gray-200 flex items-start space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold overflow-hidden">
            {recruiter.photoUrl ? (
              <img src={recruiter.photoUrl} alt="Recruiter" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{recruiter.companyName}</h2>
                <p className="text-sm text-gray-500">{recruiter.position}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" value={recruiter.companyName} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input type="text" value={recruiter.position} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
              <input type="text" value={recruiter.companyType} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input type="text" value={recruiter.contactNumber} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={recruiter.email} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>

            {recruiter.school && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <input type="text" value={recruiter.school} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
              </div>
            )}
            {recruiter.location && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={recruiter.location} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
              </div>
            )}
           
            {recruiter.bio && (
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea value={recruiter.bio} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" rows={3} />
              </div>
            )}
            {recruiter.status && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <input type="text" value={recruiter.status} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posted Jobs</label>
              
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
                <button
                  id="viewjobs"
                  className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer whitespace-nowrap text-sm font-medium"
                  onClick={() => {
                    if (onViewJobs) onViewJobs(recruiter.companyName);
                    onClose();
                  }}
                >
                  {loading ? 'Loading...' : error ? error : jobCount !== null ? jobCount + " Jobs" : ''}
                </button>
              </div>

            </div>
            {recruiter.deletedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deleted At</label>
                <input type="text" value={new Date(recruiter.deletedAt).toLocaleString()} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
              </div>
            )}

          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea value={recruiter.bio} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 resize-none" rows={5} />
            </div>
          </div>
        </div>
        {/* Footer with actions */}
        <div className="px-8 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => onDelete(recruiter._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterViewPopup; 