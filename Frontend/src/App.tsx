import { Routes, Route, Outlet } from "react-router-dom";
import Login from "./LoginRegister/login/Login";
import JobInternshipSearch from "./Role/Physician/pages/JobInternshipSearch";
import HigherEducationSearch from "./Role/Physician/pages/HigherEducationSearch";
import JobApplicationForm from "./Role/Physician/pages/JobApplicationForm";
import JobInternshipDetails from "./Role/Physician/pages/JobInternshipDetails";
import ViewApplications from "./Role/higherEducation/pages/ViewApplications";
import Register from "./LoginRegister/register/Register";
import JobPost from "./Role/Recuiter/pages/JobPost";
import JobListing from "./Role/Recuiter/pages/JobListing";
import UpdateCV01 from "./Role/Physician/pages/UpdateCV01";
import UpdateCV02 from "./Role/Physician/pages/UpdateCV02";
import UpdateCV03 from "./Role/Physician/pages/UpdateCV03";
import Messages from "./Role/higherEducation/pages/Messages";
import "react-datepicker/dist/react-datepicker.css";
import Home from "./LoginRegister/Home/Home";
import ForgotPassword from "./LoginRegister/login/ForgetPassword";
import DegreeListing from "./Role/higherEducation/pages/DegreeListing";

import Dashboard from "./Role/Physician/pages/dashboard";


import PostDegree from "./Role/higherEducation/pages/PostDegree";
// import PostDegrees from "./Role/higherEducation/pages/examble";
import WithFooter from "./Layout/WithFooter";
import WithoutFooter from "./Layout/WithoutFooter";  
import Dashborad from "./Role/higherEducation/pages/dashborad";
const App = () => {
  return (
    <>
      <Routes>

      {/* With Footer Routes */}
      <Route element={<WithFooter><Outlet /></WithFooter>}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Without Footer Routes */}
      <Route element={<><Outlet /></>}>

        {/* Physician Routes */}
        <Route path="/physician">
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="higher-education" element={<HigherEducationSearch />} />
          <Route path="job-internship" element={<JobInternshipSearch />} />
          <Route path="job-application" element={<JobApplicationForm />} />
          <Route path="job-internship/:jobId" element={<JobInternshipDetails />} />
          <Route path="update-cv01" element={<UpdateCV01 />} />
          <Route path="update-cv02" element={<UpdateCV02 />} />
          <Route path="update-cv03" element={<UpdateCV03 />} />
          <Route path="job-details/:jobId" element={<JobInternshipDetails />} />
      
      
        </Route>

        {/* Higher Education Routes */}
        <Route path="/higher-education">
          <Route path="messages" element={<Messages />} />
          <Route path="view-applications" element={<ViewApplications />} />
          <Route path="degree-listing" element={<DegreeListing />} />
          <Route path="deshboard" element={<Dashborad />} />
        </Route>

        {/* Recruiter Routes */}
        <Route path="/recruiter">
          <Route path="jobPost" element={<JobPost />} />
          <Route path="JobListing" element={<JobListing />} />
        </Route>

      
        
        <Route path="/postdegree" element={<PostDegree />} />
 

      </Route>
    </Routes>
    </>
  );
};

export default App;
