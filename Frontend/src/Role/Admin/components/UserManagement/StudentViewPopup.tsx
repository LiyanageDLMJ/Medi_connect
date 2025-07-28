import React, { useState } from 'react';
import axios from 'axios';

// Define User type to match the type in StudentMgtTable
type User = {
  _id: string;
  email: string;
  userType: 'Doctor' | 'MedicalStudent' | 'Recruiters' | 'EducationalInstitute';
  currentInstitute: string;
  yearOfStudy?: number;
  fieldOfStudy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  location?: string;
  status?: string;
  higherEducation?: string;
  bio?: string;
  photoUrl?: string;
  age?: number;
};

interface UserViewPopupProps {
  user: User;
  onClose: () => void;
  onDelete?: (userId: string) => void;
}

function StudentViewPopup({ user, onClose, onDelete }: UserViewPopupProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await axios.patch(`http://localhost:3000/api/admin/medicalStudent/${user._id}`);
      if (onDelete) onDelete(user._id);
      onClose();
    } catch (err: any) {
      setError('Failed to remove student.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ backgroundColor: '#0000006f' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header with avatar */}
        <div className="px-8 py-6 border-b border-gray-200 flex items-start space-x-4">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt="Student Avatar"
              className="h-16 w-16 rounded-full object-cover border-2 border-blue-200 shadow"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.email}
                </h2>
                <p className="text-sm text-gray-500">{user.userType}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Scrollable content */}
        <div className="p-8 space-y-6 overflow-y-auto flex-grow custom-scrollbar" style={{ maxHeight: '60vh' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={user.email} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
              <input type="text" value={user.userType} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Institute</label>
              <input type="text" value={user.currentInstitute} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
              <input type="number" value={user.yearOfStudy || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
              <input type="text" value={user.fieldOfStudy || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={user.location || 'N/A'} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Higher Education</label>
              <input type="text" value={user.higherEducation || 'N/A'} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" value={user.age !== undefined && user.age !== null ? user.age : ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
              <input type="text" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
              <input type="text" value={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div>
              <span className="block text-xs text-gray-500">Status</span>
              <span className={`font-semibold text-sm ${user.status === 'REMOVED' ? 'text-red-600' : 'text-green-600'}`}>{user.status || 'ACTIVE'}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea value={user.bio || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 resize-none" rows={5} />
            </div>
          </div>
        </div>
        {/* Footer with action buttons */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <div></div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <style>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    background: #f1f1f1;
    border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
  }
`}</style>
    </div>
  );
}

export default StudentViewPopup;