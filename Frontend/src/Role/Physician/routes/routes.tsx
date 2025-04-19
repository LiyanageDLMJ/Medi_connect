import { Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import JobInternshipSearch from "../pages/JobInternshipSearch";
import JobApplicationForm from "../pages/JobApplicationForm";
import Footer from "../../../Components/FooterDiv/Footer";
import Dashboard from "../pages/dashboard";
import UserProfile from "../pages/YourProfile";
import UpdateCV from "../pages/UpdateCV03";
import HigherEducation from "../pages/HigherEducationSearch";
import Messages from "../pages/Messages";
import UpdateCV01 from "../pages/UpdateCV01";
import UpdateCV02 from "../pages/UpdateCV02";
import UpdateCV03 from "../pages/UpdateCV03";

const routes = () => {
  return (
    <div>
      <NavBar />
      <Routes>
       <Route path="/physician/dashboard" element={<Dashboard />} />
       <Route path="/profile" element={<UserProfile />} />
       <Route path="/update-cv01" element={<UpdateCV01 />} />
        <Route path="/update-cv02" element={<UpdateCV02 />} />
        <Route path="/update-cv03" element={<UpdateCV03 />} />
       <Route path="/job-internship" element={<JobInternshipSearch />} />
       <Route path="/physician/job-application" element={<JobApplicationForm />} />
       <Route path="/higher-education" element={<HigherEducation />} />
       <Route path="/messages" element={<Messages />} />
       

      </Routes>
      <Footer />
    </div>
  );
};

export default routes;
