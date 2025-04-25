import { Routes, Route, Outlet } from "react-router-dom";
import JobInternshipSearch from "./Role/Physician/pages/JobInternshipSearch";
import HigherEducationSearch from "./Role/Physician/pages/HigherEducationSearch";
import JobApplicationForm from "./Role/Physician/pages/JobApplicationForm";
import Register from "./LoginRegister/register/Register";
import JobPost from "./Role/Recuiter/pages/JobPost";
import "react-datepicker/dist/react-datepicker.css";
import Home from "./LoginRegister/Home/Home";
import ForgotPassword from "./LoginRegister/login/ForgetPassword";
import Login from "./LoginRegister/login/Login";
import Footer from "./Components/FooterDiv/Footer"; // Adjust the path as needed
import WithFooter from "./Layout/WithFooter"; // Adjust the path as needed

const App = () => {
  return (
    <>
      <Routes>

        {/* With Footer Routes */}
        <Route element={<WithFooter><Outlet /></WithFooter>}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
    
          <Route path="/recuiter/jobPost" element={<JobPost />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
