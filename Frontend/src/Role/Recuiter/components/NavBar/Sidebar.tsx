import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiUser,
  FiBriefcase,
  FiList,
  FiUsers,
  FiMessageSquare,
  FiLogOut,
  FiFileText,
} from "react-icons/fi";

const SidebarRecruiter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    {
      label: "Dashboard",
      to: "/recruiter/dashboard",
      icon: <FiHome size={20} />,
    },
    {
      label: "Your Profile",
      to: "/recruiter/profile",
      icon: <FiUser size={20} />,
    },
    {
      label: "CompareCV",
      to: "/recruiter/cvCompare",
      icon: <FiFileText size={20} />,
    },
    {
      label: "Job & Internship Post",
      to: "/recruiter/JobPost",
      icon: <FiBriefcase size={20} />,
    },
    {
      label: "Job Listings",
      to: "/recruiter/JobListing",
      icon: <FiList size={20} />,
    },
    {
      label: "View Candidates",
      to: "/recruiter/ViewCandidates",
      icon: <FiUsers size={20} />,
    },
    {
      label: "Messages",
      to: "/recruiter/messages",
      icon: <FiMessageSquare size={20} />,
    },
  ];

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className="md:hidden p-4 fixed top-0 left-0 z-50 text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 h-screen bg-white shadow-lg z-40 flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between p-7">
            <span className="text-xl font-bold">
              <span className="text-blue-600">Medi</span>Connect
            </span>
            <button className="md:hidden" onClick={() => setIsOpen(false)}>
              <FiMenu size={24} />
            </button>
          </div>

          <nav className="flex flex-col px-4 space-y-2">
            {navLinks.map(({ to, label, icon }) => (
              <button
                key={to}
                onClick={() => {
                  navigate(to);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 text-black hover:bg-[#184389] hover:text-white rounded-[12px] transition-all"
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mb-6">
          {/* Logout Button - always at the bottom */}
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-3 px-4 py-2 text-black hover:bg-red-100 hover:text-red-600 rounded-[12px] transition-all w-[calc(100%-32px)] mx-4"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarRecruiter;
