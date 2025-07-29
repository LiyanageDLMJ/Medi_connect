import { Route ,Outlet,Routes} from "react-router-dom";

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
import MedicalStudentDashboard from "./Role/MedicalStudent/pages/MedStudentDashboard";
import InstitutionDashboard from "./Role/higherEducation/pages/Dashboard";
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
import RecruiterDashboard from "./Role/Recuiter/pages/Dashboard";
import { FormProvider } from "./context/FormContext";
import CVComparison from "./Role/Recuiter/pages/CvComparison";
import { Toaster } from 'react-hot-toast';
import { MessageNotificationProvider } from './context/MessageNotificationContext';
import MedicalStudentMessages from "./Role/MedicalStudent/pages/Messages";
import PhysicianMessages from "./Role/Physician/pages/Messages";
import RecruiterMessages from "./Role/Recuiter/pages/Messages";
import HigherEducationMessages from "./Role/higherEducation/pages/Messages";
import MedStudentDashboard from "./Role/MedicalStudent/pages/MedStudentDashboard";
import MedicalCvStep1 from "./Role/MedicalStudent/pages/MedicalCvStep1";
import MedicalCvStep2 from "./Role/MedicalStudent/pages/MedicalCvStep2";
const App = () => {
  return (
    <MessageNotificationProvider>
      <FormProvider>
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
            <Route path="messages" element={<MedicalStudentMessages />} />
            <Route path="update-profile" element={<ProfilePage />} />
            <Route path="message-box" element={<MedicalStudentMessages />} />
            <Route path="update-cv01" element={<UpdateCV01 />} />
            <Route path="cv-step1" element={<MedicalCvStep1 />} />
            <Route path="cv-step2" element={<MedicalCvStep2 />} />
            <Route path="job-internship" element={<JobInternshipSearch />} />
            <Route path="job-application-tracker" element={<JobApplicationTracker />} />
            <Route path="higher-education" element={<HigherEducationSearch />} />
            <Route path="interview-invitations" element={<JobApplicationTracker />} />
          </Route>

        {/* Physician Routes */}
        <Route path="/physician">
          <Route path="Doctordashboard" element={<DoctorDashboard />} />
          <Route path="higher-education" element={<HigherEducationSearch />} />
          <Route path="job-internship" element={<JobInternshipSearch />} />
          <Route path="job-application/:jobId" element={<JobApplicationForm />} /> {/* Add :jobId parameter */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="job-application" element={<JobApplicationForm />} />
          <Route path="job-internship/:jobId" element={<JobInternshipDetails />} />
          <Route path="update-cv01" element={<UpdateCV01 />} />
          <Route path="update-cv02" element={<UpdateCV02 />} />
          <Route path="update-cv03" element={<UpdateCV03 />} />
          <Route path="job-details/:jobId" element={<JobInternshipDetails />} />
         
          <Route path="degreeapplication" element={<DegreeApplication />} />
          <Route path="job-application-tracker" element={<JobApplicationTracker />} />
          <Route path="medical-student-dashboard" element={<MedicalStudentDashboard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="update-profile" element={<ProfilePage />} />
          <Route path="message-box" element={<Messages />} />
          <Route path="med-student-dashboard" element={<MedStudentDashboard />} />
          
        </Route>
          {/* Physician Routes */}
          <Route path="/physician">
            <Route path="Doctordashboard" element={<DoctorDashboard />} />
            <Route path="higher-education" element={<HigherEducationSearch />} />
            <Route path="job-internship" element={<JobInternshipSearch />} />
            <Route path="job-application/:jobId" element={<JobApplicationForm />} /> {/* Add :jobId parameter */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="job-application" element={<JobApplicationForm />} />
            <Route path="job-internship/:jobId" element={<JobInternshipDetails />} />
            <Route path="update-cv01" element={<UpdateCV01 />} />
            <Route path="update-cv02" element={<UpdateCV02 />} />
            <Route path="update-cv03" element={<UpdateCV03 />} />
            <Route path="job-details/:jobId" element={<JobInternshipDetails />} />

            <Route path="degreeapplication" element={<DegreeApplication />} />
            <Route path="job-application-tracker" element={<JobApplicationTracker />} />
            <Route path="medical-student-dashboard" element={<MedicalStudentDashboard />} />
            <Route path="messages" element={<PhysicianMessages />} />
            <Route path="update-profile" element={<ProfilePage />} />
            <Route path="message-box" element={<PhysicianMessages />} />
          </Route>


          {/* Higher Education Routes */}
          <Route path="/higher-education">
            <Route path="dashboard" element={<InstitutionDashboard />} />
            <Route path="messages" element={<HigherEducationMessages />} />
            <Route path="view-applications" element={<ViewApplications />} />
            <Route path="degree-listing" element={<DegreeListing />} />
            <Route path="update-profile" element={<ProfilePage />} />
            <Route path="message-box" element={<HigherEducationMessages />} />
          </Route>

          {/* Recruiter Routes */}
          <Route path="/recruiter">
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="jobPost" element={<JobPost />} />
            <Route path="JobListing" element={<JobListing />} />
            <Route path="ViewCandidates" element={<ViewCandidates />} />
            <Route path="Messages" element={<RecruiterMessages />} />
            <Route path="Dashborad" element={<Dashborad />} />
            <Route path="jobListing" element={<JobListing />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="update-profile" element={<ProfilePage />} />
            <Route path="messages" element={<RecruiterMessages />} />
            <Route path="message-box" element={<RecruiterMessages />} />
             <Route path="cvCompare" element={<CVComparison />} />
          </Route>

        
          
          <Route path="/postdegree" element={<PostDegree />} />
 

        </Route>
      </Routes>
      </FormProvider>
    </MessageNotificationProvider>
  );
};

export default App;
