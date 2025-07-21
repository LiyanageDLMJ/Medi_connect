import React from 'react'
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";


const DashboradAdmin = () => {
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1 overflow-auto md:pl-64"> {/* Add padding on larger screens to account for sidebar */}
    <TopBar />
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-4 ">
     
     
     
      </div>
</div>
</div>
  )
}

export default DashboradAdmin