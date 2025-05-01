import { useState, useEffect } from "react";
import axios from "axios"; // Install axios if not already installed
import Search from "../components/SearchDiv/Search";
import Jobs from "../components/JobDiv/Jobs";
import Sidebar from "../components/NavBar/Sidebar";

const JobInternshipSearch = () => {
  const [filters, setFilters] = useState({
    searchText: "",
    hospitalName: "",
    location: "",
    field: "",
    jobType: "",
    salaryRange: "",
  });

  const [jobs, setJobs] = useState([]); // State to store jobs fetched from the backend
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors

  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/JobPost/viewJobs");
        setJobs(response.data); // Save the fetched jobs to state
        setLoading(false);
      } catch (err: any) {
        setError("Failed to fetch jobs. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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
      hospitalName: "",
      location: "",
      field: "",
      jobType: "",
      salaryRange: "",
    });
  };

  const filterBySearchText = (job: any) => {
    return !filters.searchText || job.title.toLowerCase().includes(filters.searchText.toLowerCase());
  };

  const filterByHospital = (job: any) => {
    return !filters.hospitalName || job.hospitalName.toLowerCase().includes(filters.hospitalName.toLowerCase());
  };

  const filterByLocation = (job: any) => {
    return !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
  };

  const filterByField = (job: any) => {
    return !filters.field || job.title.toLowerCase().includes(filters.field.toLowerCase());
  };

  const filterByType = (job: any) => {
    return !filters.jobType || job.jobType.toLowerCase() === filters.jobType.toLowerCase();
  };

  const filterBySalary = (job: any) => {
    return !filters.salaryRange || job.salaryRange.toLowerCase() === filters.salaryRange.toLowerCase();
  };

  const filteredJobs = jobs.filter((job: any) => {
    return (
      filterBySearchText(job) &&
      filterByHospital(job) &&
      filterByLocation(job) &&
      filterByField(job) &&
      filterByType(job) &&
      filterBySalary(job)
    );
  });

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-64">
        <Search filters={filters} onFilterChange={handleFilterChange} onClear={handleClearFilters} />
        <Jobs jobs={filteredJobs} totalJobs={jobs.length} />
      </div>
    </div>
  );
};

export default JobInternshipSearch;
