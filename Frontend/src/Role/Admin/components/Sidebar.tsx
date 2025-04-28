import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../src/admin.css";

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ${
        sidebarOpen ? "w-64 px-1" : "w-16 px-1"
      } bg-white shadow-md overflow-hidden`}
    >
      <div className="p-6 flex justify-between items-center w-full">
        <h4
          className={`${
            sidebarOpen ? "inline" : "hidden"
          } text-2xl font-bold textprimary`}
        >
          Medi
          <span className="text-gray-800">Help</span>
        </h4>
        <FaBars
          className="text-gray-600 text-xl cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      <nav className="mt-2">
        {/* Dashboard Link - Unchanged */}
        <Link to="/admin/dashboard" className="mb-1">
          <span
            className={`flex ${
              sidebarOpen
                ? "items-center space-x-3 px-6 py-3"
                : "justify-center py-3"
            } text-gray-700 bghover textHover cursor-pointer transition-all duration-300 rounded-md`}
          >
            <svg
              className={`${sidebarOpen ? "w-5 h-5" : "w-6 h-6"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
              Dashboard
            </span>
          </span>
        </Link>

        <div className="mb-1">
          <div onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <span
              className={`flex ${
                sidebarOpen
                  ? "items-center space-x-3 px-6 py-3"
                  : "justify-center py-3"
              } text-gray-800 bghover textHover cursor-pointer transition-all duration-300 rounded-md`}
            >
              <div className="flex items-center space-x-3 ">
                <svg
                  className={` ${sidebarOpen ? "w-5 h-5" : "w-6 h-6"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {sidebarOpen && <span>Manage Users</span>}
              </div>
            </span>
          </div>

          <AnimatePresence>
            {sidebarOpen && userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <Link to="/admin/dashboard/users/doctors">
                  <span className="flex items-center space-x-3 pl-14 pr-6 py-3 text-sm text-gray-500 textHoverPrimary  hover:bg-indigo-50 ">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>Doctors</span>
                  </span>
                </Link>
                <Link to="/admin/dashboard/users/students">
                  <span className="flex items-center space-x-3 pl-14 pr-6 py-3 text-sm text-gray-500 textHoverPrimary  hover:bg-indigo-50 ">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>Students</span>
                  </span>
                </Link>
                <Link to="/admin/dashboard/users/institutes">
                  <span className="flex items-center space-x-3 pl-14 pr-6 py-3 text-sm text-gray-500 textHoverPrimary  hover:bg-indigo-50 ">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>Institutes</span>
                  </span>
                </Link>
                <Link to="/admin/dashboard/users/recruiters">
                  <span className="flex items-center space-x-3 pl-14 pr-6 py-3 text-sm text-gray-500 textHoverPrimary  hover:bg-indigo-50 ">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>Recruiters</span>
                  </span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reports Link - Unchanged */}
        <Link to="/admin/dashboard/reports" className="mb-1">
          <span
            className={`flex ${
              sidebarOpen
                ? "items-center space-x-3 px-6 py-3"
                : "justify-center py-3"
            } text-gray-700 bghover textHover cursor-pointer transition-all duration-300 rounded-md`}
          >
            <svg
              className={`${sidebarOpen ? "w-5 h-5" : "w-6 h-6"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
              Reports
            </span>
          </span>
        </Link>

        {/* Inbox Link - Unchanged */}
        <Link to="/admin/dashboard/inbox" className="mb-1">
          <span
            className={`flex ${
              sidebarOpen
                ? "items-center space-x-3 px-6 py-3"
                : "justify-center py-3"
            } text-gray-700 bghover textHover cursor-pointer transition-all duration-300 rounded-md`}
          >
            <svg
              className={`${sidebarOpen ? "w-5 h-5" : "w-6 h-6"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
              Inbox
            </span>
          </span>
        </Link>

        {/* Job Listings Link - Unchanged */}
        <Link to="/admin/dashboard/jobs" className="mb-1">
          <span
            className={`flex ${
              sidebarOpen
                ? "items-center space-x-3 px-6 py-3"
                : "justify-center py-3"
            } text-gray-700 bghover textHover cursor-pointer transition-all duration-300 rounded-md mb-3`}
          >
            <svg
              className={`${sidebarOpen ? "w-5 h-5" : "w-6 h-6"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className={`${sidebarOpen ? "inline" : "hidden"}`}>
              Job Listings
            </span>
          </span>
        </Link>

        <hr className="  border-gray-300 mb-3 " />

        <div>
          <div onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}>
            <span
              className={`flex ${
                sidebarOpen
                  ? "items-center space-x-3 px-6 py-3"
                  : "justify-center py-3"
              } text-gray-800 bghover textHover cursor-pointer transition-all duration-300 rounded-md`}
            >
              <div className="flex items-center space-x-3  ">
              <svg
  className={`${sidebarOpen ? "w-5 h-5" : "w-6 h-6"}`}
  fill="none"
  stroke="currentColor"  // Inherits text color
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  />
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  />
</svg>
                {sidebarOpen && <span>Settings</span>}
              </div>
            </span>
          </div>

          <AnimatePresence>
            {sidebarOpen && settingsMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <Link to="/admin/dashboard/settings/profile">
                  <span className="flex items-center space-x-3 pl-14 pr-6 py-3 text-sm text-gray-500 textHoverPrimary  hover:bg-indigo-50 ">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>Profile & Account</span>
                  </span>
                </Link>
                <Link to="/admin/dashboard/settings/admins">
                  <span className="flex items-center space-x-3 pl-14 pr-6 py-3 text-sm text-gray-500 textHoverPrimary  hover:bg-indigo-50 ">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>Manage Admins</span>
                  </span>
                </Link>
                <Link to="/admin/dashboard/settings/system">
                  <span className="flex items-center space-x-3 pl-14 pr-6 py-3 text-sm text-gray-500 textHoverPrimary  hover:bg-indigo-50 ">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>System Settings</span>
                  </span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
