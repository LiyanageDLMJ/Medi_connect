import React from 'react'
import AdminMgtTable from "../../components/Settings/AdminTable";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

function admins() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:pl-64">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
          <div className="p-6 bg-gray-50 min-h-full">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Manage Admins</h3>
            <AdminMgtTable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default admins
