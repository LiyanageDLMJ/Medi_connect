import React from 'react'
import AdminMgtTable from "../../components/Settings/AdminTable";

function admins() {
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-full">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">Manage Admins</h3>
        <AdminMgtTable />
      </div>
    </>
  )
}

export default admins
