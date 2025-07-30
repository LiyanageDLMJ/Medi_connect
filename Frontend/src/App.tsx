import { Route,Outlet,Routes } from "react-router-dom";

import JobInternshipSearch from "./Role/Physician/pages/JobInternshipSearch";
import JobApplicationForm from "./Role/Physician/pages/JobApplicationForm";
import AdminDashboard from "./Role/Admin/pages/Dashboard";
import Login from "./LoginRegister/login/Login";
import Register from "./LoginRegister/register/Register";
import JobPost from "./Role/Recuiter/pages/JobPost";
import JobListing from "./Role/Recuiter/pages/JobListing";
import UpdateCV01 from "./Role/Physician/pages/UpdateCV01";
import UpdateCV02 from "./Role/Physician/pages/UpdateCV02";
import UpdateCV03 from "./Role/Physician/pages/UpdateCV03";
import Messages from "./Role/Physician/pages/Messages";
import ProfilePage from "./Components/Profile/ProfilePage";
import InstitutionDashboard from "./Role/higherEducation/pages/Dashboard";
import "react-datepicker/dist/react-datepicker.css";
import Home from "./LoginRegister/Home/Home";
import ForgotPassword from "./LoginRegister/login/ForgetPassword";
import AdminSignIn from "./Role/Admin/pages/AdminSignIn";
import MonitoringDashboard from "./Role/Admin/components/MonitoringDashboard";
import JobApplicationTable from './Role/Admin/components/JobListing/JobApplicationTable';

// Missing imports
import WithFooter from "./Layout/WithFooter";
import { FormProvider } from "./context/FormContext";
import { MessageNotificationProvider } from "./context/MessageNotificationContext";
import { Toaster } from "react-hot-toast";
import FloatingFeedbackButton from "./Components/Feedback/FloatingFeedbackButton";

// Physician components
import DoctorDashboard from "./Role/Physician/pages/Doctordashboard";
import HigherEducationSearch from "./Role/Physician/pages/HigherEducationSearch";
import JobInternshipDetails from "./Role/Physician/pages/JobInternshipDetails";
// import Cvcompare from "./Role/Physician/pages/";
import DegreeApplication from "./Role/Physician/pages/DegreeApplicationForm";
import DegreeDetails from "./Role/Physician/pages/DegreeDetails";

// Medical Student components
import MedicalStudentHigherEducationSearch from "./Role/MedicalStudent/pages/HigherEducationSearch";
import MedicalStudentDegreeApplication from "./Role/MedicalStudent/pages/DegreeApplicationForm";
import MedicalStudentDegreeDetails from "./Role/MedicalStudent/pages/DegreeDetails";

// Higher Education components
import DegreeListing from "./Role/higherEducation/pages/DegreeListing";
import PostDegree from "./Role/higherEducation/pages/PostDegree";
import ViewApplications from "./Role/higherEducation/pages/ViewApplications";
import SeeApplication from "./Role/higherEducation/pages/SeeApplication";
import InstituteDegreeDetails from "./Role/higherEducation/pages/InstituteDegreeDetails";
import Feedbacks from "./Role/higherEducation/pages/Feedbackslist";
import PerformanceInsights from "./Role/higherEducation/pages/PerformanceInsights";
import Dashboard from "./Role/higherEducation/pages/Dashboard";

// Recruiter components
import ViewCandidates from "./Role/Recuiter/pages/VeiwCandidates";
import RecruiterDashboard from "./Role/Recuiter/pages/Dashboard";
import MedicalStudentMessages from "./Role/MedicalStudent/pages/Messages";
import PhysicianMessages from "./Role/Physician/pages/Messages";
import RecruiterMessages from "./Role/Recuiter/pages/Messages";
import HigherEducationMessages from "./Role/higherEducation/pages/Messages";
import MedicalStudentDashboard from "./Role/MedicalStudent/pages/MedStudentDashboard";
import MedicalCvStep1 from "./Role/MedicalStudent/pages/MedicalCvStep01";
import MedicalCvStep2 from "./Role/MedicalStudent/pages/MedicalCvStep02";
import CvComparison from "./Role/Recuiter/pages/campairCV";

// Admin components
import DashboradAdmin from "./Role/Admin/pages/Dashboard";
import FAQAdd from "./Role/Admin/pages/FAQAdd";
import AdminFeedbacks from "./Role/Admin/pages/AdminFeedbacks";
import ManageDoctors from "./Role/Admin/pages/ManageUsers/ManageDoctors";
import ManageStudents from "./Role/Admin/pages/ManageUsers/ManageStudents";
import ManageInstitute from "./Role/Admin/pages/ManageUsers/ManageInstitute";
import ManageRecruiters from "./Role/Admin/pages/ManageUsers/ManageRecruiters";
import AdminRegister from "./Role/Admin/pages/Settings/AdminRegister";
import Admins from "./Role/Admin/pages/Settings/Admins";
import Inbox from "./Role/Admin/pages/Inbox";
import JobListingAdmin from "./Role/Admin/pages/JobListing";
import Reports from "./Role/Admin/pages/Reports";
import Calendar from "./Role/Admin/pages/Calendar";

// Other components
import FAQ from "./Components/FAQ/FAQ";

import ProtectedRoute from "./Role/Admin/ProtectedRoute";
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
            <Route path="messages" element={<MedicalStudentMessages />} />
            <Route path="update-profile" element={<ProfilePage />} />
            <Route path="message-box" element={<MedicalStudentMessages />} />
            <Route path="update-cv01" element={<UpdateCV01 />} />
            <Route path="cv-step01" element={<MedicalCvStep1 />} />
            <Route path="cv-step02" element={<MedicalCvStep2 />} />
            <Route path="job-internship" element={<JobInternshipSearch />} />
            <Route path="job-application-tracker" element={<JobApplicationTable />} />
            <Route path="higher-education" element={<HigherEducationSearch />} />
            <Route path="degree-details/:id" element={<MedicalStudentDegreeDetails />} />
            <Route path="degreeapplication" element={<MedicalStudentDegreeApplication />} />
            {/* <Route path="interview-invitations" element={<JobApplicationTracker />} /> */}
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
          <Route path="degree-details/:id" element={<DegreeDetails />} />
          <Route path="job-application-tracker" element={<JobApplicationTable />} />
          {/* <Route path="medical-student-dashboard" element={<MedicalStudentDashboard />} /> */}
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
              <Route path="Dashboard" element={<Dashboard />} />
              <Route path="performance-insights" element={<PerformanceInsights />} />
              <Route path="degree-listing/view-applications/:id" element={<SeeApplication />} />
              <Route path="postdegree" element={<PostDegree />} />
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
            <Route path="Messages" element={<RecruiterMessages />} />
            <Route path="Dashborad" element={<RecruiterDashboard />} />
            <Route path="jobListing" element={<JobListing />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="update-profile" element={<ProfilePage />} />
            <Route path="messages" element={<RecruiterMessages />} />
            <Route path="message-box" element={<RecruiterMessages />} />
             <Route path="cvCompare" element={<CvComparison />} />
          </Route>


<Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/job-applicants/:jobId"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard/system-health"
          element={
            <ProtectedRoute>
              <MonitoringDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/jobs"
          element={
            <ProtectedRoute>
              <JobListingAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/job-listing"
          element={
            <ProtectedRoute>
              <JobListingAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/job-applications"
          element={
            <ProtectedRoute>
              <JobApplicationTable />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/admin/dashboard/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/admin/dashboard/users/doctors"
          element={
            <ProtectedRoute>
              <ManageDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/users/students"
          element={
            <ProtectedRoute>
              <ManageStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/users/institutes"
          element={
            <ProtectedRoute>
              <ManageInstitute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/users/recruiters"
          element={
            <ProtectedRoute>
              <ManageRecruiters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/settings/adminRegister"
          element={
            <ProtectedRoute>
              <AdminRegister />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/cv-data"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/settings/profile"
          element={
            <ProtectedRoute>
              <DashboradAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/settings/admins"
          element={
            <ProtectedRoute>
              <Admins />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/jobs"
          element={
            <ProtectedRoute>
              <JobListingAdmin />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/admin-login" element={<AdminSignIn />} />
        
        {/* Main Admin Dashboard Route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboradAdmin />
            </ProtectedRoute>
          }
        />
      
        {/* Admin FAQ and Feedbacks Routes */}
        <Route
          path="/admin/faq-add"
          element={
            <ProtectedRoute>
              <FAQAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feedbacks"
          element={
            <ProtectedRoute>
              <AdminFeedbacks />
            </ProtectedRoute>
          }
        />

            

            {/* Standalone Routes */}
            <Route path="/faq" element={<FAQ />} />
          </Route>
        </Routes>
        <FloatingFeedbackButton />
      </MessageNotificationProvider>
    </FormProvider>
  );
};

export default App;
