import React from 'react';
import SystemForm from "../../components/Settings/SystemForm";

function system() {
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-full">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">System Settings</h3>
      
        <SystemForm/>
      
      </div>
    </>
  )
}

export default system
