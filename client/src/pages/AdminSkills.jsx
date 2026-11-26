import { useEffect, useState } from "react";
import "./AdminSkills.css";

function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  // ======================================================
  // FETCH PENDING SKILLS
  // ======================================================

  const fetchPendingSkills = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/skills/admin/pending"
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load pending skills.");
        return;
      }

      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Admin Skills Error:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSkills();
  }, []);

  // ======================================================
  // APPROVE SKILL
  // ======================================================

  const approveSkill = async (id) => {
    try {
      setActionLoading(id);

      const response = await fetch(
        `http://localhost:5000/api/skills/admin/approve/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to approve skill.");
        return;
      }

      alert("Skill approved successfully! ✅");

      setSkills((prevSkills) =>
        prevSkills.filter((skill) => skill._id !== id)
      );
    } catch (error) {
      console.log("Approve Error:", error);
      alert("Unable to connect to server.");
    } finally {
      setActionLoading(null);
    }
  };

  // ======================================================
  // REJECT SKILL
  // ======================================================

  const rejectSkill = async (skill) => {
    const reason = window.prompt(
      `Why do you want to reject "${skill.skillName}"?\n\nExample: Spam, inappropriate content, invalid description`
    );

    if (reason === null) {
      return;
    }

    if (!reason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    /*
      NOTE:
      This endpoint should exist in backend:
      PUT /api/skills/admin/reject/:id

      Body:
      {
        rejectionReason: reason
      }
    */

    try {
      setActionLoading(skill._id);

      const response = await fetch(
        `http://localhost:5000/api/skills/admin/reject/${skill._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rejectionReason: reason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to reject skill.");
        return;
      }

      alert("Skill rejected successfully. ❌");

      setSkills((prevSkills) =>
        prevSkills.filter(
          (currentSkill) => currentSkill._id !== skill._id
        )
      );
    } catch (error) {
      console.log("Reject Error:", error);
      alert("Unable to connect to server.");
    } finally {
      setActionLoading(null);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="admin-skills-page">

        <div className="admin-skills-header">
          <div className="admin-page-badge">
            ADMIN PANEL
          </div>

          <h1>
            🛡️ Skill Moderation
          </h1>

          <p>
            Review user-submitted skills before they become
            visible on the platform.
          </p>
        </div>

        <div className="admin-skills-card">

          <div className="admin-no-skills">
            <span className="admin-empty-icon">
              ⏳
            </span>

            <h3>
              Loading Skills
            </h3>

            <p>
              Please wait while pending skills are being loaded.
            </p>
          </div>

        </div>

      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="admin-skills-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-skills-header">

        <div className="admin-page-badge">
          ADMIN PANEL
        </div>

        <h1>
          🛡️ Skill Moderation
        </h1>

        <p>
          Review user-submitted skills before they become
          visible to users.
        </p>

      </div>


      {/* ==================================================
          MAIN CARD
      ================================================== */}

      <div className="admin-skills-card">

        {/* ==================================================
            CARD HEADER
        ================================================== */}

        <div className="admin-skills-card-header">

          <div>
            <h2>
              Pending Skill Requests
            </h2>

            <p>
              Check the skill details and approve or reject
              submissions.
            </p>
          </div>

          <div className="admin-pending-count">
            {skills.length}
          </div>

        </div>


        {/* ==================================================
            NO PENDING SKILLS
        ================================================== */}

        {skills.length === 0 ? (

          <div className="admin-no-skills">

            <span className="admin-empty-icon">
              🎉
            </span>

            <h3>
              All Caught Up!
            </h3>

            <p>
              No pending skills to review right now.
            </p>

          </div>

        ) : (

          /* ==================================================
             SKILL LIST
             ================================================== */

          <div className="admin-skill-list">

            {skills.map((skill) => (

              <div
                className="admin-skill-item"
                key={skill._id}
              >

                {/* ==================================================
                    SKILL INFORMATION
                ================================================== */}

                <div className="admin-skill-info">

                  <div className="admin-skill-title-row">

                    <h3>
                      {skill.skillName || "Unnamed Skill"}
                    </h3>

                    <span className="admin-status">
                      Pending
                    </span>

                  </div>


                  <div className="admin-skill-meta">

                    <div className="admin-meta-box">
                      <span className="admin-meta-label">
                        Category
                      </span>

                      <strong>
                        {skill.category || "General"}
                      </strong>
                    </div>


                    <div className="admin-meta-box">
                      <span className="admin-meta-label">
                        Level
                      </span>

                      <strong>
                        {skill.level || "Not specified"}
                      </strong>
                    </div>

                  </div>


                  {/* ==================================================
                      DESCRIPTION
                  ================================================== */}

                  <div className="admin-description-box">

                    <span>
                      Description
                    </span>

                    <p>
                      {skill.description ||
                        "No description provided."}
                    </p>

                  </div>


                  {/* ==================================================
                      USER INFORMATION
                  ================================================== */}

                  <div className="admin-user-info">

                    <div>
                      <span>
                        Added by
                      </span>

                      <strong>
                        {skill.userName || "Unknown User"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Email
                      </span>

                      <strong>
                        {skill.userEmail || "No email"}
                      </strong>
                    </div>

                  </div>

                </div>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className="admin-skill-actions">

                  <button
                    className="admin-approve-btn"
                    type="button"
                    disabled={actionLoading === skill._id}
                    onClick={() =>
                      approveSkill(skill._id)
                    }
                  >
                    {actionLoading === skill._id
                      ? "Processing..."
                      : "✅ Approve"}
                  </button>


                  <button
                    className="admin-reject-btn"
                    type="button"
                    disabled={actionLoading === skill._id}
                    onClick={() =>
                      rejectSkill(skill)
                    }
                  >
                    ❌ Reject
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminSkills;