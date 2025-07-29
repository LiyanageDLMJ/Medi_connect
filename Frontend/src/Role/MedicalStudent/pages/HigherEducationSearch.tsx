import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import DegreeCard from "../components/DegreeCard";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import { FaUniversity } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { FaClock, FaMoneyBillAlt } from "react-icons/fa";

interface Degree {
  _id: string;
  courseId: number;
  degreeId: number;
  degreeName: string;
  name: string;
  institution: string;
  institutionId: string;
  status: string;
  mode: string;
  applicationDeadline: string;
  eligibility: string;
  seatsAvailable: number;
  applicantsApplied: number;
  duration: string;
  tuitionFee: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  statusColor: string; // Make statusColor required to match DegreeCard expectations
}

interface DegreeFilters {
  searchText: string;
  institution: string;
  duration: string;
  mode: string;
  tuitionFee: string;
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
      return "text-green-600";
    case "inactive":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const HigherEducationSearch: React.FC = () => {
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDegrees, setTotalDegrees] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [degreesPerPage, setDegreesPerPage] = useState(8);
  const [filters, setFilters] = useState<DegreeFilters>({
    searchText: "",
    institution: "",
    duration: "",
    mode: "",
    tuitionFee: "",
  });

  useEffect(() => {
    const fetchDegrees = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: degreesPerPage.toString(),
          ...(filters.searchText && { search: filters.searchText }),
          ...(filters.institution && { institution: filters.institution }),
          ...(filters.duration && { duration: filters.duration }),
          ...(filters.mode && { mode: filters.mode }),
          ...(filters.tuitionFee && { tuitionFee: filters.tuitionFee }),
        });

        const response = await fetch(`http://localhost:3000/higherDegrees/getAllHigherDegrees?${queryParams}`);
        const data = await response.json();

        if (data.success) {
          const degreesWithStatusColor = data.degrees.map((degree: any) => ({
            ...degree,
            statusColor: getStatusColor(degree.status), // Always set statusColor
          }));
          setDegrees(degreesWithStatusColor);
          setTotalDegrees(data.total);
        } else {
          setError(data.message || "Failed to fetch degrees");
        }
      } catch (error) {
        console.error("Error fetching degrees:", error);
        setError("Failed to fetch degrees");
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

  // Degree Search Component
  const DegreeSearch: React.FC<{ 
    filters: DegreeFilters; 
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onClear: () => void;
  }> = ({ filters, onFilterChange, onClear }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="searchDiv flex items-center justify-center bg-gradient-to-tr from-[#2E5FB7] to-[#1a365d] rounded-[8px] h-[120px] w-[95%] mx-auto">
          <h2 className="text-center text-4xl font-bold text-white">Find your dream Degree here</h2>
        </div>
        <div className="searchDiv grid gap-10 bg-gray-200 rounded-[8px] p-[3rem] w-[95%] mx-auto">
          <DegreeSearchForm 
            filters={filters} 
            onFilterChange={onFilterChange}
            onSubmit={handleSubmit} 
          />
          <DegreeSearchFilters 
            filters={filters} 
            onFilterChange={onFilterChange} 
            onClear={onClear} 
          />
        </div>
      </div>
    );
  };

  const DegreeSearchForm: React.FC<{ 
    filters: DegreeFilters; 
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
  }> = ({ filters, onFilterChange, onSubmit }) => (
    <form onSubmit={onSubmit}>
      <div className="firstDiv flex items-center justify-between rounded-[8px] gap-[8px] bg-white p-5 shadow-lg shadow-greyIsh-7080">
        <SearchInput
          icon={<AiOutlineSearch className="text-[25px] icon" />}
          name="searchText"
          value={filters.searchText}
          placeholder="Search Degrees..."
          onFilterChange={onFilterChange}
        />
        <SearchInput
          icon={<FaUniversity className="text-[25px] icon" />}
          name="institution"
          value={filters.institution}
          placeholder="Search by Institution..."
          onFilterChange={onFilterChange}
        />
        <SearchInput
          icon={<SlLocationPin className="text-[25px] icon" />}
          name="duration"
          value={filters.duration}
          placeholder="Search by Duration..."
          onFilterChange={onFilterChange}
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
          Search
        </button> 
      </div>
    </form>
  );

  const SearchInput: React.FC<{ 
    icon: React.ReactNode; 
    name: string; 
    value: string; 
    placeholder: string; 
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
  }> = ({ icon, name, value, placeholder, onFilterChange }) => (
    <div className="flex gap-2 items-center flex-grow">
      {icon}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onFilterChange}
        className="bg-transparent text-blue-500 focus:outline-none w-full"
        placeholder={placeholder}
      />
      {value && (
        <AiOutlineCloseCircle
          className="text-[20px] text-[#a7a7a7] hover:text-textColor icon cursor-pointer"
          onClick={() => onFilterChange({ target: { name, value: "" } } as React.ChangeEvent<HTMLInputElement>)}
        />
      )}
    </div>
  );

  const DegreeSearchFilters: React.FC<{ 
    filters: DegreeFilters; 
    onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
    onClear: () => void 
  }> = ({ filters, onFilterChange, onClear }) => (
    <div className="secondDiv flex items-center justify-between rounded-[8px] gap-[8px] bg-white p-5 shadow-lg shadow-greyIsh-7080">
      <FilterSelect
        label="Mode"
        name="mode"
        value={filters.mode}
        options={["Full-time", "Part-time", "Online", "Hybrid"]}
        onFilterChange={onFilterChange}
      />
      <FilterSelect
        label="Tuition Fee"
        name="tuitionFee"
        value={filters.tuitionFee}
        options={["Under $10,000", "$10,000 - $20,000", "$20,000 - $30,000", "Over $30,000"]}
        onFilterChange={onFilterChange}
      />
      <button
        onClick={onClear}
        className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-md"
      >
        Clear Filters
      </button>
    </div>
  );

  const FilterSelect: React.FC<{ 
    label: string; 
    name: string; 
    value: string; 
    options: string[]; 
    onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void 
  }> = ({ label, name, value, options, onFilterChange }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onFilterChange}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All {label}s</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:ml-64">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
          <DegreeSearch filters={filters} onFilterChange={handleFilterChange} onClear={handleClearFilters} />
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-gray-500 text-lg">Loading degrees...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-red-500 text-lg">{error}</span>
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