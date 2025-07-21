import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DegreeListing from "../pages/DegreeListing";
import Footer from "../../../Components/FooterDiv/Footer";
import Dashboard from "../pages/Dashboard";
import UserProfile from "../pages/YourProfile";
import ViewApplications from "../pages/ViewApplications";
import PerformanceInsights from "../pages/PerformanceInsights";
import Messages from "../pages/Messages";
const routes = () => {
  return (
    <div>
      <Sidebar />
      <Routes>
       <Route path="/" element={<Dashboard />} />
       <Route path="/higher-education/degree-listing/profile" element={<UserProfile />} />
       <Route path="/higher-education/degree-listing/degree-listing" element={<DegreeListing />} />
       <Route path="/higher-education/degree-listing/view-applications" element={<ViewApplications />} />
       <Route path="/higher-education/degree-listing/performance-insights" element={<PerformanceInsights />} />
       <Route path="/higher-education/degree-listing/messages" element={<Messages />} />
       

      </Routes>
      <Footer />
    </div>
  );
};

export default routes;
