import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  status?: 'Active' | 'Inactive' | 'REMOVED';
  deletedAt?: string | Date | null;
}

interface AdminViewPopupProps {
  admin: Admin;
  onClose: () => void;
  onUpdate: (admin: Admin) => void;
  onDelete: (adminId: string) => void;
}

const AdminViewPopup: React.FC<AdminViewPopupProps> = ({ admin, onClose, onUpdate, onDelete }) => {
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'REMOVED'>('Active');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setStatus((admin as any).status || 'Active');
  }, [admin]);
  
  const handleUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      // Call backend to update admin status
      await axios.put(`http://localhost:3000/api/admin/admins/${admin.email}`, {
        status: status
      });
      
      // Call the parent's onUpdate callback with the updated admin
      onUpdate({ ...admin, status });
      onClose();
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to update admin'
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Update admin error:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      // Call backend to soft delete admin
      await axios.patch(`http://localhost:3000/api/admin/admins/${admin._id}`);
      if (onDelete) {
        onDelete(admin._id);
      }
      onClose();
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to remove admin'
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Remove admin error:', err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ backgroundColor: '#0000006f' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header with avatar */}
        <div className="px-8 py-6 border-b border-gray-200 flex items-start space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
            {admin.firstName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {admin.firstName} {admin.lastName}
                </h2>
                <p className="text-sm text-gray-500">Admin</p>
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
        <div className="px-8 py-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={`${admin.firstName} ${admin.lastName}`} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={admin.email} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input type="text" value={admin.mobileNumber} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as 'Active' | 'Inactive' | 'REMOVED')} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                {/* <option value="REMOVED">Removed</option> */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input type="text" value={admin.streetAddress} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" value={admin.city} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" value={admin.country} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removing...' : 'Delete'}
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" 
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminViewPopup; 