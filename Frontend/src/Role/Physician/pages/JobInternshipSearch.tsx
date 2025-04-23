import { useState } from "react";
import Search from "../components/SearchDiv/Search"; // Adjust the import based on your project structure
import Jobs from "../components/JobDiv/Jobs";
// import NavBar from "../components/NavBar/NavBar";
import Sidebar from "../components/NavBar/Sidebar";


const doctorJobs = [
  {
    id: 1,
    title: "Cardiologist",
    hospital: "Mayo Clinic",
    date: "Feb 10th, 2025",
    location: "New York",
    type: "Internship",
    salary: "Above 500000",
    status: "OPEN",
    statusColor: "bg-green-500",
  },
  {
    id: 2,
    title: "Neurosurgeon",
    hospital: "The Royal London Hospital",
    date: "Mar 5th, 2025",
    location: "London",
    type: "Full-Time",
    salary: "Monthly",
    status: "INTERVIEW",
    statusColor: "bg-blue-500",
  },
  {
    id: 3,
    title: "Pediatrician",
    hospital: "Cleveland Clinic",
    date: "Feb 25th, 2025",
    location: "France",
    type: "Part-Time",
    salary: "Weekly",
    status: "PENDING",
    statusColor: "bg-yellow-500",
  },
  {
    id: 4,
    title: "Orthopedic Surgeon",
    hospital: "Stanford Health Care",
    date: "Apr 1st, 2025",
    location: "California",
    type: "Internship",
    salary: "Monthly",
    status: "CLOSED",
    statusColor: "bg-red-500",
  },
  {
    id: 5,
    title: "General Physician",
    hospital: "Mount Sinai Hospital",
    date: "Jan 30th, 2025",
    location: "Chicago",
    type: "Full-Time",
    salary: "Hourly",
    status: "OPEN",
    statusColor: "bg-green-500",
  },
  {
    id: 6,
    title: "Eye Surgent",
    hospital: "LENOX HILL HOSPITAL",
    date: "Jan 30th, 2025",
    location: "New York",
    type: "Full-Time",
    salary: "Weekly",
    status: "OPEN",
    statusColor: "bg-green-500",
  },
  {
    id: 7,
    title: "Dermatologist",
    hospital: "UCLA Medical Center",
    date: "Feb 15th, 2025",
    location: "Los Angeles",
    type: "Part-Time",
    salary: "Hourly",
    status: "OPEN",
    statusColor: "bg-green-500",
    description:
      "Diagnose and treat various skin conditions using modern therapies and advanced treatments.",
  },
  {
    id: 8,
    title: "Ophthalmologist",
    hospital: "Bascom Palmer Eye Institute",
    date: "Mar 20th, 2025",
    location: "Miami",
    type: "Internship",
    salary: "Monthly",
    status: "INTERVIEW",
    statusColor: "bg-blue-500",
    description:
      "Provide comprehensive eye care, including corrective surgeries and treatment for eye diseases.",
  },
  {
    id: 9,
    title: "Radiologist",
    hospital: "Massachusetts General Hospital",
    date: "Apr 12th, 2025",
    location: "Boston",
    type: "Full-Time",
    salary: "Above 300000",
    status: "PENDING",
    statusColor: "bg-yellow-500",
    description:
      "Interpret medical images to diagnose diseases and collaborate with specialists for optimal patient care.",
  },
  {
    id: 10,
    title: "Cardiologist",
    hospital: "Huoshenshan Hospital",
    date: "Jan 30th, 2024",
    location: "China",
    type: "Part-Time",
    salary: "Monthly",
    status: "OPEN",
    statusColor: "bg-green-500",
  },
  {
    id: 11,
    title: "Dentist",
    hospital: "France Med Dental Clinic",
    date: "Dec 30th, 2024",
    location: "France",
    type: "Part-Time",
    salary: "Hourly",
    status: "OPEN",
    statusColor: "bg-green-500",
  },
  {
    id: 12,
    title: "Plastic Surgent",
    hospital: "Melbourne Private Hospital",
    date: "jan 30th, 2025",
    location: "Melbourne",
    type: "Part-Time",
    salary: "Hourly",
    status: "OPEN",
    statusColor: "bg-green-500",
  },
];

const JobInternshipSearch = () => {
  const [filters, setFilters] = useState({
    searchText: "",
    hospital: "",
    location: "",
    field: "",
    type: "",
    salary: "",
  });

  // ✅ Fixed type for both input and select elements
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
      hospital: "",
      location: "",
      field: "",
      type: "",
      salary: "",
    });
  };

  // ✅ Fix: Allow partial matching for "field" filtering
  const filterBySearchText = (job: typeof doctorJobs[0]) => {
    return !filters.searchText || job.title.toLowerCase().includes(filters.searchText.toLowerCase());
  };

  const filterByHospital = (job: typeof doctorJobs[0]) => {
    return !filters.hospital || job.hospital.toLowerCase().includes(filters.hospital.toLowerCase());
  };

  const filterByLocation = (job: typeof doctorJobs[0]) => {
    return !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
  };

  const filterByField = (job: typeof doctorJobs[0]) => {
    return !filters.field || job.title.toLowerCase().includes(filters.field.toLowerCase());
  };

  const filterByType = (job: typeof doctorJobs[0]) => {
    return !filters.type || job.type.toLowerCase() === filters.type.toLowerCase();
  };

  const filterBySalary = (job: typeof doctorJobs[0]) => {
    return !filters.salary || job.salary.toLowerCase() === filters.salary.toLowerCase();
  };

  const filteredJobs = doctorJobs.filter((job) => {
    return (
      filterBySearchText(job) &&
      filterByHospital(job) &&
      filterByLocation(job) &&
      filterByField(job) &&
      filterByType(job) &&
      filterBySalary(job)
    );
  });

  return (
    <div>
      <Sidebar   />
      <div className="flex-1 overflow-auto md:pl-64">
      <Search filters={filters} onFilterChange={handleFilterChange} onClear={handleClearFilters} />
      <Jobs jobs={filteredJobs} totalJobs={doctorJobs.length} />
      </div>
    </div>
  );
};

export default JobInternshipSearch;
