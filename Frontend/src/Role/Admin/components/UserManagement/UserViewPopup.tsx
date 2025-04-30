import React, { useState } from 'react';

// Define User type to match the type in DocMgtTable
type User = {
  _id: string;
  email: string;
  userType: 'Doctor' | 'Nurse' | 'Admin' | 'Patient';
  profession: string;
  specialty?: string;
  location: string;
  higherEducation?: string;
  password?: string;
};

// Define props type
type UserViewPopupProps = {
  user: User;
  onClose: () => void;
  onDelete: (userId: string) => void;
};

export function UserViewPopup({ user: initialUser, onClose, onDelete }: UserViewPopupProps) {
  // Use initial user data as the starting state
  const [user, setUser] = useState<User>(initialUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving user:", user);
    // In a real app, you would call an API to update the user
    onClose(); // Close popup after saving
  };

  const handleDelete = () => {
    // Call the delete function passed from parent component
    onDelete(user._id);
    onClose(); // Close popup after delete
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center overflow-auto justify-center p-4 z-50" style={{backgroundColor: '#0000006f'}}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
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

        {/* Content - Scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-grow">
          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
            <select
              name="userType"
              value={user.userType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Admin">Admin</option>
              <option value="Patient">Patient</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
            <input
              type="text"
              name="profession"
              value={user.profession}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={user.specialty || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={user.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Higher Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Higher Education</label>
            <select
              name="higherEducation"
              value={user.higherEducation || 'no'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between flex-shrink-0">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Delete User
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserViewPopup;