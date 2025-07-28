import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import UserViewPopup from './UserViewPopup';
import CVDataViewPopup from '../Settings/CVDataViewPopup';

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
  photoUrl?: string;
};

type Certification = {
  graduationDate: string;
  medicalLicenseNumber: string;
  medicalLicenseIssuer: string;
  jobTitle: string;
  hospitalInstitution: string;
  employmentPeriod: string;
};

type data = {
  yourName: string;
  professionalTitle: string;
  currentLocation: string;
  linkedinLink: string;
  careerSummary: string;
  contactPhone: string;
  contactEmail: string;
  medicalDegree: string;
  university: string;
  specialization: string;
  experience: string;
  resumePdfUrl: string;
  certificationInput?: Certification[];
  graduationDate?: string;
  medicalLicenseNumber?: string;
  medicalLicenseIssuer?: string;
  jobTitle?: string;
  hospitalInstitution?: string;
  employmentPeriod?: string;
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
  const [profession, setProfession] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [higherEducation, setHigherEducation] = useState('');
  const [data, setData] = useState<data | null>(null);
  const [isCVPopupOpen, setIsCVPopupOpen] = useState(false);
  const [selectedCVUser, setSelectedCVUser] = useState<User | null>(null);
  const [cvLoading, setCVLoading] = useState(false);
  const [cvError, setCVError] = useState<string | null>(null);
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



  const getCVDataByEmail = async (email: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/admin/cvdatasv/${email}`);
      setData(response.data);
      setCVLoading(false);
    } catch (err) {
      setCVError('Resume not found');
      setCVLoading(false);
    }
  };




  // Handle Search Button Click
  const handleSearch = () => {
    setSearch(searchInput.trim());
    setCurrentPage(1); // Reset to first page on new search
    // Advanced search: filter users based on all criteria
    let filtered = users.filter((user) => {
      const term = searchInput.trim().toLowerCase();
      const matchesSearch =
        !term ||
        user.email.toLowerCase().includes(term) ||
        user.profession.toLowerCase().includes(term) ||
        (user.specialty && user.specialty.toLowerCase().includes(term)) ||
        user.location.toLowerCase().includes(term);
      const matchesProfession = !profession || user.profession === profession;
      const matchesSpecialty = !specialty || user.specialty === specialty;
      const matchesLocation = !location || user.location === location;
      const matchesHigherEd =
        !higherEducation ||
        (higherEducation === 'yes' && user.higherEducation && user.higherEducation !== '') ||
        (higherEducation === 'no' && (!user.higherEducation || user.higherEducation === ''));
      return (
        matchesSearch &&
        matchesProfession &&
        matchesSpecialty &&
        matchesLocation &&
        matchesHigherEd
      );
    });
    setFilteredUsers(filtered);
  };

  const handleCancel = () => {
    setSearchInput('');
    setProfession('');
    setSpecialty('');
    setLocation('');
    setHigherEducation('');
    setSearch('');
    setFilteredUsers(users);
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

  // Function to close user view popup
  const handleCloseUserView = () => {
    setSelectedUser(null);
    setIsViewPopupOpen(false);
  };

  // Function to delete user


  // Filter users by search term
  const filteredUsersList = (profession || specialty || location || higherEducation || search)
    ? filteredUsers
    : users;

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

  const uniqueProfessions = Array.from(new Set(users.map(u => u.profession))).filter(Boolean);
  const uniqueSpecialties = Array.from(new Set(users.map(u => u.specialty))).filter(Boolean);
  const uniqueLocations = Array.from(new Set(users.map(u => u.location))).filter(Boolean);

  const handleResumeClick = (user: User) => {
    setSelectedCVUser(user);
    setIsCVPopupOpen(true);
    setData(null); // Reset previous data
    setCVError(null);
    setCVLoading(true);
    getCVDataByEmail(user.email);
  };

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

  const exportDoctors = () => {
    // Use all doctors, not just paginated/filtered
    const dataToExport = filteredUsersList.map(user => ({
      'Email': user.email,
      'User Type': user.userType,
      'Profession': user.profession,
      'Specialty': user.specialty || '',
      'Location': user.location || '',
      'Higher Education': user.higherEducation || '',
      'Created At': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
      'Updated At': user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '',
      'Photo URL': user.photoUrl || ''
    }));
    exportToCSV(dataToExport, 'doctors');
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

        <div className=" mx-auto mb-15 p-6 bg-blue-50 rounded-xl shadow-lg border  border-blue-500 ">


          <div className="space-y-5 mb-6">
            {/* Email Field */}
            <div className='flex justify-between gap-4'>
              <div className="relative w-full">
                <label className="block text-sm font-medium text-gray-700  mb-1">Search Bar </label>
                <div className="relative">

                  <input
                    type="text"
                    placeholder="Asiri Gayashan"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="block w-full pl-4 pr-3 py-2 border rounded-lg bg-white border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className='flex justify-between w-1/3'>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">Higher Education</label>
                  <div className="flex space-x-6">
                    {['', 'yes', 'no'].map((option) => (
                      <label key={option || 'any'} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="higherEducation"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300"
                          checked={higherEducation === option}
                          onChange={() => setHigherEducation(option)}
                        />
                        <span className="ml-2 text-sm text-blue-700">
                          {option === 'yes' ? 'Yes' : option === 'no' ? 'No' : 'Any'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>



              </div>
            </div>

            <div className='flex justify-between gap-4 mb-8'>
              {/* Profession Field */}
              <div className=" w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                <div className="relative">
                  <select
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                  >
                    <option value="">Select profession</option>
                    {uniqueProfessions.map(prof => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>

                </div>
              </div>

              {/* Specialty Select (Multiple) */}
              <div className='w-full m'>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <div className="relative">
                  <select
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  >
                    <option value="">Select specialty</option>
                    {uniqueSpecialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Location Select */}
              <div className='w-full' >
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
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
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Higher Education Field */}
            <hr className='border-gray-300' />


          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            {/* Search Input */}

            <div className="relative w-96">

            </div>

            {/* Right-side controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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


              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleCancel}
              >
                Cancel
              </button>


              {/* Export Button */}
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={exportDoctors}>
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
                Apply Search
              </button>




            </div>


          </div>
        </div>



        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Photo
              </th>
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
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-0">
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
                    className="text-blue-600 hover:text-blue-500 mr-3 cursor-pointer" id="resume"
                    onClick={() => handleResumeClick(user)}
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => handleViewUser(user)}
                    className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
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
                className={`px-3 py-1 rounded-md border border-gray-300 ${currentPage === i + 1
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
        />
      )}
      {/* CV Data View Popup */}
      {isCVPopupOpen && (
        <CVDataViewPopup
          onClose={() => setIsCVPopupOpen(false)}
          data={data}
          loading={cvLoading}
          error={cvError}
        />
      )}
    </>
  );
}

export default DocMgtTable;

