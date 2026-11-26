import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// USER / AUTH
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ExploreSkills from "./pages/ExploreSkills";
import SkillDetails from "./pages/SkillDetails";
import RequestSkill from "./pages/RequestSkill";
import MyRequests from "./pages/MyRequests";
import MySkills from "./pages/MySkills";
import Settings from "./pages/Settings";
import BrowseUsers from "./pages/BrowseUsers";
import RatingFeedback from "./pages/RatingFeedback";
import AddSkill from "./pages/AddSkill";

// ADMIN
import AdminDashboard from "./pages/AdminDashboard";
import AdminSkills from "./pages/AdminSkills";
import AdminUsers from "./pages/AdminUsers";
import AdminSwaps from "./pages/AdminSwaps";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import AdminReports from "./pages/AdminReports";

// COMPONENTS
import Navbar from "./components/Navbar";
import NotificationToast from "./components/NotificationToast";


function AppLayout() {
  const location = useLocation();

  /*
    Navbar ONLY auth pages par hide thase.

    Signup
    Login
    Verify Email
    Forgot Password
    Reset Password

    Baki badha pages par Navbar dekhase.
  */

  const hideNavbar = [
    "/",
    "/signup",
    "/login",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname);


  return (
    <>
      {/* =========================
          NAVBAR
          ========================= */}

      {!hideNavbar && <Navbar />}


      {/* =========================
          ALL ROUTES
          ========================= */}

      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* USER */}
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/skills" element={<ExploreSkills />} />
        <Route path="/skill-details" element={<SkillDetails />} />
        <Route path="/request-skill" element={<RequestSkill />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/my-skills" element={<MySkills />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/browse" element={<BrowseUsers />} />
        <Route path="/rating-feedback" element={<RatingFeedback />} />
        <Route path="/add-skill" element={<AddSkill />} />


        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-skills" element={<AdminSkills />} />
        <Route path="/admin/skills" element={<AdminSkills />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/swaps" element={<AdminSwaps />} />
        <Route
          path="/admin/announcements"
          element={<AdminAnnouncements />}
        />
        <Route
          path="/admin/reports"
          element={<AdminReports />}
        />

      </Routes>


      {/* NOTIFICATION */}
      <NotificationToast />
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;