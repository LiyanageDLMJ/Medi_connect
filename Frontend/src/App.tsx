import { Routes, Route } from "react-router-dom";
import JobInternshipSearch from "./Role/Physician/pages/JobInternshipSearch";
import JobApplicationForm from "./Role/Physician/pages/JobApplicationForm";
import Login from"./LoginRegister/login/Login"
import Register from "./LoginRegister/register/Register";
import Footer from "./Components/FooterDiv/Footer"
import JobPost from "./Role/Recuiter/pages/JobPost";
import Home from "./LoginRegister/Home/Home";
import ForgotPassword from "./LoginRegister/login/ForgetPassword";
import MessageBox from "./Components/MessageBox/MessageBox";

const App = () => {
  return (
    <div>
      
      <Routes>
        <Route path="/physician/job-internship" element={<JobInternshipSearch />} />
        <Route path="/physician/job-application" element={<JobApplicationForm />} />
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="register" element={<Register />} />
        <Route path="/recuiter/jobPost" element={<JobPost />} />
      </Routes>
      <Footer />
      {/* MessageBox for demo/testing; you can later route or conditionally render it */}
      <MessageBox />
    </div>
  );
};

export default App;
