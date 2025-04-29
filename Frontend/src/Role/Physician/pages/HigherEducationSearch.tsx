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

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
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
      }
    };
    fetchDegrees();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchText: "",
      institution: "",
      duration: "",
      mode: "",
      tuitionFee: "",
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-60">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
          <Search filters={filters} onFilterChange={handleFilterChange} onClear={handleClearFilters} />
          <DegreeCard degrees={degrees} totalDegrees={totalDegrees} />
        </div>
      </div>
    </div>
  );
};

export default HigherEducationSearch;