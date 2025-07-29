import React, { useState } from 'react';
import axios from 'axios';

// Define User type to match the type in InstituteMgtTable
type User = {
  _id: string;
  email: string;
  contactPhone?: string;
  location?: string;
  name?: string;
  instituteName?: string;
  establishedYear?: number;
  userType: string;
  description?: string;
  status?: string;
  photoUrl?: string;
  bio?: string;
  higherEducation?: string;
  instituteType?: string;
  accreditation?: string;
  deletedAt?: string | Date | null;
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
      // Call backend to soft delete (remove) institute
      await axios.delete(`http://localhost:3000/api/admin/institutes/${user._id}`);
      if (onDelete) {
        onDelete(user._id);
      }
      onClose();
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to remove institute'
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Remove institute error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
  };

  return (
    <div className="fixed rounded-xl  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: '#0000006f' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-0 relative flex flex-col" style={{ maxHeight: '90vh' }}>
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
        <div className="p-8 pb-0 flex items-center space-x-4 ">
            {editableUser.photoUrl && (
              <div className="flex flex-col items-center py-2">
                <img src={editableUser.photoUrl} alt="Institute" className="h-20 w-20 object-cover rounded-full border" />
              </div>
            )}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.email}</h2>
            <p className="text-sm text-gray-500">{user.userType}</p>
          </div>
        </div>
        {/* Scrollable Content */}
        <div className="overflow-y-auto p-8 space-y-6" style={{ maxHeight: '65vh' }}>
          {/* User Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                disabled={true}
                value={editableUser.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            {/* Institute Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
              <input
                type="text"
                name="instituteName"
                disabled={true}
                value={editableUser.instituteName || editableUser.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            
            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                disabled={true}
                value={editableUser.contactPhone || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                disabled={true}
                value={editableUser.location || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            {/* Established Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
              <input
                type="number"
                name="establishedYear"
                disabled={true}
                value={editableUser.establishedYear || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input
                type="text"
                name="status"
                disabled={true}
                value={editableUser.status || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            {/* Higher Education */}

            {/* Institute Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute Type</label>
              <input
                type="text"
                name="instituteType"
                disabled={true}
                value={editableUser.instituteType || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            {/* Accreditation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation</label>
              <input
                type="text"
                name="accreditation"
                disabled={true}
                value={editableUser.accreditation || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            {/* Deleted At */}

          </div>
          {/* Photo Preview */}

          {/* Bio */}
          <div className='w-full'>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              disabled={true}
              value={editableUser.bio || ''}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            ></textarea>
          </div>
          {/* Description */}

        </div>
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-8 mb-2" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 px-8 pb-8  bg-white sticky bottom-0 z-10">
          <>


            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isDeleting ? 'Removing...' : 'Delete Institute'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>

          </>
        </div>
      </div>
    </div>
  );
}

export default InstituteViewPopup;