import { useState } from "react";
import Search from "../components/DegreeDiv/DegreeSearch"; // Adjusted to the new search component for degree programs
import DegreeCard from "../components/DegreeDiv/DegreeCard"; // Adjusted to display degree programs
import NavBar from "../components/NavBar/NavBar";

const degreePrograms = [
  {
    id: 1,
    name: "MBBS (Bachelor of Medicine & Surgery)",
    institution: "Harvard Medical School",
    duration: "6 Years",
    location: "USA",
    type: "Full-Time",
    tuition: "Above $50,000",
    status: "OPEN",
    statusColor: "bg-green-500",
  },
  {
    id: 2,
    name: "MSc in Clinical Medicine",
    institution: "Oxford University",
    duration: "2 Years",
    location: "UK",
    type: "Full-Time",
    tuition: "Above $30,000",
    status: "INTERVIEW",
    statusColor: "bg-blue-500",
  },
  {
    id: 3,
    name: "Bachelor of Nursing",
    institution: "University of Sydney",
    duration: "4 Years",
    location: "Australia",
    type: "Part-Time",
    tuition: "Above $20,000",
    status: "PENDING",
    statusColor: "bg-yellow-500",
  },
  {
    id: 4,
    name: "PhD in Public Health",
    institution: "Johns Hopkins University",
    duration: "4-6 Years",
    location: "USA",
    type: "Full-Time",
    tuition: "Funded",
    status: "CLOSED",
    statusColor: "bg-red-500",
  },
];

const HigherEducationSearch = () => {
  const [filters, setFilters] = useState({
    searchText: "",
    institution: "",
    location: "",
    field: "",
    degreeType: "",
    tuition: "",
  });

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
      location: "",
      field: "",
      degreeType: "",
      tuition: "",
    });
  };

  const filterBySearchText = (degree: typeof degreePrograms[0]) => {
    return !filters.searchText || degree.name.toLowerCase().includes(filters.searchText.toLowerCase());
  };

  const filterByInstitution = (degree: typeof degreePrograms[0]) => {
    return !filters.institution || degree.institution.toLowerCase().includes(filters.institution.toLowerCase());
  };

  const filterByLocation = (degree: typeof degreePrograms[0]) => {
    return !filters.location || degree.location.toLowerCase().includes(filters.location.toLowerCase());
  };

  const filterByProgramCategory = (degree: typeof degreePrograms[0]) => {
    return !filters.field || degree.name.toLowerCase().includes(filters.field.toLowerCase());
  };

  const filterByStudyMode = (degree: typeof degreePrograms[0]) => {
    return !filters.degreeType || degree.type.toLowerCase() === filters.degreeType.toLowerCase();
  };

  const filterByTuitionType = (degree: typeof degreePrograms[0]) => {
    return !filters.tuition || degree.tuition.toLowerCase() === filters.tuition.toLowerCase();
  };

  const filteredDegrees = degreePrograms.filter((degree) => {
    return (
      filterBySearchText(degree) &&
      filterByInstitution(degree) &&
      filterByLocation(degree) &&
      filterByProgramCategory(degree) &&
      filterByStudyMode(degree) &&
      filterByTuitionType(degree)
    );
  });

  return (
    <div>
      <NavBar />
      <Search filters={filters} onFilterChange={handleFilterChange} onClear={handleClearFilters} />
      <DegreeCard degrees={filteredDegrees} totalDegrees={degreePrograms.length} />
    </div>
  );
};

export default HigherEducationSearch;
