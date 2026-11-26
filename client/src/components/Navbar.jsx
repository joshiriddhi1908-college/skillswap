import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // Logged-in user's email
  const userEmail = localStorage.getItem("userEmail");

  // ONLY this email is Admin
  const adminEmail = "joshiriddhi1908@gmail.com";

  const isAdmin = userEmail === adminEmail;

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* LEFT */}
      <Link to="/dashboard" className="navbar-logo">
        Skill Swap Platform
      </Link>

      {/* CENTER */}
      <div className="navbar-links">
        <Link to="/dashboard">Home</Link>

        <Link to="/my-requests">
          Swap Request
        </Link>

        <Link to="/skills">
          Explore Skills
        </Link>

        {/* ADMIN - ONLY FOR joshiriddhi1908@gmail.com */}
        {isAdmin && (
          <Link to="/admin" className="admin-link">
            🔷 Admin
          </Link>
        )}
      </div>

      {/* RIGHT */}
      <div className="navbar-actions">

        <button
          className="profile-circle"
          onClick={() => navigate("/profile")}
        >
          R
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;