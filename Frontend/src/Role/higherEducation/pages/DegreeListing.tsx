import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiFilter, FiGlobe } from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Menu,
} from "@mui/material";
import DatePicker from "react-datepicker";
import TopBar from "../components/TopBar";
import "react-datepicker/dist/react-datepicker.css";

interface Degree {
  id: number;
  degreeName: string;
  status: string;
  mode: string;
  applicationDeadline: string;
  eligibility: string;
  seatsAvailable: number;
  applicantsApplied: number;
  duration: string;
  tuitionFee: string;
}

const DegreeListing: React.FC = () => {
  const navigate = useNavigate();
  const [degree, setDegree] = useState<Degree[]>([
    {
      id: 1,
      degreeName: "Software Engineering",
      status: "Open",
      mode: "Online",
      applicationDeadline: "2024-03-20",
      eligibility: "Bachelor's in Computer Science or equivalent",
      seatsAvailable: 3,
      applicantsApplied: 23,
      duration: "4 Years",
      tuitionFee: "$15,000 per year",
    },
    {
      id: 2,
      degreeName: "UI/UX Design",
      status: "Closed",
      mode: "Offline",
      applicationDeadline: "2024-03-10",
      eligibility: "Bachelor's degree in Design or related field",
      seatsAvailable: 1,
      applicantsApplied: 15,
      duration: "2 Years",
      tuitionFee: "$10,000 per year",
    },
    {
      id: 3,
      degreeName: "Data Science",
      status: "Open",
      mode: "Hybrid",
      applicationDeadline: "2024-04-05",
      eligibility: "Bachelor's in Mathematics, Statistics, or CS",
      seatsAvailable: 5,
      applicantsApplied: 12,
      duration: "3 Years",
      tuitionFee: "$12,500 per year",
    },
    {
      id: 4,
      degreeName: "Cyber Security",
      status: "Closed",
      mode: "Offline",
      applicationDeadline: "2024-02-28",
      eligibility: "Bachelor's in IT or Security-related field",
      seatsAvailable: 2,
      applicantsApplied: 18,
      duration: "3 Years",
      tuitionFee: "$14,000 per year",
    },
    {
      id: 5,
      degreeName: "Artificial Intelligence",
      status: "Open",
      mode: "Online",
      applicationDeadline: "2024-05-15",
      eligibility: "Bachelor's in Computer Science or AI specialization",
      seatsAvailable: 4,
      applicantsApplied: 10,
      duration: "4 Years",
      tuitionFee: "$16,000 per year",
    },
    {
      id: 6,
      degreeName: "Artificial Intelligence",
      status: "Open",
      mode: "Online",
      applicationDeadline: "2024-05-15",
      eligibility: "Bachelor's in Computer Science or AI specialization",
      seatsAvailable: 4,
      applicantsApplied: 10,
      duration: "4 Years",
      tuitionFee: "$16,000 per year",
    },
    {
      id: 7,
      degreeName: "Artificial Intelligence",
      status: "Open",
      mode: "Online",
      applicationDeadline: "2024-05-15",
      eligibility: "Bachelor's in Computer Science or AI specialization",
      seatsAvailable: 4,
      applicantsApplied: 10,
      duration: "4 Years",
      tuitionFee: "$16,000 per year",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterDuration, setFilterDuration] = useState<string>("all");
  const [filterTuitionFee, setFilterTuitionFee] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const handleMenuToggle = (id: number) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const parseTuitionFee = (fee: string): number => {
    const numericPart = fee.replace(/[^0-9.]/g, "");
    return parseFloat(numericPart) || 0;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterMode("all");
    setFilterDuration("all");
    setFilterTuitionFee("all");
    setDateRange([null, null]);
    setAnchorEl(null);
  };

  let filteredDegrees = degree.filter((deg) => {
    const matchesSearch = deg.degreeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || deg.status === filterStatus;
    const matchesMode = filterMode === "all" || deg.mode === filterMode;
    const matchesDuration = filterDuration === "all" || deg.duration === filterDuration;

    const tuitionFeeValue = parseTuitionFee(deg.tuitionFee);
    let matchesTuitionFee = true;
    if (filterTuitionFee !== "all") {
      if (filterTuitionFee === "upTo10000") {
        matchesTuitionFee = tuitionFeeValue <= 10000;
      } else if (filterTuitionFee === "10001to15000") {
        matchesTuitionFee = tuitionFeeValue > 10000 && tuitionFeeValue <= 15000;
      } else if (filterTuitionFee === "above15000") {
        matchesTuitionFee = tuitionFeeValue > 15000;
      }
    }

    const deadlineDate = new Date(deg.applicationDeadline).getTime();
    const [startDate, endDate] = dateRange;
    let matchesDateRange = true;
    if (startDate && endDate) {
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      matchesDateRange = deadlineDate >= startTime && deadlineDate <= endTime;
    }

    return matchesSearch && matchesStatus && matchesMode && matchesDuration && matchesTuitionFee && matchesDateRange;
  });

  const statuses = ["all", ...Array.from(new Set(degree.map((deg) => deg.status)))];
  const modes = ["all", ...Array.from(new Set(degree.map((deg) => deg.mode)))];
  const durations = ["all", ...Array.from(new Set(degree.map((deg) => deg.duration))).sort()];
  const tuitionFeeRanges = [
    { value: "all", label: "All Fees" },
    { value: "upTo10000", label: "Up to $10,000" },
    { value: "10001to15000", label: "$10,001 - $15,000" },
    { value: "above15000", label: "Above $15,000" },
  ];

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = (degree: Degree) => {
    console.log("View Details for:", degree);
    setMenuOpen(null);
  };

  const [startDate, endDate] = dateRange;
  const subtitleText =
    startDate && endDate
      ? `Here is your degrees listing status from ${formatDate(startDate)} - ${formatDate(endDate)}.`
      : "Here is your full degrees listing status.";

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:pl-64">
        <TopBar />
        <div className="p-4">
          <div className="flex items-center bg-white px-3 py-1 rounded-t-lg border-gray-200">
            <div className="flex items-center justify-start w-1/2">
              <div className="space-y-2 md:space-y-3">
                <h1
                  className="text-5xl font-semibold m-0 text-[50px]"
                  style={{ fontSize: "50px" }}
                >
                  Degree Listing
                </h1>
                <p className="text-gray-600 text-base m-0 px-1">{subtitleText}</p>
              </div>
            </div>
            <div className="flex flex-col items-end w-1/2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 border rounded-lg shadow-sm cursor-pointer relative">
                  <FaCalendarAlt className="text-gray-700" />
                  <DatePicker
                    selectsRange
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    onChange={(update: [Date | null, Date | null]) => {
                      setDateRange(update);
                    }}
                    placeholderText="Select Date Range"
                    dateFormat="MMM d, yyyy"
                    className="text-gray-700 text-sm border-none outline-none"
                    popperClassName="z-[1000]"
                  />
                </div>
                <button
                  onClick={() => navigate("/postdegree")}
                  className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Post a degree
                </button>
              </div>
              <div className="flex items-center gap-3">
                <TextField
                  placeholder="search by degree"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="standard"
                  size="small"
                  className="w-40"
                  style={{ zIndex: 1 }}
                  InputProps={{
                    style: {
                      fontSize: "1rem",
                      padding: "4px 8px",
                      border: "1px solid #D3D3D3",
                      borderRadius: "4px",
                    },
                    disableUnderline: true,
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      background: "transparent",
                    },
                    "& .MuiInputBase-input": {
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      "&::placeholder": {
                        color: "#333333",
                        fontSize: "1rem",
                        opacity: 1,
                      },
                    },
                  }}
                />
                <button
                  className="flex items-center gap-1 text-gray-700 border px-2 py-1.5 rounded-md hover:bg-gray-100"
                  onClick={handleFilterClick}
                >
                  <FiFilter />
                  Filters
                </button>
                <button
                  className="flex items-center gap-1 text-gray-700 border px-3 py-1.5 rounded-md hover:bg-gray-100"
                  onClick={clearFilters}
                >
                  Clear 
                </button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleFilterClose}
                  PaperProps={{
                    style: { padding: "16px", minWidth: "200px", zIndex: 1000 },
                  }}
                >
                  <Box display="flex" flexDirection="column" gap={2} p={1}>
                    <FormControl variant="outlined" size="small">
                      <InputLabel>Filter by Status</InputLabel>
                      <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as string)}
                        label="Filter by Status"
                      >
                        {statuses.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status === "all" ? "All Statuses" : status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small">
                      <InputLabel>Filter by Mode</InputLabel>
                      <Select
                        value={filterMode}
                        onChange={(e) => setFilterMode(e.target.value as string)}
                        label="Filter by Mode"
                      >
                        {modes.map((mode) => (
                          <MenuItem key={mode} value={mode}>
                            {mode === "all" ? "All Modes" : mode}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small">
                      <InputLabel>Filter by Duration</InputLabel>
                      <Select
                        value={filterDuration}
                        onChange={(e) => setFilterDuration(e.target.value as string)}
                        label="Filter by Duration"
                      >
                        {durations.map((duration) => (
                          <MenuItem key={duration} value={duration}>
                            {duration === "all" ? "All Durations" : duration}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small">
                      <InputLabel>Filter by Tuition Fee</InputLabel>
                      <Select
                        value={filterTuitionFee}
                        onChange={(e) => setFilterTuitionFee(e.target.value as string)}
                        label="Filter by Tuition Fee"
                      >
                        {tuitionFeeRanges.map((range) => (
                          <MenuItem key={range.value} value={range.value}>
                            {range.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Menu>
              </div>
            </div>
          </div>
          <div className="px-4 mt-4 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-b-lg">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left">Degree Name</th>
                  <th className="p-3 text-center">Duration</th>
                  <th className="p-3 text-center">Mode</th>
                  <th className="p-3 text-center">Application Deadline</th>
                  <th className="p-3 text-center">Seats Available</th>
                  <th className="p-3 text-center">Applicants Applied</th>
                  <th className="p-3 text-center">Tuition Fee</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDegrees.map((degree, index) => (
                  <tr
                    key={degree.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="p-3">{degree.degreeName}</td>
                    <td className="p-3 text-center">{degree.duration}</td>
                    <td className="p-3 text-center">{degree.mode}</td>
                    <td className="p-3 text-center">{formatDate(degree.applicationDeadline)}</td>
                    <td className="p-3 text-center">{degree.seatsAvailable}</td>
                    <td className="p-3 text-center">{degree.applicantsApplied}</td>
                    <td className="p-3 text-center">{degree.tuitionFee}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`w-16 h-8 flex items-center justify-center px-2 py-1 text-sm font-medium rounded-full ${
                          degree.status === "Open"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {degree.status}
                      </span>
                    </td>
                    <td className="p-3 text-center relative">
                      <button onClick={() => handleMenuToggle(degree.id)}>
                        <BsThreeDotsVertical className="text-gray-600 hover:text-gray-800" />
                      </button>
                      {menuOpen === degree.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
                          <button
                            onClick={() => console.log("Edit", degree.id)}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDegree((prevDegrees) =>
                                prevDegrees.filter((deg) => deg.id !== degree.id)
                              )
                            }
                            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleViewDetails(degree)}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegreeListing;