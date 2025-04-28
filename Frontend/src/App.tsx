import { Routes, Route } from "react-router-dom";
import JobInternshipSearch from "./Role/Physician/pages/JobInternshipSearch";
import JobApplicationForm from "./Role/Physician/pages/JobApplicationForm";
import AdminDashboard from "./Role/Admin/pages/Dashboard";
import Login from"./LoginRegister/login/Login"
import Register from "./LoginRegister/register/Register";
import JobPost from "./Role/Recuiter/pages/JobPost";
import Home from "./LoginRegister/Home/Home";
import ForgotPassword from "./LoginRegister/login/ForgetPassword";


const App = () => {
  return (
    <div>
      
      <Routes>
        <Route path="/physician/job-internship" element={<JobInternshipSearch />} />
        <Route path="/physician/job-application" element={<JobApplicationForm />} />
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="register" element={<Register />} />
        <Route path="/recuiter/jobPost" element={<JobPost />} />


        {/*Admin routes*/}

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/inbox" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/reports" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/jobs" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/calendar" element={<AdminDashboard />} />


        <Route path="/admin/dashboard/users/doctors" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/users/students" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/users/institutes" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/users/recruiters" element={<AdminDashboard />} />

        <Route path="/admin/dashboard/settings/system" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/settings/profile" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/settings/admins" element={<AdminDashboard />} />
        



      </Routes>
    
    </div>
  );
};

export default App;
