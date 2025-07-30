import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DegreeListing from "../pages/DegreeListing";
import Footer from "../../../Components/FooterDiv/Footer";
import InstitutionDashboard from "../pages/Dashboard";
import UserProfile from "../pages/YourProfile";
import ViewApplications from "../pages/ViewApplications";
import PerformanceInsights from "../pages/PerformanceInsights";
import Messages from "../pages/Messages";
import SeeApplication from "../pages/SeeApplication";
import InstituteDegreeDetails from "../pages/InstituteDegreeDetails";
import Feedbacks from "../pages/Feedbackslist";
const routes = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto md:ml-64">
        <Routes>
         <Route path="/" element={<InstitutionDashboard />} />
         <Route path="/update-profile" element={<UserProfile />} />
         <Route path="/degree-listing" element={<DegreeListing />} />
         <Route path="/view-applications" element={<ViewApplications />} />
         <Route path="/view-applications/:id" element={<SeeApplication />} />
         <Route path="/performance-insights" element={<PerformanceInsights />} />
         <Route path="/messages" element={<Messages />} />
         <Route path="/degree-listing/institute-degree-details/:id" element={<InstituteDegreeDetails />} />
         <Route path="/degree-listing/feedbackslist" element={<Feedbacks />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default routes;
