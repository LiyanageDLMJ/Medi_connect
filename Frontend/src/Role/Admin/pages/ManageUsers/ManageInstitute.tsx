import React from "react";
import InstituteMgtTable from "../../components/UserManagement/InstituteMgtTable";

function ManageInstitute() {
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-full">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">
          Manage Institute
        </h3>
        <InstituteMgtTable />
      </div>
    </>
  );
}

export default ManageInstitute;
