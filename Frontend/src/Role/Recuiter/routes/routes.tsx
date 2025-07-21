import Sidebar from "../components/NavBar/Sidebar";
import React from 'react'
import { Routes, Route } from 'react-router-dom';
import JobPost from "../pages/JobPost";
import Dashboard from "../pages/Dashboard";
import JobListing from "../pages/JobListing";
import Messages from "../pages/Messages";

const routes = () => {
  return (
    <div>
    <Sidebar />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/jobPost" element={<JobPost />} />
      <Route path="/jobListing" element={<JobListing />} />
      <Route path="/messages" element={<Messages />} />
    </Routes>

    </div>
  )
}

export default routes