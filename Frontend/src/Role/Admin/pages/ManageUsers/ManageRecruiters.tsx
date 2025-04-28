import React from 'react'
import RecruitersMgtTable from '../../components/UserManagement/RecruiterMgtTable'

function ManageRecruiters() {
  return (
    <>
    
    <div className="p-6 bg-gray-50 min-h-full">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">Manage Recruiters</h3>
        <RecruitersMgtTable />
      </div>
    
    </>
  )
}

export default ManageRecruiters
