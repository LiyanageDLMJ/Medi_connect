import { Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import DegreeListing from "../pages/DegreeListing";
import Footer from "../../../Components/FooterDiv/Footer";
import Dashboard from "../pages/dashborad";
import UserProfile from "../pages/YourProfile";
import ViewApplications from "../pages/ViewApplications";
import PerformanceInsights from "../pages/PerformanceInsights";
import Messages from "../pages/Messages";
const routes = () => {
  return (
    <div>
      <NavBar />
      <Routes>
       <Route path="/" element={<Dashboard />} />
       <Route path="/profile" element={<UserProfile />} />
       <Route path="/degree-listing" element={<DegreeListing />} />
       <Route path="/view-applications" element={<ViewApplications />} />
       <Route path="/performance-insights" element={<PerformanceInsights />} />
       <Route path="/messages" element={<Messages />} />
       

      </Routes>
      <Footer />
    </div>
  );
};

export default routes;
