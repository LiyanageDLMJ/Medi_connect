import { Route,Outlet,Routes } from "react-router-dom";

import { Routes, Route } from "react-router-dom";
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
import MedicalStudentDashboard from "./Role/MedicalStudent/pages/Dashboard";
import InstitutionDashboard from "./Role/higherEducation/pages/Dashboard";
import "react-datepicker/dist/react-datepicker.css";
import Home from "./LoginRegister/Home/Home";
import ForgotPassword from "./LoginRegister/login/ForgetPassword";
import AdminSignIn from "./Role/Admin/pages/AdminSignIn";
import MonitoringDashboard from "./Role/Admin/components/MonitoringDashboard";
import JobApplicationTable from './Role/Admin/components/JobListing/JobApplicationTable';


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
              <AdminDashboard />
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
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/jobs"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/job-listing"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/job-applications"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/admin/dashboard/calendar"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/admin/dashboard/users/doctors"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/users/students"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/users/institutes"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/users/recruiters"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/settings/adminRegister"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/cv-data"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/settings/profile"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/settings/admins"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/admin-login" element={<AdminSignIn />} />
      

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
