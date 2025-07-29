import React from 'react'
import RecruitersMgtTable from '../../components/UserManagement/RecruiterMgtTable'

function ManageRecruiters({ onViewJobs }: { onViewJobs?: (companyName: string) => void }) {
  return (
    <>
    
    <div className="p-6 bg-gray-50 min-h-full">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">Manage Recruiters</h3>
        <RecruitersMgtTable onViewJobs={onViewJobs} />
      </div>
    
    </>
  )
}

export default ManageRecruiters
