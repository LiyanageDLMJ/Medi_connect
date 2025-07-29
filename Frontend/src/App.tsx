import { Route,Outlet,Routes } from "react-router-dom";

import JobInternshipSearch from "./Role/Physician/pages/JobInternshipSearch";
import HigherEducationSearch from "./Role/Physician/pages/HigherEducationSearch";
import JobApplicationForm from "./Role/Physician/pages/JobApplicationForm";
import JobInternshipDetails from "./Role/Physician/pages/JobInternshipDetails";
import JobApplicationTracker from "./Role/Physician/pages/TrackJobApplication";
import PostDegree from "./Role/higherEducation/pages/PostDegree";

import Register from "./LoginRegister/register/Register";
import JobPost from "./Role/Recuiter/pages/JobPost";
import JobListing from "./Role/Recuiter/pages/JobListing";
import UpdateCV01 from "./Role/Physician/pages/UpdateCV01";
import UpdateCV02 from "./Role/Physician/pages/UpdateCV02";
import UpdateCV03 from "./Role/Physician/pages/UpdateCV03";
import Messages from "./Role/Physician/pages/Messages";
import ProfilePage from "./Components/Profile/ProfilePage";
import MedicalStudentDashboard from "./Role/MedicalStudent/pages/Dashboard";
import InstitutionDashboard from "./Role/higherEducation/pages/Dashboard";
import "react-datepicker/dist/react-datepicker.css";
import Home from "./LoginRegister/Home/Home";
import ForgotPassword from "./LoginRegister/login/ForgetPassword";
import Login from "./LoginRegister/login/Login";
import Footer from "./Components/FooterDiv/Footer"; // Adjust the path as needed
import WithFooter from "./Layout/WithFooter"; // Adjust the path as needed
import DegreeListing from "./Role/higherEducation/pages/DegreeListing";
import DashboradAdmin from "./Role/Admin/pages/Dashboard";
import DoctorDashboard from "./Role/Physician/pages/Doctordashboard";

import  DegreeApplication from "./Role/Physician/pages/DegreeApplicationForm"

import  ViewApplications from "./Role/higherEducation/pages/ViewApplications"
import ViewCandidates from "./Role/Recuiter/pages/VeiwCandidates";
import SeeApplication from "./Role/higherEducation/pages/SeeApplication";
import DegreeDetails from "./Role/Physician/pages/DegreeDetails";
import InstituteDegreeDetails from "./Role/higherEducation/pages/InstituteDegreeDetails";
import Feedbacks from "./Role/higherEducation/pages/Feedbackslist";

import Dashborad from "./Role/higherEducation/pages/Dashboard";
import './App.css'; // ✅ if App.css is in the same folder as App.tsx

import Dashboard from "./Role/Physician/pages/Doctordashboard";
import RecruiterDashboard from "./Role/Recuiter/pages/Dashboard";
import { FormProvider } from "./context/FormContext";
import Cvcompare from "./Role/Physician/pages/Cvcompare";
import FAQ from "./Components/FAQ/FAQ";
import PerformanceInsights from "./Role/higherEducation/pages/PerformanceInsights";
import FloatingFeedbackButton from "./Components/Feedback/FloatingFeedbackButton";
import FAQAdd from "./Role/Admin/pages/FAQAdd";
import AdminFeedbacks from "./Role/Admin/pages/AdminFeedbacks";

// Medical Student Higher Education Components
import MedicalStudentHigherEducationSearch from "./Role/MedicalStudent/pages/HigherEducationSearch";
import MedicalStudentDegreeApplication from "./Role/MedicalStudent/pages/DegreeApplicationForm";
import MedicalStudentDegreeDetails from "./Role/MedicalStudent/pages/DegreeDetails";

import { Toaster } from 'react-hot-toast';
import { MessageNotificationProvider } from "./context/MessageNotificationContext";
const App = () => {
  return (
    <FormProvider>
      <MessageNotificationProvider>
        <Toaster position="top-center" toastOptions={{ style: { fontSize: '1rem', borderRadius: 8 } }} />
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
            {/* Medical Student Routes */}
            <Route path="/medical_student">
              <Route path="dashboard" element={<MedicalStudentDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="messages" element={<Messages />} />
              <Route path="update-profile" element={<ProfilePage />} />
              <Route path="message-box" element={<Messages />} />
             
              <Route path="higher-education" element={<MedicalStudentHigherEducationSearch />} />
              <Route path="degreeapplication" element={<MedicalStudentDegreeApplication />} />
              <Route path="degree-details/:id" element={<MedicalStudentDegreeDetails />} />
            </Route>

            {/* Physician Routes */}
            <Route path="/physician">
              <Route path="Doctordashboard" element={<DoctorDashboard />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="higher-education" element={<HigherEducationSearch />} />
              <Route path="job-internship" element={<JobInternshipSearch />} />
              <Route path="job-application/:jobId" element={<JobApplicationForm />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="job-application" element={<JobApplicationForm />} />
              <Route path="job-internship/:jobId" element={<JobInternshipDetails />} />
              <Route path="update-cv01" element={<UpdateCV01 />} />
              <Route path="update-cv02" element={<UpdateCV02 />} />
              <Route path="update-cv03" element={<UpdateCV03 />} />
              <Route path="job-details/:jobId" element={<JobInternshipDetails />} />
              <Route path="Cvcompare" element={<Cvcompare />} />
              <Route path="degreeapplication" element={<DegreeApplication />} />
              <Route path="degree-details/:id" element={<DegreeDetails />} />
              <Route path="job-application-tracker" element={<JobApplicationTracker />} />
              <Route path="medical-student-dashboard" element={<MedicalStudentDashboard />} />
              <Route path="messages" element={<Messages />} />
              <Route path="update-profile" element={<ProfilePage />} />
              <Route path="message-box" element={<Messages />} />
            </Route>

            {/* Higher Education Routes */}
            <Route path="/higher-education">
              <Route path="messages" element={<Messages />} />
              <Route path="view-applications" element={<ViewApplications />} />
              <Route path="view-applications/:id" element={<SeeApplication />} />
              <Route path="degree-listing" element={<DegreeListing />} />
              <Route path="degree-listing/institute-degree-details/:id" element={<InstituteDegreeDetails />} />
              <Route path="degree-listing/feedbackslist" element={<Feedbacks />} />
              <Route path="Dashboard" element={<Dashborad />} />
              <Route path="performance-insights" element={<PerformanceInsights />} />
              <Route path="degree-listing/view-applications/:id" element={<SeeApplication />} />
              {/* <Route path="deshboard" element={<Dashborad />} /> */}
              <Route path="update-profile" element={<ProfilePage />} />
              <Route path="message-box" element={<Messages />} />
            </Route>

            {/* Recruiter Routes */}
            <Route path="/recruiter">
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="jobPost" element={<JobPost />} />
              <Route path="JobListing" element={<JobListing />} />
              <Route path="ViewCandidates" element={<ViewCandidates />} />
              <Route path="Messages" element={<Messages />} />
              <Route path="Dashborad" element={<Dashborad />} />
              <Route path="jobListing" element={<JobListing />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="update-profile" element={<ProfilePage />} />
              <Route path="messages" element={<Messages />} />
              <Route path="message-box" element={<Messages />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="messages" element={<Messages />} />
              <Route path="dashboard" element={<DashboradAdmin />} />
              <Route path="performance-insights" element={<PerformanceInsights />} />
              <Route path="faq-add" element={<FAQAdd />} />
              <Route path="feedbacks" element={<AdminFeedbacks />} />
            </Route>

            {/* Standalone Routes */}
            <Route path="/postdegree" element={<PostDegree />} />
            <Route path="/faq" element={<FAQ />} />
          </Route>
        </Routes>
        <FloatingFeedbackButton />
      </MessageNotificationProvider>
    </FormProvider>
  );
};

export default App;
