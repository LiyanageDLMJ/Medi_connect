import React from "react";
import StudentMgtTable from "../../components/UserManagement/StudentMgtTable";

function ManageStudents() {
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-full">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">
          Manage Students
        </h3>
        <StudentMgtTable />
      </div>
    </>
  );
}

export default ManageStudents;
