import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserViewPopup from './UserViewPopup';

// Define User type based on AdminDoctorModel schema
type User = {
  _id: string;
  email: string;
  userType: 'Doctor' | 'MedicalStudent' | 'Recruiters' | 'EducationalInstitute';
  profession: string;
  specialty?: string;
  location: string;
  higherEducation?: string;
  createdAt?: Date;
  updatedAt?: Date;
  password?: string;
};

function DocMgtTable() {
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

  const usersPerPage = 10;

  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/admin/doctors');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Failed to fetch doctors' 
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Fetch doctors error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle Search Button Click
  const handleSearch = () => {
    setSearch(searchInput.trim());
    setCurrentPage(1); // Reset to first page on new search
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

  // Function to close user view popup
  const handleCloseUserView = () => {
    setSelectedUser(null);
    setIsViewPopupOpen(false);
  };

  // Function to delete user
  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${userId}`);
      
      // Refresh the entire list of doctors
      await fetchDoctors();
      
      setIsViewPopupOpen(false);
      setSelectedUser(null);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Failed to delete user' 
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Delete user error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users by search term
  const filteredUsersList = users.filter((user) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      user.email.toLowerCase().includes(term) ||
      user.profession.toLowerCase().includes(term) ||
      (user.specialty && user.specialty.toLowerCase().includes(term)) ||
      user.location.toLowerCase().includes(term)
    );
  });

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
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
 

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative w-96">
            <div className='absolute inset-y-0 left-0 pl-3 flex w-96 items-center'>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="block w-full pl-5 pr-3 mr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search About Doctors"
              />
              <button
                className="inline-flex items-center cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                onClick={handleSearch}
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Right-side controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Sort Button */}
            <button
              className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSort}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
              </svg>
               Sort {sortDirection === 'asc' ? 'Descending' : ' Ascending'}
            </button>
            
            {/* Export Button */}
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3.293 5.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profession
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersToDisplay.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      {user.email.charAt(0).toUpperCase()}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.profession}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.specialty || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.location}
                </td>
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {startIdx + 1} to {Math.min(endIdx, filteredUsersList.length)} of {filteredUsersList.length} doctors
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded-md border border-gray-300 ${
                  currentPage === i + 1 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User View Popup */}
      {isViewPopupOpen && selectedUser && (
        <UserViewPopup user={selectedUser} 
          onClose={handleCloseUserView} 
          onDelete={handleDeleteUser}
        />
      )}
    </>
  );
}

export default DocMgtTable;
