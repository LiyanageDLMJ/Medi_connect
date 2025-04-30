import React, { useState } from 'react';
import axios from 'axios';

// Define User type to match the type in InstituteMgtTable
type User = {
  _id: string;
  email: string;   
  contactPhone?: string;
  location?: string;
  name?: string;
  establishedYear?: number;
  userType: string;
  description?: string;
};

interface UserViewPopupProps {
  user: User;
  onClose: () => void;
  onDelete?: (userId: string) => void;
}

function InstituteViewPopup({ user, onClose, onDelete }: UserViewPopupProps) {
  const [editableUser, setEditableUser] = useState<User>({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      // Call backend to delete user
      await axios.delete(`http://localhost:3000/api/admin/users/${user._id}`);
      
      // Call parent component's delete handler if provided
      if (onDelete) {
        onDelete(user._id);
      }
      
      // Close the popup
      onClose();
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Failed to delete institute' 
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Delete institute error:', err);
    } finally {
      setIsDeleting(false);
    }
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
        <div className="flex items-center space-x-4 pb-4">
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
               
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Institute Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
            <input
              type="text"
              name="name"
              value={editableUser.name || ''}
              onChange={handleChange}
               
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              name="contactPhone"
              value={editableUser.contactPhone || ''}
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
              value={editableUser.location || ''}
              onChange={handleChange}
               
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Established Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
            <input
              type="number"
              name="establishedYear"
              value={editableUser.establishedYear || ''}
              onChange={handleChange}
               
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

         
        </div>
        <div className='w-full'>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={editableUser.description || ''}
               
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
               
            ></textarea>
          </div>
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

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

export default InstituteViewPopup;