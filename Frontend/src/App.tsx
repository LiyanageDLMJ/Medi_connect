



import { Routes, Route, Outlet  } from "react-router-dom";
import JobInternshipSearch from "./Role/Physician/pages/JobInternshipSearch";
import DegreeList from "./Role/higherEducation/pages/example";
import HigherEducationSearch from "./Role/Physician/pages/HigherEducationSearch";
import JobApplicationForm from "./Role/Physician/pages/JobApplicationForm";
import DegreeListing from "./Role/higherEducation/pages/DegreeListing";
import ViewApplications from "./Role/higherEducation/pages/ViewApplications";
import Messages from "./Role/higherEducation/pages/Messages";
import Login from "./LoginRegister/login/Login";
import Register from "./LoginRegister/register/Register";
import JobPost from "./Role/Recuiter/pages/JobPost";
import "react-datepicker/dist/react-datepicker.css";
import Home from "./LoginRegister/Home/Home";
import ForgotPassword from "./LoginRegister/login/ForgetPassword";
import WithFooter from "./Layout/WithFooter";
import WithoutFooter from "./Layout/WithoutFooter";

const App = () => {
  return (
    <Routes>
      <Route element={<WithFooter><Outlet /></WithFooter>}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<WithoutFooter><Outlet /></WithoutFooter>}>

        <Route path="/physician">
          <Route path="higher-education" element={<HigherEducationSearch />} />
          <Route path="job-internship" element={<JobInternshipSearch />} />
          <Route path="job-application" element={<JobApplicationForm />} />
        </Route>

        <Route path="/higher-education">
          <Route path="messages" element={<Messages />} />
          <Route path="view-applications" element={<ViewApplications />} />
          <Route path="degree-listing" element={<DegreeListing />} />
        </Route>

        <Route path="/recuiter">
          <Route path="jobPost" element={<JobPost />} />
        </Route>

        <Route path="/degreelist" element={<DegreeList />} />
      </Route>
    </Routes>

  );
};

export default App;