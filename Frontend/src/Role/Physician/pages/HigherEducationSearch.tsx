import { useState, useEffect } from "react";
import Search from "../components/DegreeDiv/DegreeSearch";
import DegreeCard from "../components/DegreeDiv/DegreeCard";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

// Utility function to derive statusColor based on status
const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return 'bg-green-500';
    case 'CLOSED':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const HigherEducationSearch = () => {
  const [filters, setFilters] = useState({
    searchText: "",
    institution: "",
    duration: "",
    mode: "",
    tuitionFee: "",
  });
  const [degrees, setDegrees] = useState([]);
  const [totalDegrees, setTotalDegrees] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [degreesPerPage, setDegreesPerPage] = useState(8); // Default 8 per page for card grid
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDegrees = async () => {
      setLoading(true);
      try {
        const queryObj = { ...filters, page: currentPage, limit: degreesPerPage };
        const query = new URLSearchParams(queryObj as any).toString();
        const response = await fetch(`http://localhost:3000/higherDegrees/viewHigherDegrees?${query}`);
        const data = await response.json();
        const degreesWithStatusColor = data.degrees.map((degree: any) => ({
          ...degree,
          courseId: degree._id,
          statusColor: getStatusColor(degree.status),
        }));
        setDegrees(degreesWithStatusColor);
        setTotalDegrees(data.total);
      } catch (error) {
        console.error("Error fetching degrees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDegrees();
  }, [filters, currentPage, degreesPerPage]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      searchText: "",
      institution: "",
      duration: "",
      mode: "",
      tuitionFee: "",
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalDegrees / degreesPerPage);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-60">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
          <Search filters={filters} onFilterChange={handleFilterChange} onClear={handleClearFilters} />
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-gray-500 text-lg">Loading degrees...</span>
            </div>
          ) : (
            <>
              <DegreeCard degrees={degrees} totalDegrees={totalDegrees} />
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-8 px-8">
                <div className="flex items-center gap-2">
                  <span>View</span>
                  <select
                    value={degreesPerPage}
                    onChange={e => {
                      setDegreesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded px-3 py-1"
                  >
                    {[8, 16, 32].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span>Degrees per page</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded disabled:opacity-50 border"
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
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-2 py-1 rounded disabled:opacity-50 border"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HigherEducationSearch;