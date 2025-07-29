import React from 'react';
import RegisterAdmin from "../../components/Settings/RegisterAdmin";

function system() {
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-full">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">Register New Admin</h3>
      
        <RegisterAdmin/>
      
      </div>
    </>
  )
}

export default system
