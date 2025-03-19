import { Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import JobInternshipSearch from "../pages/JobInternshipSearch";
import JobApplicationForm from "../pages/JobApplicationForm";
import Footer from "../../../Components/FooterDiv/Footer";
import Dashboard from "../pages/dashborad";
import UserProfile from "../pages/YourProfile";
import UpdateCV from "../pages/UpdateCV";
import HigherEducationSearch from "../pages/HigherEducationSearch";
import Messages from "../pages/Messages";
const routes = () => {
  return (
    <div>
      <NavBar />
      <Routes>
       <Route path="/" element={<Dashboard />} />
       <Route path="/profile" element={<UserProfile />} />
       <Route path="/update-cv" element={<UpdateCV />} />
       <Route path="/job-internship" element={<JobInternshipSearch />} />
       <Route path="/physician/job-application" element={<JobApplicationForm />} />
       <Route path="/higher-education" element={<HigherEducationSearch />} />
       <Route path="/messages" element={<Messages />} />
       

      </Routes>
      <Footer />
    </div>
  );
};

export default routes;
