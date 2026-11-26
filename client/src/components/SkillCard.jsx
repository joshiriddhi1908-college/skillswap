import { useNavigate } from "react-router-dom";
import "./SkillCard.css";

function SkillCard({
  skill,
  category,
  level,
  skillId,
  teacherEmail,
  teacherName,
  description,
}) {
  const navigate = useNavigate();

  const handleRequest = () => {
    navigate("/skill-details", {
      state: {
        skill,
        category,
        level,
        skillId,
        teacherEmail,
        teacherName,
        description,
      },
    });
  };

  return (
    <div className="skill-card">

      {/* =========================
          PROFILE
      ========================== */}
      <div className="skill-card-profile">

        <div className="profile-avatar">
          {teacherName
            ? teacherName.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div className="profile-info">
          <h3>
            {teacherName || "Skill User"}
          </h3>

          <span>
            {teacherEmail || "User"}
          </span>
        </div>

      </div>


      {/* =========================
          SKILL INFORMATION
      ========================== */}
      <div className="skill-card-content">

        <h2>
          {skill || "Skill"}
        </h2>

        <div className="skill-tags">

          <span className="skill-category">
            {category || "General"}
          </span>

          <span className="skill-level">
            {level || "Beginner"}
          </span>

        </div>

        {description && (
          <p className="skill-description">
            {description}
          </p>
        )}

      </div>


      {/* =========================
          VIEW DETAILS BUTTON
      ========================== */}
      <div className="skill-card-action">

        <button
          type="button"
          className="request-skill-btn"
          onClick={handleRequest}
        >
          View Details
        </button>

      </div>

    </div>
  );
}

export default SkillCard;