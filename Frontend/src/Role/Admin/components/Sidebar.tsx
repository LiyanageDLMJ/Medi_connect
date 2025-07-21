import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiInbox, FiBriefcase, FiSettings, FiChevronDown, FiChevronUp } from "react-icons/fi";

const Sidebar = () => {
  const [usersOpen, setUsersOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  return (
    <div className="w-64 bg-white h-full shadow-md">
      <nav className="flex flex-col p-4">
        <NavLink to="/admin/dashboard" className="mb-4 flex items-center gap-2">
          <FiHome /> Dashboard
        </NavLink>

        {/* Manage Users */}
        <button
          className="mb-2 flex items-center gap-2 w-full text-left focus:outline-none"
          onClick={() => setUsersOpen(o => !o)}
        >
          <FiUsers /> Manage Users {usersOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {usersOpen && (
          <div className="ml-6 flex flex-col gap-1 mb-2">
            <NavLink to="/admin/manage-users/doctors" className="text-sm">Doctors</NavLink>
            <NavLink to="/admin/manage-users/students" className="text-sm">Students</NavLink>
            <NavLink to="/admin/manage-users/institutes" className="text-sm">Institutes</NavLink>
            <NavLink to="/admin/manage-users/recruiters" className="text-sm">Recruiters</NavLink>
          </div>
        )}

        <NavLink to="/admin/inbox" className="mb-4 flex items-center gap-2">
          <FiInbox /> Inbox
        </NavLink>
        <NavLink to="/admin/job-listings" className="mb-4 flex items-center gap-2">
          <FiBriefcase /> Job Listings
        </NavLink>
        <NavLink to="/admin/feedbacks" className="mb-4 flex items-center gap-2">
          {/* You can use a feedback icon here if desired */}
          Feedbacks
        </NavLink>
        
        <NavLink to="/admin/faq-add" className="mb-4 flex items-center gap-2">
          {/* You can use a plus or edit icon here if desired */}
          Add FAQ
        </NavLink>

        {/* Settings */}
        <button
          className="mb-2 flex items-center gap-2 w-full text-left focus:outline-none"
          onClick={() => setSettingsOpen(o => !o)}
        >
          <FiSettings /> Settings {settingsOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {settingsOpen && (
          <div className="ml-6 flex flex-col gap-1">
            <NavLink to="/admin/settings/profile" className="text-sm">Profile & Account</NavLink>
            <NavLink to="/admin/settings/manage-admins" className="text-sm">Manage Admins</NavLink>
            <NavLink to="/admin/settings/register-admin" className="text-sm">Register Admin</NavLink>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar; 