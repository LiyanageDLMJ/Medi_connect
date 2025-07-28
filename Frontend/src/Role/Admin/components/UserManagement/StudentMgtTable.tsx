import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentViewPopup from './StudentViewPopup';
import { FaSort, FaFileExport } from 'react-icons/fa';
import CVDataViewPopup from '../Settings/CVDataViewPopup';

// Define User type based on AdminStudentModel schema
type User = {
  _id: string;
  email: string;
  userType: 'Doctor' | 'MedicalStudent' | 'Recruiters' | 'EducationalInstitute';
  currentInstitute: string;
  yearOfStudy?: number;
  fieldOfStudy?: string;
  createdAt?: Date;
  photoUrl?: string;
  status?: string;
  location?: string;
  higherEducation?: string;
};

function StudentMgtTable() {
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
  const [currentInstitute, setCurrentInstitute] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [location, setLocation] = useState('');
  const [higherEducation, setHigherEducation] = useState('');
  const [isCVPopupOpen, setIsCVPopupOpen] = useState(false);
  const [cvData, setCVData] = useState<any>(null);
  const [cvLoading, setCVLoading] = useState(false);
  const [cvError, setCVError] = useState<string | null>(null);

  const usersPerPage = 10;

  const fetchMedicalStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/admin/MedicalStudent');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to fetch medical students'
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Fetch medical students error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalStudents();
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
        user.currentInstitute.toLowerCase().includes(term) ||
        (user.fieldOfStudy && user.fieldOfStudy.toLowerCase().includes(term)) ||
        (user.yearOfStudy && user.yearOfStudy.toString().includes(term));
      const matchesInstitute = !currentInstitute || user.currentInstitute === currentInstitute;
      const matchesYear = !yearOfStudy || (user.yearOfStudy && user.yearOfStudy.toString() === yearOfStudy);
      const matchesField = !fieldOfStudy || user.fieldOfStudy === fieldOfStudy;
      const matchesLocation = !location || user.location === location;
      const matchesHigherEducation = !higherEducation || user.higherEducation === higherEducation;
      return matchesSearch && matchesInstitute && matchesYear && matchesField && matchesLocation && matchesHigherEducation;
    });
    setFilteredUsers(filtered);
  };

  const handleCancel = () => {
    setSearchInput('');
    setCurrentInstitute('');
    setYearOfStudy('');
    setFieldOfStudy('');
    setSearch('');
    setFilteredUsers([]); // Show all users
    setCurrentPage(1);
  };

  const handleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1); // Reset to first page on sort
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewPopupOpen(true);
  };

  const handleCloseUserView = () => {
    setSelectedUser(null);
    setIsViewPopupOpen(false);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
      setIsViewPopupOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleResumeClick = (user: User) => {
    setIsCVPopupOpen(true);
    setCVData(null);
    setCVError(null);
    setCVLoading(true);
    axios.get(`http://localhost:3000/api/admin/studentcv/${user.email}`)
      .then(res => {
        setCVData(res.data);
        setCVLoading(false);
      })
      .catch(() => {
        setCVError('Resume not found');
        setCVLoading(false);
      });
  };

  // Filter out removed users
  const filteredUsersList = (filteredUsers.length > 0 || search || currentInstitute || yearOfStudy || fieldOfStudy ? filteredUsers : users)
    .filter(user => user.status !== 'REMOVED');

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

  const dismissError = () => {
    setError(null);
  };

  const uniqueInstitutes = Array.from(new Set(users.map(u => u.currentInstitute))).filter(Boolean);
  const uniqueYears = Array.from(new Set(users.map(u => u.yearOfStudy))).filter(Boolean);
  const uniqueFields = Array.from(new Set(users.map(u => u.fieldOfStudy))).filter(Boolean);
  const uniqueLocations = Array.from(new Set(users.map(u => u.location))).filter(Boolean);
  const uniqueHigherEducations = Array.from(new Set(users.map(u => u.higherEducation))).filter(Boolean);

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

  const exportStudents = () => {
    // Use all students, not just paginated/filtered
    const dataToExport = filteredUsersList.map(user => ({
      'Email': user.email,
      'User Type': user.userType,
      'Current Institute': user.currentInstitute,
      'Year of Study': user.yearOfStudy || '',
      'Field of Study': user.fieldOfStudy || '',
      'Location': user.location || '',
      'Higher Education': user.higherEducation || '',
      'Created At': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
      'Photo URL': user.photoUrl || '',
      'Status': user.status || ''
    }));
    exportToCSV(dataToExport, 'students');
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
                placeholder="Search by name, email, or institute"
                className="block w-full pl-4 pr-3 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Has Scholarship */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Institute</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={currentInstitute}
                onChange={(e) => setCurrentInstitute(e.target.value)}
              >
                <option value="">Select institute</option>
                {uniqueInstitutes.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between gap-4 mb-8">
            {/* Current Institute */}

            {/* Year of Study */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
              >
                <option value="">Select year</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {/* Field of Study */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
              >
                <option value="">Select field</option>
                {uniqueFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
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
            {/* Higher Education */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Higher Education</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={higherEducation}
                onChange={(e) => setHigherEducation(e.target.value)}
              >
                <option value="">Select higher education</option>
                {uniqueHigherEducations.map(he => (
                  <option key={he} value={he}>{he}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-blue-200">
            <button
              className="px-5 py-2.5 text-sm font-medium text-gray-700  bg-white border border-blue-200 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
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
              Sort {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </button>

            {/* Export Button */}
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={exportStudents}>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Institute</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year of Study</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field of Study</th>
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
                            alt="Student Photo"
                            className="h-10 w-10 object-cover rounded-full"
                            onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=No+Photo'; }}
                          />
                        ) : (
                          <span>{user.email.charAt(0).toUpperCase()}</span>
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

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.currentInstitute}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.yearOfStudy || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fieldOfStudy || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      id="resume"
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleResumeClick(user)}
                    >
                      Resume
                    </button>
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
            students
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
        <StudentViewPopup
          user={selectedUser}
          onClose={handleCloseUserView}
          onDelete={handleDeleteUser}
        />
      )}
      {isCVPopupOpen && (
        <CVDataViewPopup
          onClose={() => setIsCVPopupOpen(false)}
          data={cvData}
          loading={cvLoading}
          error={cvError}
        />
      )}
    </>
  );
}

export default StudentMgtTable;
