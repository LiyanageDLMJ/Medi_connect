import React from 'react'
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import DashboardHome from "./DashboardHome";

const Dashborad = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto ml-64">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)]">
          <DashboardHome />
        </div>
      </div>
    </div>
  )
}

export default Dashborad