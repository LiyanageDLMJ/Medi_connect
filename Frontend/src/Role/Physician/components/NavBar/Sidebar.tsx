import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiUser,
  FiFileText,
  FiBriefcase,
  FiBook,
  FiMessageSquare,
  FiCalendar,
  FiSearch,
} from "react-icons/fi";

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Dashboard", to: "/physician/dashboard", icon: <FiHome size={20} /> },
    { label: "Your Profile", to: "/physician/profile", icon: <FiUser size={20} /> },
    { label: "Update CV", to: "/physician/update-cv01", icon: <FiFileText size={20} /> },
    { label: "CompareCV", to: "/physician/cvCompare", icon: <FiFileText size={20} /> },
    {
      label: "Job & Internships",
      to: "/physician/job-internship",
      icon: <FiBriefcase size={20} />,
    },
     {
      label: "Track job Application",
      to: "/physician/job-application-tracker",
      icon: <FiSearch size={20} />,
    },
    {
      label: "Higher Education",
      to: "/physician/higher-education",
      icon: <FiBook size={20} />,
    },
    {
      label: "Messages",
      to: "/physician/messages",
      icon: <FiMessageSquare size={20} />,
    },
    {
      label: "Interview Invitations",
      to: "/physician/interview-invitations",
      icon: <FiCalendar size={20} />,
    },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden p-4 fixed top-0 left-0 z-50 text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 h-screen bg-white shadow-lg transform transition-transform md:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
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

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarNav;
