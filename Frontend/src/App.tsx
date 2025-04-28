import { Routes, Route, Outlet } from "react-router-dom";
import JobInternshipSearch from "./Role/Physician/pages/JobInternshipSearch";
import HigherEducationSearch from "./Role/Physician/pages/HigherEducationSearch";
import JobApplicationForm from "./Role/Physician/pages/JobApplicationForm";
import Register from "./LoginRegister/register/Register";
import JobPost from "./Role/Recuiter/pages/JobPost";
import "react-datepicker/dist/react-datepicker.css";
import Home from "./LoginRegister/Home/Home";
import ForgotPassword from "./LoginRegister/login/ForgetPassword";
import DegreeListing from "./Role/higherEducation/pages/DegreeListing";
import ViewApplications from "./Role/higherEducation/pages/ViewApplications";
import Messages from "./Role/higherEducation/pages/Messages";
import Login from "./LoginRegister/login/Login";
import Dashboard from "./Role/Physician/pages/dashboard";
 import JobListing from"./Role/Recuiter/pages/JobListing";

import PostDegree from "./Role/higherEducation/pages/PostDegree";
// import PostDegrees from "./Role/higherEducation/pages/examble";
import WithFooter from "./Layout/WithFooter";
import WithoutFooter from "./Layout/WithoutFooter";  
import Dashborad from "./Role/higherEducation/pages/dashborad";
const App = () => {
  return (
    <Routes>

      {/* With Footer Routes */}
      <Route element={<WithFooter><Outlet /></WithFooter>}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Without Footer Routes */}
      <Route element={<WithoutFooter><Outlet /></WithoutFooter>}>

        {/* Physician Routes */}
        <Route path="/physician">
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="higher-education" element={<HigherEducationSearch />} />
          <Route path="job-internship" element={<JobInternshipSearch />} />
          <Route path="job-application" element={<JobApplicationForm />} />
      
        </Route>

        {/* Higher Education Routes */}
        <Route path="/higher-education">
          <Route path="messages" element={<Messages />} />
          <Route path="view-applications" element={<ViewApplications />} />
          <Route path="degree-listing" element={<DegreeListing />} />
          <Route path="deshboard" element={<Dashborad />} />
        </Route>

        {/* Recruiter Routes */}
        <Route path="/recuiter">
          <Route path="jobPost" element={<JobPost />} />
          <Route path="JobListing" element={<JobListing />} />
        </Route>

      
        
        <Route path="/postdegree" element={<PostDegree />} />
        {/* <Route path="/postdegrees" element={<PostDegrees />} /> */}

      </Route>
    </Routes>
  );
};

export default App;
