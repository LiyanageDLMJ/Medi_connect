import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import React from "react";
import { FaRegHospital } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";

interface SearchFilters {
  searchText: string;
  hospitalName: string;
  location: string;
  field: string;
  jobType: string;
  salaryRange: string;
}

interface SearchProps {
  filters: SearchFilters;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClear: () => void;
}

const Search: React.FC<SearchProps> = ({ filters, onFilterChange, onClear }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="searchDiv flex items-center justify-center bg-gradient-to-tr from-[#2E5FB7] to-[#1a365d] rounded-[8px] h-[120px] w-[95%] mx-auto">
        <h2 className="text-center text-4xl font-bold text-white">Find your dream Job here</h2>
      </div>
      <div className="searchDiv grid gap-10 bg-gray-200 rounded-[8px] p-[3rem] w-[95%] mx-auto">
        <SearchForm 
          filters={filters} 
          onFilterChange={onFilterChange}
          onSubmit={handleSubmit} 
        />
        <SearchFilters 
          filters={filters} 
          onFilterChange={onFilterChange} 
          onClear={onClear} 
        />
      </div>
    </div>
  );
};

const SearchForm: React.FC<{ 
  filters: SearchFilters; 
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ filters, onFilterChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <div className="firstDiv flex items-center justify-between rounded-[8px] gap-[8px] bg-white p-5 shadow-lg shadow-greyIsh-7080">
      <SearchInput
        icon={<AiOutlineSearch className="text-[25px] icon" />}
        name="searchText"
        value={filters.searchText}
        placeholder="Search Jobs..."
        onFilterChange={onFilterChange}
      />
      <SearchInput
        icon={<FaRegHospital className="text-[25px] icon" />}
        name="hospitalName"
        value={filters.hospitalName}
        placeholder="Search by Hospital Name..."
        onFilterChange={onFilterChange}
      />
      <SearchInput
        icon={<SlLocationPin className="text-[25px] icon" />}
        name="location"
        value={filters.location}
        placeholder="Search by Location..."
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
        onClick={() => {
          const event = {
            target: { 
              name, 
              value: "" 
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          onFilterChange(event);
        }}
        className="text-[25px] text-red-500 cursor-pointer hover:text-textColor icon"
      />
    )}
  </div>
);

const SearchFilters: React.FC<{ 
  filters: SearchFilters; 
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  onClear: () => void 
}> = ({ filters, onFilterChange, onClear }) => (
  <div className="secondDiv flex items-center gap-10 justify-center">
    <FilterSelect 
      label="Field" 
      name="field" 
      value={filters.field} 
      options={[
        "Cardiologist", 
        "Pediatrician", 
        "General Physician", 
        "Neurosurgeon", 
        "Orthopedic Surgeon", 
        "Dentist", 
        "Neurologist", 
        "Psychiatrist", 
        "Hematologist", 
        "Radiologist", 
        "Dermatologist"
      ]} 
      onFilterChange={onFilterChange} 
    />
    <FilterSelect 
      label="Type" 
      name="jobType" 
      value={filters.jobType} 
      options={[
        "Part-Time", 
        "Full-Time", 
        "Remote"
      ]} 
      onFilterChange={onFilterChange} 
    />
    <FilterSelect 
      label="Salary" 
      name="salaryRange" 
      value={filters.salaryRange} 
      options={[
        "Above 500,000", 
        "LKR 200,000 - 250,000", 
        "Above 300,000", 
        "Stipend Based",
        "Hourly", 
        "Weekly", 
        "Monthly"
      ]} 
      onFilterChange={onFilterChange} 
    />
    <span 
      onClick={onClear} 
      className="text-[#a1a1a1] cursor-pointer hover:text-red-500"
    >
      Clear All
    </span>
  </div>
);

const FilterSelect: React.FC<{ 
  label: string; 
  name: string; 
  value: string; 
  options: string[]; 
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void 
}> = ({ label, name, value, options, onFilterChange }) => (
  <div className="singleSearch flex gap-2 items-center">
    <label htmlFor={name} className="text-[#808080] font-semibold">
      {label}:
    </label>
    <select
      name={name}
      id={name}
      value={value}
      onChange={onFilterChange}
      className="bg-white rounded-[3px] px-4 py-1"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default Search;