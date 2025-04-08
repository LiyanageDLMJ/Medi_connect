import React from 'react'
import Sidebar from "../components/Sidebar";

const Dashborad = () => {
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1 overflow-auto md:pl-64"> {/* Add padding on larger screens to account for sidebar */}
</div>
</div>
  )
}

export default Dashborad