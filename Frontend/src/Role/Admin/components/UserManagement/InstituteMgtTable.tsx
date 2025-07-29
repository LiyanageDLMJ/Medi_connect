import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InstituteViewPopup from './InstituteViewPopup';
import { FaSort, FaFileExport } from 'react-icons/fa';

// Define User type based on AdminInstitute schema
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
  accreditation?: string; // Added accreditation field
  photoUrl?: string; // Added photoUrl field
};

function InstituteMgtTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [accreditation, setAccreditation] = useState(''); // Added accreditation state

  const usersPerPage = 10;

  const fetchInstitutes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/admin/institutes');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to fetch institutes'
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Fetch institutes error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setCurrentPage(1);
    // Advanced search: filter users based on all criteria
    let filtered = users.filter((user) => {
      const term = searchInput.trim().toLowerCase();
      const matchesSearch =
        !term ||
        user.email.toLowerCase().includes(term) ||
        user.instituteName?.toLowerCase().includes(term) ||
        user.name?.toLowerCase().includes(term) ||
        user.location?.toLowerCase().includes(term) ||
        user.contactPhone?.toLowerCase().includes(term);
      const matchesLocation = !location || user.location === location;
      const matchesYear = !establishedYear || (user.establishedYear && user.establishedYear.toString() === establishedYear);
      const matchesAccreditation = !accreditation || user.accreditation === accreditation;
      return matchesSearch && matchesLocation && matchesYear && matchesAccreditation;
    });
    setFilteredUsers(filtered);
  };

  const handleCancel = () => {
    setSearchInput('');
    setLocation('');
    setEstablishedYear('');
    setAccreditation('');
    setSearch('');
    setFilteredUsers([]); // Show all users
    setCurrentPage(1);
  };

  // Handle Sort Button Click
  const handleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1); // Reset to first page on sort
  };

  // Function to handle opening user view popup
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewPopupOpen(true);
  };

  const handleCloseUserView = () => {
    setSelectedUser(null);
    setIsViewPopupOpen(false);
  };

  // Function to delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      // Implement delete logic here
      // For now, we'll just filter out the user
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
      setIsViewPopupOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Filter users by search term
  const filteredUsersList = filteredUsers.length > 0 || search || location || establishedYear || accreditation ? filteredUsers : users;

  // Sort users by email
  const sortedUsers = [...filteredUsersList].sort((a, b) => {
    const emailA = a.email.toLowerCase();
    const emailB = b.email.toLowerCase();
    return sortDirection === 'asc'
      ? emailA.localeCompare(emailB)
      : emailB.localeCompare(emailA);
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const endIdx = startIdx + usersPerPage;
  const usersToDisplay = sortedUsers.slice(startIdx, endIdx);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Error dismissal function
  const dismissError = () => {
    setError(null);
  };

  const uniqueLocations = Array.from(new Set(users.map(u => u.location))).filter(Boolean);
  const uniqueEstablishedYears = Array.from(new Set(users.map(u => u.establishedYear))).filter(Boolean);
  const uniqueAccreditations = Array.from(new Set(users.map(u => u.accreditation))).filter(Boolean);

  // CSV export utility
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportInstitutes = () => {
    // Use all institutes, not just paginated/filtered
    const dataToExport = filteredUsersList.map(user => ({
      'Email': user.email,
      'Name': user.name || '',
      'Institute Name': user.instituteName || '',
      'Location': user.location || '',
      'Contact Phone': user.contactPhone || '',
      'Established Year': user.establishedYear || '',
      'User Type': user.userType || '',
      'Description': user.description || '',
      'Accreditation': user.accreditation || '',
      'Photo URL': user.photoUrl || ''
    }));
    exportToCSV(dataToExport, 'institutes');
  };

  return (
    <>
      {/* Error Handling */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={dismissError}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}


      <div className="p-6 bg-white rounded-lg shadow-sm">
        {/* Advanced Search Section */}
        <div className="mx-auto mb-10 p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-100">
          <div className="flex justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Bar</label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, or location"
                className="block w-full pl-4 pr-3 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-between gap-4 mb-8">
            {/* Location */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Select location</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            {/* Established Year */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
              >
                <option value="">Select year</option>
                {uniqueEstablishedYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {/* Accreditation */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={accreditation}
                onChange={(e) => setAccreditation(e.target.value)}
              >
                <option value="">Select accreditation</option>
                {uniqueAccreditations.map(acc => (
                  <option key={acc} value={acc}>{acc}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-blue-200">
            <button
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
              onClick={handleSort}
            >
              <svg
                className="w-4 h-4 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {sortDirection === 'asc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                )}
              </svg>
              Sort {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </button>
              {/* Export Button */}
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={exportInstitutes}>
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export
            </button>
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors"
              onClick={handleSearch}>
              Apply Search
            </button>
          </div>
        </div>



        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersToDisplay.map((user) => (
                <tr key={user._id}>


                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 overflow-hidden">
                        {user.photoUrl ? (
                          <img
                            src={user.photoUrl}
                            alt={user.name || user.instituteName || 'Institute'}
                            className="h-10 w-10 object-cover rounded-full"
                          />
                        ) : (
                          user.email.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.userType}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}{user.instituteName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.accreditation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing{' '}

            <span className="font-medium">
              {Math.min(endIdx, sortedUsers.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium">
              {sortedUsers.length}
            </span>{' '}
            institutes
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx + 1)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === idx + 1
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User View Popup */}
      {isViewPopupOpen && selectedUser && (
        <InstituteViewPopup
          user={selectedUser}
          onClose={handleCloseUserView}
          onDelete={handleDeleteUser}
        />
      )}
    </>
  );
}

export default InstituteMgtTable;
