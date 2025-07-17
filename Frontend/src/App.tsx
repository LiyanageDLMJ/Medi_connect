import { Routes, Route, Outlet } from "react-router-dom";

import JobInternshipSearch from "./Role/Physician/pages/JobInternshipSearch";
import HigherEducationSearch from "./Role/Physician/pages/HigherEducationSearch";
import JobApplicationForm from "./Role/Physician/pages/JobApplicationForm";
import JobInternshipDetails from "./Role/Physician/pages/JobInternshipDetails";
import JobApplicationTracker from "./Role/Physician/pages/TrackJobApplication";


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
import Login from "./LoginRegister/login/Login";
import Footer from "./Components/FooterDiv/Footer"; // Adjust the path as needed
import WithFooter from "./Layout/WithFooter"; // Adjust the path as needed
import DegreeListing from "./Role/higherEducation/pages/DegreeListing";
import Dashborad from "./Role/higherEducation/pages/dashborad";
import DoctorDashboard from "./Role/Physician/pages/Doctordashboard";
import  DegreeApplication from "./Role/Physician/pages/DegreeApplicationForm"

import  ViewApplications from "./Role/higherEducation/pages/ViewApplications"
import ViewCandidates from "./Role/Recuiter/pages/VeiwCandidates";


import { FormProvider } from "./context/FormContext";
import MedicalStudentDashboard from "./Role/Physician/pages/MedicalStudentDashboard";
import Cvcompare from "./Role/Physician/pages/Cvcompare";
import PostDegree from "./Role/higherEducation/pages/PostDegree";
const App = () => {
  return (
    <FormProvider>
      <Routes>
        {/* With Footer Routes */}
        <Route
          element={
            <WithFooter>
              <Outlet />
            </WithFooter>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

      {/* Without Footer Routes */}
      <Route element={<><Outlet /></>}>

        {/* Physician Routes */}
        <Route path="/physician">
          <Route path="Doctordashboard" element={<DoctorDashboard />} />
          <Route path="higher-education" element={<HigherEducationSearch />} />
          <Route path="job-internship" element={<JobInternshipSearch />} />
          <Route path="job-application/:jobId" element={<JobApplicationForm />} /> {/* Add :jobId parameter */}
          <Route path="job-internship/:jobId" element={<JobInternshipDetails />} />
          <Route path="update-cv01" element={<UpdateCV01 />} />
          <Route path="update-cv02" element={<UpdateCV02 />} />
          <Route path="update-cv03" element={<UpdateCV03 />} />
          <Route path="job-details/:jobId" element={<JobInternshipDetails />} />
          <Route path="Cvcompare" element={<Cvcompare />} />
          <Route path="degreeapplication" element={<DegreeApplication />} />
          <Route path="job-application-tracker" element={<JobApplicationTracker />} />
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
          <Route path="ViewCandidates" element={<ViewCandidates />} />
          <Route path="Messages" element={<Messages />} />
          <Route path="Dashborad" element={<Dashborad />} />
        </Route>

      
        
        <Route path="/postdegree" element={<PostDegree />} />
 

      </Route>
    </Routes>
    </FormProvider>
  );
};

export default App;
