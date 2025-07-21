import { Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar/Sidebar";
import JobInternshipSearch from "../pages/JobInternshipSearch";
import JobApplicationForm from "../pages/JobApplicationForm";
import JobInternshipDetails from "../pages/JobInternshipDetails";
import Footer from "../../../Components/FooterDiv/Footer";
import DoctorDashboard from "../pages/Doctordashboard";
import UserProfile from "../pages/YourProfile";
import UpdateCV from "../pages/UpdateCV03";
import HigherEducation from "../pages/HigherEducationSearch";
import Messages from "../pages/Messages";
import UpdateCV01 from "../pages/UpdateCV01";
import UpdateCV02 from "../pages/UpdateCV02";
import UpdateCV03 from "../pages/UpdateCV03";
import MedicalStudentDashboard from "../pages/MedicalStudentDashboard";
import CVComparison from "../pages/Cvcompare";
import DegreeDetails from "../pages/DegreeDetails";

// import { Cvcompare } from "../pages/Cvcompare";

const routes = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/Doctordashboard" element={<DoctorDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/update-cv01" element={<UpdateCV01 />} />
        <Route path="/update-cv02" element={<UpdateCV02 />} />
        <Route path="/update-cv03" element={<UpdateCV03 />} />
        <Route path="/cvComparison" element={<CVComparison />} />
        <Route path="/job-internship" element={<JobInternshipSearch />} />
        <Route path="/MedicalStudentDashboard" element={<MedicalStudentDashboard />} />
        <Route
          path="/job-internship/:jobId"
          element={<JobInternshipDetails />}
        />
        <Route
          path="/physician/job-application"
          element={<JobApplicationForm />}
        />
        <Route path="/higher-education" element={<HigherEducation />} />
        <Route path="/higher-education/degree-details/:id" element={<DegreeDetails />} />
        <Route path="/messages" element={<Messages />} />
        {/* <Route path="/cvCompare" element={<Cvcompare />} /> */}
      </Routes>
      <Footer />
    </div>
  );
};

export default routes;
