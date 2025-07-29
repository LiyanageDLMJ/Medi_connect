import React, { useState, useEffect } from "react";
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiFilter } from 'react-icons/fi';
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../../../Components/Feedback/FeedbackModal";

interface Application {
  id: string;
  degreeId: string;
  degreeName: string;
  name: string;
  profilePic?: string;
  phone: string;
  currentEducation: string;
  additionalInfo: string;
  applicantType?: string; // Add applicantType field
  status: string;
  appliedDate: string;
}

interface FilterOptions {
  statuses: string[];
  degrees: Array<{
    id: string; // Change from number to string
    name: string;
  }>;
}

type FilterKey = "degreeId" | "fromDate" | "toDate" | "search" | "applicantType";
const filterKeys: FilterKey[] = ["degreeId", "fromDate", "toDate", "search", "applicantType"];
type ActiveFilters = {
  degreeId: string;
  fromDate: string;
  toDate: string;
  search: string;
  applicantType: string;
};

const initialFilters: ActiveFilters = {
  degreeId: "",
  fromDate: "",
  toDate: "",
  search: "",
  applicantType: ""
};

// Add a status badge function for consistent color logic
const statusBadge = (status: string) => {
  let color = "bg-gray-500";
  let text = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  if (status.toLowerCase() === "pending") color = "bg-yellow-500";
  else if (status.toLowerCase() === "approved") color = "bg-green-500";
  else if (status.toLowerCase() === "rejected") color = "bg-red-500";
  return <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${color}`}>{text}</span>;
};

const ViewApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    statuses: [],
    degrees: [] as Array<{ id: string; name: string }>
  });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters);
  const [applicantsPerPage, setApplicantsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Function to check if token is valid
  const isTokenValid = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    // Check if user is authenticated before fetching data
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    // Check if token exists and is valid
    if (!token || !isTokenValid(token)) {
      // Clear invalid token
      localStorage.removeItem('token');
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    fetchApplications();
  }, [activeFilters, applicantsPerPage, currentPage, navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (activeFilters.degreeId) queryParams.append('degreeId', activeFilters.degreeId);
      if (activeFilters.fromDate) queryParams.append('fromDate', activeFilters.fromDate);
      if (activeFilters.toDate) queryParams.append('toDate', activeFilters.toDate);
      if (activeFilters.search) queryParams.append('search', activeFilters.search);
      if (activeFilters.applicantType) queryParams.append('applicantType', activeFilters.applicantType);

      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      
      console.log('=== FRONTEND DEBUG: Token Check ===');
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length);
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header set:', headers['Authorization'] ? 'Yes' : 'No');
      } else {
        console.log('No token found in localStorage');
      }
      
      // Fallback: Add user ID in headers in case JWT token is expired
      const userId = localStorage.getItem('userId');
      if (userId) {
        headers['x-user-id'] = userId;
        console.log('x-user-id header set:', userId);
      } else {
        console.log('No userId found in localStorage');
      }

      console.log('Final headers:', headers);

      const response = await fetch(
        `http://localhost:3000/viewDegreeApplications/view?${queryParams.toString()}&page=${currentPage}&limit=${applicantsPerPage}`,
        { headers }
      );
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch applications: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('=== FRONTEND DEBUG: API Response ===');
      console.log('Full API response:', data);
      console.log('Applications count:', data.applications?.length || 0);
      console.log('Degrees count:', data.filters?.degrees?.length || 0);
      console.log('Degrees data:', data.filters?.degrees || []);
      
      setApplications(data.applications);
      if (data.filters) setFilters({
        ...data.filters,
        degrees: data.filters.degrees.map((deg: { id: string | number; name: string }) => ({ ...deg, id: String(deg.id) }))
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error('Fetch error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (filterKeys.includes(name as FilterKey)) {
      const key = name as FilterKey;
      setActiveFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const clearFilters = () => {
    setActiveFilters({
      degreeId: "",
      fromDate: "",
      toDate: "",
      search: "",
      applicantType: ""
    });
  };

  // Handler to update application status
  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    // Optimistically update UI
    setApplications(apps =>
      apps.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
    // Call backend to update status
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      await fetch(`http://localhost:3000/viewDegreeApplications/updateStatus/${applicationId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      // Optionally handle error and revert UI
    }
  };

  // Handler to delete application
  const handleDeleteApplication = async (applicationId: string) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:3000/viewDegreeApplications/delete/${applicationId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      // Refresh the applications list
      fetchApplications();
    } catch (err: any) {
      console.error("Error deleting application:", err);
      alert("Failed to delete application. Please try again.");
    }
  };

  // Calculate paginated applications
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  
  // Filter applications based on active filters
  const filteredApplications = applications.filter(application => {
    // Search filter (only by name since email is not in the interface)
    const matchesSearch = !activeFilters.search || 
      application.name.toLowerCase().includes(activeFilters.search.toLowerCase());
    
    // Degree filter
    const matchesDegree = !activeFilters.degreeId || application.degreeId === activeFilters.degreeId;
    
    // Applicant type filter
    const matchesType = !activeFilters.applicantType || application.applicantType === activeFilters.applicantType;
    
    // Date filter
    const matchesDate = !activeFilters.fromDate || 
      new Date(application.appliedDate) >= new Date(activeFilters.fromDate);
    
    return matchesSearch && matchesDegree && matchesType && matchesDate;
  });
  
  const currentApplications = filteredApplications.slice(indexOfFirstApplicant, indexOfLastApplicant);
  const totalPages = Math.ceil(filteredApplications.length / applicantsPerPage);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4 md:ml-64 h-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <h2 className="text-2xl font-semibold whitespace-nowrap">Total Applicants: {filteredApplications.length}</h2>
            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
              {/* Search by Applicant */}
              <input
                type="text"
                name="search"
                value={activeFilters.search}
                onChange={handleFilterChange}
                placeholder="Search by applicant name or email"
                className="p-2 border border-gray-300 rounded w-56"
              />
              {/* Filter Dropdown */}
              <Menu as="div" className="relative inline-block text-left">
              <div>
                  <Menu.Button className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm bg-white text-sm font-medium rounded hover:bg-gray-50 focus:outline-none">
                    <FiFilter className="mr-2" />
                    Filter
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
                    <div className="p-4 space-y-3">
              {/* Degree Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree Program</label>
                <select
                  name="degreeId"
                  value={activeFilters.degreeId}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Degrees</option>
                  {filters.degrees.map((degree: { id: string; name: string }) => (
                    <option key={degree.id} value={degree.id}>
                      {degree.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Applicant Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Type</label>
                <select
                  name="applicantType"
                  value={activeFilters.applicantType}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Types</option>
                  <option value="MedicalStudent">Medical Students</option>
                  <option value="Doctor">Professional Doctors</option>
                </select>
              </div>
              
              {/* From Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={activeFilters.fromDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
                  <button
                onClick={() => navigate('/higher-education/degree-listing/feedbackslist')}
                className="p-2 border border-gray-300 rounded w-40 hover:bg-gray-300 ml-2"
                  >
                Feedbacks
                  </button>
             
            </div>
          </div>

          {/* Table/List of Applications with scrollable area */}
          <div className="flex-1 min-h-0">
            <div className="bg-white rounded-lg shadow p-4 mt-4 h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                {loading ? (
                  <p className="text-center text-gray-500">Loading applications...</p>
                ) : error ? (
                  <p className="text-center text-red-500">Error: {error}</p>
                ) : applications.length === 0 ? (
                  <p className="text-center text-gray-500">No applications found.</p>
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      {/* Table Header */}
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applicant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Degree
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applied Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      {/* Table Body */}
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentApplications.map((application) => (
                          <tr key={application.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <img
                                  src={application.profilePic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(application.name)}
                                  alt={application.name}
                                  className="w-8 h-8 rounded-full object-cover border"
                                />
                                <span className="font-medium">{application.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {statusBadge(application.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                application.applicantType === 'MedicalStudent' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : application.applicantType === 'Doctor'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {application.applicantType === 'MedicalStudent' ? 'Medical Student' : 
                                 application.applicantType === 'Doctor' ? 'Professional Doctor' : 
                                 application.applicantType || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>{application.degreeName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {application.appliedDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                              <button
                                className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 border border-blue-200"
                                onClick={() => navigate(`/higher-education/view-applications/${application.id}`)}
                              >
                                See Application
                              </button>
                               <Menu as="div" className="relative inline-block text-left">
                                 <Menu.Button className="ml-2 p-2 rounded hover:bg-gray-100 align-middle">
                                   <BsThreeDotsVertical className="inline text-gray-500" size={18} />
                                 </Menu.Button>
                                 <Transition
                                   as={Fragment}
                                   enter="transition ease-out duration-100"
                                   enterFrom="transform opacity-0 scale-95"
                                   enterTo="transform opacity-100 scale-100"
                                   leave="transition ease-in duration-75"
                                   leaveFrom="transform opacity-100 scale-100"
                                   leaveTo="transform opacity-0 scale-95"
                                 >
                                   <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50 px-2 py-2 flex flex-col">
                                     <Menu.Item>
                                       {({ active }: { active: boolean }) => (
                                         <button
                                           className={`px-3 py-1 text-sm rounded ${active ? 'bg-gray-100' : ''}`}
                                           onClick={() => handleStatusChange(application.id, "Approved")}
                                         >
                                           Approve
                                         </button>
                                       )}
                                     </Menu.Item>
                                     <Menu.Item>
                                       {({ active }: { active: boolean }) => (
                                         <button
                                           className={`px-3 py-1 text-sm rounded ${active ? 'bg-gray-100' : ''}`}
                                           onClick={() => handleStatusChange(application.id, "Rejected")}
                                         >
                                           Reject
                                         </button>
                                       )}
                                     </Menu.Item>
                                     <Menu.Item>
                                       {({ active }: { active: boolean }) => (
                                         <button
                                           className={`px-3 py-1 text-sm rounded ${active ? 'bg-gray-100' : ''}`}
                                           onClick={() => handleStatusChange(application.id, "Pending")}
                                         >
                                           Pending
                                         </button>
                                       )}
                                     </Menu.Item>
                                     <Menu.Item>
                                       {({ active }: { active: boolean }) => (
                                         <button
                                           className={`px-3 py-1 text-sm rounded text-red-600 hover:bg-red-50 ${active ? 'bg-red-50' : ''}`}
                                           onClick={() => handleDeleteApplication(application.id)}
                                         >
                                           Delete
                                         </button>
                                       )}
                                     </Menu.Item>
                                   </Menu.Items>
                                 </Transition>
                               </Menu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* Pagination fixed at bottom */}
              <div className=" bg-white sticky bottom-0 z-10">
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2">
                    <span>View</span>
                    <select
                      value={applicantsPerPage}
                      onChange={e => setApplicantsPerPage(Number(e.target.value))}
                      className="border rounded px-3 py-1"
                    >
                      {[10, 20, 50].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <span>Applicants per page</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 rounded disabled:opacity-50"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${page === currentPage ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border"}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 rounded disabled:opacity-50"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        open={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="Share Your Experience"
        placeholder="Tell us about your experience with the application review process..."
        source="general"
        sourceDetails="General feedback from institution"
        institutionId={localStorage.getItem('userId') || undefined}
        redirectTo="/higher-education/view-applications"
      />
    </div>
  );
};

export default ViewApplications;