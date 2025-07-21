import { Routes, Route } from "react-router-dom";
import NavBar from "../components/Sidebar";
import DegreeListing from "../pages/DegreeListing";
import Footer from "../../../Components/FooterDiv/Footer";
import Dashboard from "../pages/dashborad";
import UserProfile from "../pages/YourProfile";
import ViewApplications from "../pages/ViewApplications";
import PerformanceInsights from "../pages/PerformanceInsights";
import Messages from "../pages/Messages";
import SeeApplication from "../pages/SeeApplication";
import InstituteDegreeDetails from "../pages/InstituteDegreeDetails";
import Feedbacks from "../pages/Feedbackslist";
const routes = () => {
  return (
    <div>
      <NavBar />
      <Routes>
       <Route path="/" element={<Dashboard />} />
       <Route path="/higher-education/degree-listing/profile" element={<UserProfile />} />
       <Route path="/higher-education/degree-listing/degree-listing" element={<DegreeListing />} />
       <Route path="/higher-education/degree-listing/view-applications" element={<ViewApplications />} />
       <Route path="/higher-education/degree-listing/view-applications/:id" element={<SeeApplication />} />
       <Route path="/higher-education/degree-listing/performance-insights" element={<PerformanceInsights />} />
       <Route path="/higher-education/degree-listing/messages" element={<Messages />} />
       <Route path="/higher-education/degree-listing/institute-degree-details/:id" element={<InstituteDegreeDetails />} />
       <Route path="/higher-education/degree-listing/feedbackslist" element={<Feedbacks />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default routes;
