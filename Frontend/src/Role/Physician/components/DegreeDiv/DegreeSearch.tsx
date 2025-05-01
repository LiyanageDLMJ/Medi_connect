import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import { FaUniversity } from "react-icons/fa";

interface SearchFilters {
  searchText: string;
  institution: string;
  duration: string;
  mode: string;
  tuitionFee: string;
}

interface SearchProps {
  filters: SearchFilters;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClear: () => void;
}

const Search: React.FC<SearchProps> = ({ filters, onFilterChange, onClear }) => {
  const [durationOptions, setDurationOptions] = useState<string[]>([]);
  const [modeOptions, setModeOptions] = useState<string[]>([]);
  const [tuitionFeeOptions] = useState<string[]>(["Below 10,000", "10,000-30,000", "Above 30,000"]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch("http://localhost:3000/higherDegrees/filters");
        const data = await response.json();
        setDurationOptions(data.durations || []);
        setModeOptions(data.modes || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilterOptions();
  }, []);

  return (
    <div className="searchDiv grid gap-10 bg-gray-200 rounded-[8px] p-[3rem] w-[90%] mx-auto">
      <SearchForm filters={filters} onFilterChange={onFilterChange} />
      <SearchFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onClear={onClear}
        durationOptions={durationOptions}
        modeOptions={modeOptions}
        tuitionFeeOptions={tuitionFeeOptions}
      />
    </div>
  );
};

interface SearchFiltersProps extends SearchProps {
  durationOptions: string[];
  modeOptions: string[];
  tuitionFeeOptions: string[];
}

const SearchForm: React.FC<{ filters: SearchFilters; onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ filters, onFilterChange }) => (
  <form onSubmit={(e) => e.preventDefault()}>
    <div className="firstDiv flex items-center justify-between rounded-[8px] gap-[8px] bg-white p-5 shadow-lg shadow-greyIsh-7080">
      <SearchInput
        icon={<AiOutlineSearch className="text-[25px] icon" />}
        name="searchText"
        value={filters.searchText}
        placeholder="Search Programs..."
        onFilterChange={onFilterChange}
      />
      <SearchInput
        icon={<FaUniversity className="text-[25px] icon" />}
        name="institution"
        value={filters.institution}
        placeholder="Search by Institution..."
        onFilterChange={onFilterChange}
      />
      <button type="submit" className="button">
        Search
      </button>
    </div>
  </form>
);

const SearchInput: React.FC<{ icon: React.ReactNode; name: string; value: string; placeholder: string; onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ icon, name, value, placeholder, onFilterChange }) => (
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
        onClick={() => onFilterChange({ target: { name, value: "" } } as unknown as React.ChangeEvent<HTMLInputElement>)}
        className="text-[25px] text-red-500 cursor-pointer hover:text-textColor icon"
      />
    )}
  </div>
);

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange, onClear, durationOptions, modeOptions, tuitionFeeOptions }) => (
  <div className="secondDiv flex items-center gap-10 justify-center">
    <FilterSelect label="Duration" name="duration" value={filters.duration} options={durationOptions} onFilterChange={onFilterChange} />
    <FilterSelect label="Mode" name="mode" value={filters.mode} options={modeOptions} onFilterChange={onFilterChange} />
    <FilterSelect label="Fees" name="tuitionFee" value={filters.tuitionFee} options={tuitionFeeOptions} onFilterChange={onFilterChange} />
    <span onClick={onClear} className="text-[#a1a1a1] cursor-pointer">
      Clear All
    </span>
  </div>
);

const FilterSelect: React.FC<{ label: string; name: string; value: string; options: string[]; onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ label, name, value, options, onFilterChange }) => (
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