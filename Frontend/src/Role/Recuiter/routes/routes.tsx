import Sidebar from "../components/NavBar/Sidebar";
import React from 'react'
import { Routes, Route } from 'react-router-dom';
import JobPost from "../pages/JobPost";
import Dashboard from "../pages/Dashboard";
import JobListing from "../pages/JobListing";

const routes = () => {
  return (
    <div>
    <Sidebar />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/jobPost" element={<JobPost />} />
      <Route path="/jobListing" element={<JobListing />} /> 
    </Routes>

    </div>
  )
}

export default routes