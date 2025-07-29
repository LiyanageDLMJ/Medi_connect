import { Routes, Route } from "react-router-dom";
import JobApplicationForm from "../pages/Dashboard";
const routes = () => {
  return (
    <div>
      <Routes>
        <Route path="/admin/job-application" element={<JobApplicationForm />} />
        
      </Routes>
    </div>
  );
};

export default routes;
