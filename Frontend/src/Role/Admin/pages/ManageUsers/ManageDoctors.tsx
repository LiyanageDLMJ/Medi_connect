import React from "react";
import DocMgtTable from "../../components/UserManagement/DocMgtTable";

function ManageDoctors() {
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-full">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">Manage Doctors</h3>
        <DocMgtTable />
      </div>
    </>
  );
}

export default ManageDoctors;
