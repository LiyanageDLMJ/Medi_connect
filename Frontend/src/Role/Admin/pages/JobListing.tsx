import React, { useState } from "react";
import JobListingTable from "../components/JobListing/JobsTable";

const JobListings: React.FC<{ selectedCompanyName?: string, setSelectedCompanyName?: (name: string) => void }> = ({ selectedCompanyName, setSelectedCompanyName }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h3 className="text-3xl font-bold text-gray-800 mb-8">Job Listings</h3>
      <JobListingTable selectedCompanyName={selectedCompanyName || ""} setSelectedCompanyName={setSelectedCompanyName} />
    </div>
  );
};

export default JobListings;
