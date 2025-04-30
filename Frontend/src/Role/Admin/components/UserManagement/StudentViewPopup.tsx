import React, { useState } from 'react';

// Define User type to match the type in StudentMgtTable
type User = {
  _id: string;
  email: string;
  userType: 'Doctor' | 'MedicalStudent' | 'Recruiters' | 'EducationalInstitute';
  currentInstitute: string;
  yearOfStudy?: number;
  fieldOfStudy?: string;
  createdAt?: Date;
};

interface UserViewPopupProps {
  user: User;
  onClose: () => void;
  onDelete?: (userId: string) => void;
}

function StudentViewPopup({ user, onClose, onDelete }: UserViewPopupProps) {
  const [editableUser, setEditableUser] = useState<User>({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: '#0000006f' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center space-x-4   pb-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.email}</h2>
            <p className="text-sm text-gray-500">{user.userType}</p>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={editableUser.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Current Institute */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Institute</label>
            <input
              type="text"
              name="currentInstitute"
              value={editableUser.currentInstitute}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Year of Study */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
            <input
              type="number"
              name="yearOfStudy"
              value={editableUser.yearOfStudy || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Field of Study */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
            <input
              type="text"
              name="fieldOfStudy"
              value={editableUser.fieldOfStudy || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
            <input
              type="text"
              value={editableUser.createdAt ? new Date(editableUser.createdAt).toLocaleDateString() : 'N/A'}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">

          <>
          <button
              
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Update
            </button>

            <button
              
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete User
            </button>

          </>
        </div>
      </div>
    </div>
  );
}

export default StudentViewPopup;