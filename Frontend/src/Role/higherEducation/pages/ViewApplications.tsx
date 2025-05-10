import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

interface Application {
  id: string;
  degreeId: string;
  degreeName: string;
  institution: string;
  name: string;
  email: string;
  phone: string;
  currentEducation: string;
  linkedIn: string;
  portfolio: string;
  additionalInfo: string;
  status: string;
  appliedDate: string;
}

interface FilterOptions {
  statuses: string[];
  degrees: Array<{
    id: number;
    name: string;
  }>;
}

const ViewApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    statuses: [],
    degrees: []
  });
  const [activeFilters, setActiveFilters] = useState({
    status: "",
    degreeId: "",
    fromDate: "",
    toDate: "",
    search: ""
  });

  useEffect(() => {
    fetchApplications();
  }, [activeFilters]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (activeFilters.status) queryParams.append('status', activeFilters.status);
      if (activeFilters.degreeId) queryParams.append('degreeId', activeFilters.degreeId);
      if (activeFilters.fromDate) queryParams.append('fromDate', activeFilters.fromDate);
      if (activeFilters.toDate) queryParams.append('toDate', activeFilters.toDate);
      if (activeFilters.search) queryParams.append('search', activeFilters.search);

      const response = await fetch(
        `http://localhost:3000/viewDegreeApplications/view?${queryParams.toString()}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch applications");
      
      const data = await response.json();
      setApplications(data.applications);
      if (data.filters) setFilters(data.filters);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setActiveFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setActiveFilters({
      status: "",
      degreeId: "",
      fromDate: "",
      toDate: "",
      search: ""
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-60">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
          <h2 className="text-2xl font-semibold mb-4">View Applications</h2>
          
          {/* Filter Controls */}
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={activeFilters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Statuses</option>
                  {filters.statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

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
                  {filters.degrees.map(degree => (
                    <option key={degree.id} value={degree.id}>
                      {degree.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Filters */}
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
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={activeFilters.toDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div> */}

              {/* Search Filter */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="flex">
                  <input
                    type="text"
                    name="search"
                    value={activeFilters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by name, email or degree"
                    className="flex-1 p-2 border border-gray-300 rounded-l"
                  />
                  <button
                    onClick={clearFilters}
                    className="bg-gray-200 px-3 rounded-r hover:bg-gray-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Applications Table */}
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
                      Degree
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{application.name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>{application.degreeName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.institution}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.appliedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold text-white rounded ${
                            application.status === "Submitted" || application.status === "PENDING"
                              ? "bg-yellow-500"
                              : application.status === "ACCEPTED"
                              ? "bg-green-500"
                              : application.status === "REJECTED"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => {/* View details logic */}}
                        >
                          View
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => {/* Update status logic */}}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewApplications;