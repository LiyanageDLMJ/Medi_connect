import React from "react";
import { FaBars, FaSearch, FaBell, FaChevronDown } from "react-icons/fa";
import "../src/admin.css";
import { FaUserCircle } from "react-icons/fa";

const AdminDashboardHeader: React.FC = () => {
  // Read from localStorage safely
  const userString = localStorage.getItem("user");

  let fname ="";
  let lname ="";
  
  if (userString) {
    const user = JSON.parse(userString);
    fname = user.fname;
    lname = user.lname;
  }
  return (
    <div className="w-full flex items-center justify-between px-7 py-4 shadow-sm">
      {/* Search bar */}
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
        </div>
      </div>

      {/* Right side icons and profile */}
      <div className="flex items-center gap-6">
        {/* Notification icon */}
        <div className="relative">
          <FaBell className="textprimary text-lg cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            9
          </span>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://flagcdn.com/gb.svg"
            alt="English"
            className="w-6 h-4 object-cover rounded-sm"
          />
          <span className="text-sm text-gray-700">English</span>
          <FaChevronDown className="text-xs text-gray-500" />
        </div>

        {/* Profile info */}
        <div className="flex items-center gap-2 cursor-pointer">
          <FaUserCircle className="w-8 h-8 text-gray-600" />
          <div className="text-sm text-gray-700 leading-tight">
            <p className="font-medium">{` ${fname} ${lname}`}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
