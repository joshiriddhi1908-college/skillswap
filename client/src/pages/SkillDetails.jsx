
import { useLocation, useNavigate } from "react-router-dom";
import "./SkillDetails.css";

function SkillDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const skillData = location.state;

  // =========================================================
  // REQUEST THIS SKILL
  // =========================================================
  const handleRequest = () => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate("/request-skill", {
      state: skillData,
    });
  };


  // =========================================================
  // NO SKILL SELECTED
  // =========================================================
  if (!skillData) {
    return (
      <div className="skill-details-page">

        <div className="skill-details-header">
          <h1>Skill Details</h1>

          <p>
            View complete information about this skill.
          </p>
        </div>


        <div className="skill-details-box empty-details">

          <div className="empty-details-icon">
            ?
          </div>

          <h2>
            No Skill Selected
          </h2>

          <p>
            Please select a skill from Explore Skills.
          </p>

          <button
            type="button"
            className="request-skill-btn"
            onClick={() => navigate("/skills")}
          >
            Explore Skills
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="skill-details-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="skill-details-header">

        <h1>
          Skill Details
        </h1>

        <p>
          View complete information about this skill.
        </p>

      </div>


      {/* =====================================================
          MAIN DETAILS CARD
      ===================================================== */}
      <div className="skill-details-box">

        {/* ---------------------------------------------------
            SKILL HEADER
        --------------------------------------------------- */}
        <div className="skill-details-title">

          <div className="skill-details-title-info">

            <span className="skill-details-category">
              {skillData.category || "General"}
            </span>

            <h2>
              {skillData.skill}
            </h2>

            <p className="skill-teacher-name">
              Taught by{" "}
              <strong>
                {skillData.teacherName ||
                  "SkillSwap User"}
              </strong>
            </p>

          </div>

          <span className="skill-level">
            {skillData.level || "Beginner"}
          </span>

        </div>


        {/* ---------------------------------------------------
            INFORMATION
        --------------------------------------------------- */}
        <div className="skill-info-list">

          <div className="skill-info-item">

            <small>
              Category
            </small>

            <strong>
              {skillData.category || "General"}
            </strong>

          </div>


          <div className="skill-info-item">

            <small>
              Skill Level
            </small>

            <strong>
              {skillData.level || "Beginner"}
            </strong>

          </div>


          <div className="skill-info-item">

            <small>
              Teacher
            </small>

            <strong>
              {skillData.teacherName ||
                "SkillSwap User"}
            </strong>

          </div>


          {skillData.teacherEmail && (
            <div className="skill-info-item">

              <small>
                Email
              </small>

              <strong>
                {skillData.teacherEmail}
              </strong>

            </div>
          )}

        </div>


        {/* ---------------------------------------------------
            DESCRIPTION
        --------------------------------------------------- */}
        <div className="skill-description">

          <small>
            About This Skill
          </small>

          <p>
            {skillData.description ||
              `I can teach ${skillData.skill} and help you learn useful skills and concepts through SkillSwap.`}
          </p>

        </div>


        {/* ---------------------------------------------------
            ACTION BUTTONS
        --------------------------------------------------- */}
        <div className="skill-details-actions">

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            Back
          </button>


          <button
            type="button"
            className="request-skill-btn"
            onClick={handleRequest}
          >
            Request This Skill
          </button>

        </div>

      </div>

    </div>
  );
}

export default SkillDetails;

