import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminDashboardHeader from "../components/AdminDashboardHeader";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

import DashboardHome from "./DashboardHome";
import Inbox from "./Inbox";

import ManageDoctors from "./ManageUsers/ManageDoctors";
import ManageStudents from "./ManageUsers/ManageStudents";
import ManageInstitutes from "./ManageUsers/ManageInstitute";
import ManageRecruiters from "./ManageUsers/ManageRecruiters";

import AdminSettings from "./Settings/Admins";
import ProfileSettings from "./Settings/Profile";
import RegisterAdmin from "./Settings/AdminRegister";

import Reports from "./Reports";
import JobListings from "./JobListing";
import CvDataTable from "../components/UserManagement/CvDataTable";
import JobApplicationTable from "../components/JobListing/JobApplicationTable";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>("");

  const renderComponent = () => {
    if (matchPath("/admin/job-applicants/:jobId", location.pathname)) {
      return <JobApplicationTable />;
    } else {

      switch (location.pathname) {
        case "/":
        case "/admin/dashboard":
          return <Reports />;
        case "/admin/dashboard/users/doctors":
          return <ManageDoctors />;
        case "/admin/dashboard/cv-data":
          return <CvDataTable />;
        case "/admin/dashboard/users/students":
          return <ManageStudents />;
        case "/admin/dashboard/users/institutes":
          return <ManageInstitutes />;
        case "/admin/dashboard/users/recruiters":
          return <ManageRecruiters onViewJobs={(companyName: string) => {
            setSelectedCompanyName(companyName);
            navigate('/admin/dashboard/jobs');
          }} />;
        case "/admin/dashboard/reports":
          return <Reports />;
        case "/admin/dashboard/inbox":
          return <Inbox />;
        case "/admin/dashboard/jobs":
          return <JobListings selectedCompanyName={selectedCompanyName} setSelectedCompanyName={setSelectedCompanyName} />;
        case "/admin/dashboard/settings/admins":
          return <AdminSettings />;
        case "/admin/dashboard/settings/profile":
          return <ProfileSettings />;
        case "/admin/dashboard/settings/adminRegister":
          return <RegisterAdmin />;

        default:
          return <Reports />;




      }

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
