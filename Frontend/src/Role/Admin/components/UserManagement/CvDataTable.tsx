import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CVDataViewPopup from '../Settings/CVDataViewPopup';

function CvDataTable() {
  const [cvList, setCvList] = useState<any[]>([]);
  const [selectedCv, setSelectedCv] = useState<any | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [searchInput, setSearchInput] = useState('');
  const [engagement, setEngagement] = useState('');
  const [medicalDegree, setMedicalDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [university, setUniversity] = useState('');
  const [hospital, setHospital] = useState('');
  const [period, setPeriod] = useState('');
  const [filteredCVs, setFilteredCVs] = useState<any[]>([]);
  const [searchApplied, setSearchApplied] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const fetchCVs = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/api/admin/cvdatas');
        setCvList(res.data);
      } catch {
        setCvList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCVs();
  }, []);

  const handleView = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/admin/cvdatas/${id}`);
      setSelectedCv(res.data);
      setShowPopup(true);
    } catch {
      setSelectedCv(null);
      setShowPopup(false);
    }
  };

  const handleSearch = () => {
    setSearchApplied(true);
    let filtered = cvList.filter((cv) => {
      const term = searchInput.trim().toLowerCase();
      const matchesSearch =
        !term ||
        (cv.yourName && cv.yourName.toLowerCase().includes(term)) ||
        (cv.contactEmail && cv.contactEmail.toLowerCase().includes(term)) ||
        (cv.medicalDegree && cv.medicalDegree.toLowerCase().includes(term));
      
      const matchesEngagement = !engagement || engagement === 'Any' || (cv.engagement && cv.engagement === engagement);
      const matchesDegree = !medicalDegree || (cv.medicalDegree && cv.medicalDegree === medicalDegree);
      const matchesSpecialization = !specialization || (cv.specialization && cv.specialization === specialization);
      const matchesLocation = !location || (cv.currentLocation && cv.currentLocation === location);
      const matchesUniversity = !university || (cv.university && cv.university === university);
      const matchesHospital = !hospital || (cv.hospitalInstitution && cv.hospitalInstitution === hospital);
      const matchesPeriod = !period || (cv.employmentPeriod && cv.employmentPeriod === period);
      
      return (
        matchesSearch &&
        matchesEngagement &&
        matchesDegree &&
        matchesSpecialization &&
        matchesLocation &&
        matchesUniversity &&
        matchesHospital &&
        matchesPeriod
      );
    });
    
    // Apply sorting if any
    if (sortConfig) {
      filtered = sortData(filtered, sortConfig.key, sortConfig.direction);
    }
    
    setFilteredCVs(filtered);
    setCurrentPage(1);
  };

  const handleCancel = () => {
    setSearchInput('');
    setEngagement('');
    setMedicalDegree('');
    setSpecialization('');
    setLocation('');
    setUniversity('');
    setHospital('');
    setPeriod('');
    setFilteredCVs([]);
    setSearchApplied(false);
    setCurrentPage(1);
    setSortConfig(null);
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    // Apply sorting to current data
    const dataToSort = searchApplied ? [...filteredCVs] : [...cvList];
    const sortedData = sortData(dataToSort, key, direction);
    
    if (searchApplied) {
      setFilteredCVs(sortedData);
    } else {
      setCvList(sortedData);
    }
  };

  const sortData = (data: any[], key: string, direction: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      // Handle nested properties if needed
      const aValue = a[key] || '';
      const bValue = b[key] || '';
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Get unique values for dropdowns from the original cvList
  const getUniqueValues = (key: string) => {
    const values = new Set<string>();
    cvList.forEach(cv => {
      if (cv[key]) {
        values.add(cv[key]);
      }
    });
    return Array.from(values).sort();
  };

  const uniqueDegrees = getUniqueValues('medicalDegree');
  const uniqueSpecializations = getUniqueValues('specialization');
  const uniqueLocations = getUniqueValues('currentLocation');
  const uniqueUniversities = getUniqueValues('university');
  const uniqueHospitals = getUniqueValues('hospitalInstitution');
  const uniquePeriods = getUniqueValues('employmentPeriod');

  // Pagination logic
  const displayCVs = searchApplied ? filteredCVs : cvList;
  const totalPages = Math.ceil(displayCVs.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const paginatedCVs = displayCVs.slice(startIdx, endIdx);
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">Manage Resumes</h3>
        {/* Advanced Search Section */}
        <div className="mx-auto mb-10 p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-100">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Bar</label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, or degree"
                className="block w-full pl-4 pr-3 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Engagement (Job Title) Radio Buttons */}
            <div className="flex flex-col justify-end md:w-1/2 lg:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Engagement</label>
              <div className="flex flex-wrap gap-4">
                {['Full Time', 'Part Time', 'Internship', 'Any'].map((option) => (
                  <label key={option} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="engagement"
                      value={option}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300"
                      checked={engagement === option}
                      onChange={() => setEngagement(option)}
                    />
                    <span className="ml-2 text-sm text-blue-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Medical Degree */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Degree</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={medicalDegree}
                onChange={(e) => setMedicalDegree(e.target.value)}
              >
                <option value="">Select degree</option>
                {uniqueDegrees.map(degree => (
                  <option key={degree} value={degree}>{degree}</option>
                ))}
              </select>
            </div>
            {/* Specialization */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">Select specialization</option>
                {uniqueSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
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
            {/* University */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              >
                <option value="">Select university</option>
                {uniqueUniversities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
            {/* Hospital/Institution */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital/Institution</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
              >
                <option value="">Select hospital</option>
                {uniqueHospitals.map(hosp => (
                  <option key={hosp} value={hosp}>{hosp}</option>
                ))}
              </select>
            </div>
            {/* Period */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="">Select period</option>
                {uniquePeriods.map(per => (
                  <option key={per} value={per}>{per}</option>
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
              onClick={() => requestSort('yourName')}
            >
              <svg
                className="w-4 h-4 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d={sortConfig?.direction === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                />
              </svg>
              {sortConfig?.direction === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            </button>
            <button
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors"
              onClick={handleSearch}
            >
              Apply Search
            </button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('yourName')}>
                <div className="flex items-center">
                  NAME
                  {sortConfig?.key === 'yourName' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('medicalDegree')}>
                <div className="flex items-center">
                  Medical Degree
                  {sortConfig?.key === 'medicalDegree' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('specialization')}>
                <div className="flex items-center">
                  Specialization
                  {sortConfig?.key === 'specialization' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('professionalTitle')}>
                <div className="flex items-center">
                  Professional Title
                  {sortConfig?.key === 'professionalTitle' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('university')}>
                <div className="flex items-center">
                  University
                  {sortConfig?.key === 'university' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
            ) : paginatedCVs.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8">No CVs found.</td></tr>
            ) : paginatedCVs.map((cv) => (
              <tr key={cv._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      {cv.yourName?.charAt(0) || '?'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{cv.yourName}</div>
                      <div className="text-sm text-gray-500">{cv.contactEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cv.medicalDegree}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cv.specialization}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cv.professionalTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cv.university}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleView(cv._id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">Showing {paginatedCVs.length === 0 ? 0 : startIdx + 1} to {Math.min(endIdx, displayCVs.length)} of {displayCVs.length}</div>
          <div className="flex space-x-1">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => goToPage(i + 1)} className={`px-3 py-1 rounded-md border border-gray-300 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white hover:bg-gray-50'}`}>{i + 1}</button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
      {showPopup && selectedCv && (
        <CVDataViewPopup data={selectedCv} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}

export default CvDataTable;