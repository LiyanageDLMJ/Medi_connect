import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiUser,
  FiMessageSquare,
  FiBook,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiFileText,
} from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const upperLinks = [
    { to: "/higher-education/dashboard", label: "Dashboard", icon: <FiHome size={20} /> },
    { to: "/higher-education/update-profile", label: "Your Profile", icon: <FiUser size={20} /> },
    { to: "/higher-education/messages", label: "Messages", icon: <FiMessageSquare size={20} /> },
    {
      to: "/higher-education/degree-listing",
      label: "Degree Listings",
      icon: <FiBook size={20} />,
    },
    {
      to: "/higher-education/view-applications",
      label: "View Applications",
      icon: <FiBook size={20} />,
    },
  ];

  return (
    <>
      <button
        className="sidebar-toggle md:hidden p-4 fixed top-0 left-0 z-50 text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu size={24} />
      </button>

      <div
        className={`sidebar-container fixed inset-y-0 left-0 w-64 h-screen bg-white shadow-lg transform transition-transform md:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
        style={{ minHeight: '100vh', position: 'relative' }}
      >
        <div className="sidebar-header flex items-center justify-between p-7">
          <span className="text-xl font-bold">
            <span className="text-blue-600">Medi</span>Connect
          </span>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <FiMenu size={24} />
          </button>
        </div>

        <nav className="sidebar-nav flex-1 px-2 space-y-1">
          {upperLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#184389] rounded-[12px] shadow-md transition-all"
                  : "flex items-center px-4 py-2 text-black hover:bg-[#184389] hover:text-white hover:rounded-[12px] hover:shadow-md transition-all"
              }
            >
              <span className="mr-3">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Divider */}
          <div className="my-6 border-t border-gray-200 mx-2" />

        </nav>
        {/* Logout Button - absolutely positioned at the bottom */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-2 text-black hover:bg-red-100 hover:text-red-600 rounded-[12px] transition-all"
          style={{ position: 'absolute', bottom: 24, left: 16, right: 16, width: 'calc(100% - 32px)' }}
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {isOpen && (
        <div
          className="sidebar-overlay fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
