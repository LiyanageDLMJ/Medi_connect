import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecruiterViewPopup from './RecruiterViewPopup';


type Recruiter = {
  _id: string;
  email: string;
  role: string;
  companyName: string;
  companyType: string;
  position: string;
  contactNumber: string;
  photoUrl?: string;
  school?: string;
  location?: string;
  bio?: string;
  higherEducation?: string;
  status?: string;
  deletedAt?: string;
};

function RecruiterMgtTable({ onViewJobs }: { onViewJobs?: (companyName: string) => void }) {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recruitersPerPage = 10;
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [position, setPosition] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [role, setRole] = useState('');
  const [filteredRecruiters, setFilteredRecruiters] = useState<Recruiter[]>([]);
  const [searchApplied, setSearchApplied] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deleteMessage, setDeleteMessage] = useState('');
  const handleDeleteRecruiter = async (recruiterId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/recruiters/${recruiterId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Remove from local state
        setRecruiters((prev) => prev.filter((r) => r._id !== recruiterId));
        setFilteredRecruiters((prev) => prev.filter((r) => r._id !== recruiterId));
        alert(data.message);
        // Success message
        setDeleteMessage('Recruiter has been successfully removed!');

        // Clear message after 10 seconds
        setTimeout(() => {
          setDeleteMessage('');
        }, 10000);

        // Close view popup
        setIsViewPopupOpen(false);
        setSelectedRecruiter(null);
      } else {
        console.error('Failed to delete recruiter');
        setDeleteMessage('Failed to remove recruiter. Please try again.');
        setTimeout(() => {
          setDeleteMessage('');
        }, 10000);
      }
    } catch (error) {
      console.error('Error deleting recruiter:', error);
      setDeleteMessage('Error removing recruiter. Please try again.');
      setTimeout(() => {
        setDeleteMessage('');
      }, 3000);
    }
  };

  // Get unique positions for dropdown
  const uniquePositions = Array.from(new Set(recruiters.map(r => r.position))).filter(Boolean);
  const uniqueCompanyTypes = Array.from(new Set(recruiters.map(r => r.companyType))).filter(Boolean);

  // Pagination logic
  const recruitersListUnsorted = searchApplied ? filteredRecruiters : recruiters;
  const sortedRecruitersList = [...recruitersListUnsorted].sort((a, b) => {
    const nameA = a.companyName.toLowerCase();
    const nameB = b.companyName.toLowerCase();
    return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });
  const totalPages = Math.ceil(sortedRecruitersList.length / recruitersPerPage);
  const startIdx = (currentPage - 1) * recruitersPerPage;
  const endIdx = startIdx + recruitersPerPage;
  const recruitersToDisplay = sortedRecruitersList.slice(startIdx, endIdx);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = () => {
    setSearchApplied(true);
    let filtered = recruiters.filter((r) => {
      const term = searchInput.trim().toLowerCase();
      const matchesSearch =
        !term ||
        r.companyName.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.position.toLowerCase().includes(term);
      const matchesCompanyType = !companyType || r.companyType === companyType;
      const matchesPosition = !position || r.position === position;
      const matchesContact = !contactNumber || r.contactNumber.includes(contactNumber);
      const matchesRole = !role || r.role === role;
      return matchesSearch && matchesCompanyType && matchesPosition && matchesContact && matchesRole;
    });
    setFilteredRecruiters(filtered);
    setCurrentPage(1);
  };

  const handleCancel = () => {
    setSearchInput('');
    setCompanyType('');
    setPosition('');
    setContactNumber('');
    setRole('');
    setFilteredRecruiters([]);
    setSearchApplied(false);
    setCurrentPage(1);
  };

  const handleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1);
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

  const exportRecruiters = () => {
    // Use all recruiters, not just paginated/filtered
    const dataToExport = (searchApplied ? filteredRecruiters : recruiters).map(r => ({
      'Company Name': r.companyName,
      'Email': r.email,
      'Role': r.role,
      'Company Type': r.companyType,
      'Position': r.position,
      'Contact Number': r.contactNumber,
      'Location': r.location || '',
      'School': r.school || '',
      'Bio': r.bio || '',
      'Higher Education': r.higherEducation || '',
      'Status': r.status || '',
      'Deleted At': r.deletedAt || '',
      'Photo URL': r.photoUrl || ''
    }));
    exportToCSV(dataToExport, 'recruiters');
  };

  useEffect(() => {
    const fetchRecruiters = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/api/admin/recruiters');
        setRecruiters(res.data);
      } catch {
        setRecruiters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, []);

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        {deleteMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {deleteMessage}
          </div>
        )}
        {/* Advanced Search Section */}
        <div className="mx-auto mb-10 p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Search Bar */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by company, email, or position"
                className="block w-full pl-4 pr-3 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Company Type */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
              >
                <option value="">All types</option>
                {uniqueCompanyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {/* Position */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="">All positions</option>
                {uniquePositions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            {/* Contact Number */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Contact number"
                className="block w-full pl-4 pr-3 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Role */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Recruiter</option>
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
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={exportRecruiters}>
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
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors"
              onClick={handleSearch}
            >
              Apply Search
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : recruitersListUnsorted.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-gray-500">
                    No recruiters found.
                  </td>
                </tr>
              ) : recruitersToDisplay.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 overflow-hidden">
                        {user.photoUrl ? (
                          <img src={user.photoUrl} alt="Recruiter" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.companyName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.companyType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.contactNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => {
                        setSelectedRecruiter(user);
                        setIsViewPopupOpen(true);
                      }}
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
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {recruitersListUnsorted.length === 0 ? 0 : startIdx + 1} to {Math.min(endIdx, recruitersListUnsorted.length)} of {recruitersListUnsorted.length}
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
      {/* Recruiter View Popup */}
      {isViewPopupOpen && selectedRecruiter && (
        <RecruiterViewPopup
          recruiter={selectedRecruiter}
          onClose={() => {
            setIsViewPopupOpen(false);
            setSelectedRecruiter(null);
          }}
          onDelete={handleDeleteRecruiter}
          onViewJobs={onViewJobs}
        />
      )}
    </>
  )
}

export default RecruiterMgtTable
