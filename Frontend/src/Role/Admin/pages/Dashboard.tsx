import React from "react";
import Sidebar from "../components/Sidebar";
import AdminDashboardHeader from "../components/AdminDashboardHeader";
import { useLocation } from "react-router-dom";

import DashboardHome from "./DashboardHome";
import Inbox from "./Inbox";

import ManageDoctors from "./ManageUsers/ManageDoctors";
import ManageStudents from "./ManageUsers/ManageStudents";
import ManageInstitutes from "./ManageUsers/ManageInstitute";
import ManageRecruiters from "./ManageUsers/ManageRecruiters";

import AdminSettings from "./Settings/admins";
import ProfileSettings from "./Settings/profile";
import SystemSettings from "./Settings/system";

import Reports from "./Reports";
import JobListings from "./JobListing";

const Dashboard = () => {
  const location = useLocation();

  const renderComponent = () => {
    switch (location.pathname) {
      case "/":
      case "/admin/dashboard":
        return <DashboardHome />;
      case "/admin/dashboard/users/doctors":
        return <ManageDoctors />;
      case "/admin/dashboard/users/students":
        return <ManageStudents />;
      case "/admin/dashboard/users/institutes":
        return <ManageInstitutes />;
      case "/admin/dashboard/users/recruiters":
        return <ManageRecruiters />;
      case "/admin/dashboard/reports":
        return <Reports />;
      case "/admin/dashboard/inbox":
        return <Inbox />;
      case "/admin/dashboard/jobs":
        return <JobListings />;
      case "/admin/dashboard/settings/admins":
        return <AdminSettings />;
      case "/admin/dashboard/settings/profile":
        return <ProfileSettings />;
      case "/admin/dashboard/settings/system":
        return <SystemSettings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header Bar */}
        <AdminDashboardHeader />

        {/* Routes Configuration */}
        <div className="p-6">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
