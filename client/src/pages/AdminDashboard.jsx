import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("userName") || "Admin";

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div className="admin-dashboard-page">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="admin-dashboard-header">

        <div>
          <p className="admin-dashboard-label">
            ADMIN PANEL
          </p>

          <h1>
            Welcome, {userName}
          </h1>

          <p className="admin-dashboard-subtitle">
            Manage and monitor your SkillSwap platform.
          </p>
        </div>

        <button
          type="button"
          className="admin-dashboard-back"
          onClick={handleBack}
        >
          ← Back to Home
        </button>

      </div>

      {/* ==================================================
          ADMIN OPTIONS
          ================================================== */}

      <div className="admin-dashboard-grid">

        {/* ==================================================
            ADD SKILL
            ================================================== */}

        <Link
          to="/add-skill"
          className="admin-dashboard-card"
        >
          <div className="admin-card-icon">
            ➕
          </div>

          <div className="admin-card-content">
            <h2>Add Skill</h2>

            <p>
              Add a new skill to the platform.
              The skill will remain pending until it
              is approved from Skill Moderation.
            </p>
          </div>

          <span className="admin-card-arrow">
            →
          </span>
        </Link>

        {/* ==================================================
            MANAGE SKILLS
            ================================================== */}

        <Link
          to="/admin/skills"
          className="admin-dashboard-card"
        >
          <div className="admin-card-icon">
            🛠️
          </div>

          <div className="admin-card-content">
            <h2>Manage Skills</h2>

            <p>
              Review pending skills and approve or
              reject inappropriate skill submissions.
            </p>
          </div>

          <span className="admin-card-arrow">
            →
          </span>
        </Link>

        {/* ==================================================
            MANAGE USERS
            ================================================== */}

        <Link
          to="/admin/users"
          className="admin-dashboard-card"
        >
          <div className="admin-card-icon">
            👥
          </div>

          <div className="admin-card-content">
            <h2>Manage Users</h2>

            <p>
              View users and manage active or banned
              accounts.
            </p>
          </div>

          <span className="admin-card-arrow">
            →
          </span>
        </Link>

        {/* ==================================================
            MANAGE SWAPS
            ================================================== */}

        <Link
          to="/admin/swaps"
          className="admin-dashboard-card"
        >
          <div className="admin-card-icon">
            🔄
          </div>

          <div className="admin-card-content">
            <h2>Manage Swaps</h2>

            <p>
              Monitor pending, accepted and cancelled
              skill swap requests.
            </p>
          </div>

          <span className="admin-card-arrow">
            →
          </span>
        </Link>

        {/* ==================================================
            ANNOUNCEMENTS
            ================================================== */}

        <Link
          to="/admin/announcements"
          className="admin-dashboard-card"
        >
          <div className="admin-card-icon">
            📢
          </div>

          <div className="admin-card-content">
            <h2>Announcements</h2>

            <p>
              Create and manage platform-wide
              announcements for users.
            </p>
          </div>

          <span className="admin-card-arrow">
            →
          </span>
        </Link>

        {/* ==================================================
            REPORTS
            ================================================== */}

        <Link
          to="/admin/reports"
          className="admin-dashboard-card"
        >
          <div className="admin-card-icon">
            📊
          </div>

          <div className="admin-card-content">
            <h2>Reports</h2>

            <p>
              View platform statistics and download
              SkillSwap activity reports.
            </p>
          </div>

          <span className="admin-card-arrow">
            →
          </span>
        </Link>

      </div>

      {/* ==================================================
          FOOTER INFO
          ================================================== */}

      <div className="admin-dashboard-info">
        <strong>
          SkillSwap Admin Panel
        </strong>

        <span>
          Manage • Monitor • Improve
        </span>
      </div>

    </div>
  );
}

export default AdminDashboard;