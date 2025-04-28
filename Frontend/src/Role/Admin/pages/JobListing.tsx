import React from "react";
import JobListingTable from "../components/JobListing/JobsTable";

const JobListings: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h3 className="text-3xl font-bold text-gray-800 mb-8">Job Listings</h3>
      <JobListingTable />
    </div>
  );
};

export default JobListings;
