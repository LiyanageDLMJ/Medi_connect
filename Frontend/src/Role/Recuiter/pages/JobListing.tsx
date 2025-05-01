import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";
import Sidebar from "../components/NavBar/Sidebar";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Menu,
} from "@mui/material";
import DatePicker from "react-datepicker";
import TopBar from "../components/Topbar";

interface Job {
  id: number;
  jobTitle: string;
  status: string;
  mode: string;
  applicationDeadline: string;
  experience: string;
  positions: number;
  applicantsApplied: number;
  salary: string;
  hospital: string;
  department: string;
  specialty: string;
}

const JobListing: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([/* same job data without location */]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterExperience, setFilterExperience] = useState<string>("all");
  const [filterSalary, setFilterSalary] = useState<string>("all");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const handleMenuToggle = (id: number) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const parseSalary = (salary: string): number => {
    const numericPart = salary.match(/\$([0-9,]+)/);
    if (numericPart && numericPart[1]) {
      return parseFloat(numericPart[1].replace(/,/g, "")) || 0;
    }
    return 0;
  };

  let filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    const matchesMode = filterMode === "all" || job.mode === filterMode;
    const matchesExperience = filterExperience === "all" || job.experience === filterExperience;
    const matchesSpecialty = filterSpecialty === "all" || job.specialty === filterSpecialty;

    const salaryValue = parseSalary(job.salary);
    let matchesSalary = true;
    if (filterSalary !== "all") {
      if (filterSalary === "upTo200000") {
        matchesSalary = salaryValue <= 200000;
      } else if (filterSalary === "200001to300000") {
        matchesSalary = salaryValue > 200000 && salaryValue <= 300000;
      } else if (filterSalary === "above300000") {
        matchesSalary = salaryValue > 300000;
      }
    }

    const deadlineDate = new Date(job.applicationDeadline).getTime();
    const [startDate, endDate] = dateRange;
    let matchesDateRange = true;
    if (startDate && endDate) {
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      matchesDateRange = deadlineDate >= startTime && deadlineDate <= endTime;
    }

    return matchesSearch && matchesStatus && matchesMode && matchesExperience && matchesSalary && matchesSpecialty && matchesDateRange;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const statuses = ["all", ...Array.from(new Set(jobs.map((job) => job.status)))];
  const modes = ["all", ...Array.from(new Set(jobs.map((job) => job.mode)))];
  const experiences = ["all", ...Array.from(new Set(jobs.map((job) => job.experience))).sort()];
  const specialties = ["all", ...Array.from(new Set(jobs.map((job) => job.specialty))).sort()];
  const salaryRanges = [
    { value: "all", label: "All Salaries" },
    { value: "upTo200000", label: "Up to $200,000" },
    { value: "200001to300000", label: "$200,001 - $300,000" },
    { value: "above300000", label: "Above $300,000" },
  ];

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = (job: Job) => {
    console.log("View Details for:", job);
    setMenuOpen(null);
  };

  const [startDate, endDate] = dateRange;
  const subtitleText =
    startDate && endDate
      ? `Here is your medical job listings status from ${formatDate(startDate)} - ${formatDate(endDate)}.`
      : "Here is your full medical job listings status.";

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-64">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4 ">
          <div className="flex justify-between items-center bg-white px-4 py-3 rounded-t-lg border-gray-200">
            <div className="space-y-2">
              <h1 className="text-xl font-semibold">Medical Job Listing</h1>
              <p className="text-gray-600 text-sm">{subtitleText}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-lg shadow-sm cursor-pointer relative">
                <FaCalendarAlt className="text-gray-600" />
                <DatePicker
                  selectsRange
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                  placeholderText="Select Date Range"
                  dateFormat="MMM d, yyyy"
                  className="text-gray-700 text-sm border-none outline-none"
                  popperClassName="z-[1000]"
                />
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                + Post a job
              </button>
            </div>
          </div>
          {/* Additional UI rendering code continues... */}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
