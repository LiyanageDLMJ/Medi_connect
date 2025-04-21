import { Routes, Route, Outlet } from "react-router-dom";
import JobInternshipSearch from "./Role/Physician/pages/JobInternshipSearch";
import HigherEducationSearch from "./Role/Physician/pages/HigherEducationSearch";
import JobApplicationForm from "./Role/Physician/pages/JobApplicationForm";
import Register from "./LoginRegister/register/Register";
import JobPost from "./Role/Recuiter/pages/JobPost";
import "react-datepicker/dist/react-datepicker.css";
import Home from "./LoginRegister/Home/Home";
import ForgotPassword from "./LoginRegister/login/ForgetPassword";

const App = () => {
  return (
    <Routes>

      {/* With Footer Routes */}
      <Route element={<WithFooter><Outlet /></WithFooter>}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="register" element={<Register />} />
        <Route path="/recuiter/jobPost" element={<JobPost />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
