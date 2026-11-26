import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MySkills.css";

function MySkills() {
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);

  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ======================================================
  // LOAD MY SKILLS
  // ======================================================

  const fetchSkills = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      setMessage("Please login again.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/skills/my/${encodeURIComponent(
          userEmail
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to load skills."
        );
        setMessageType("error");
        setSkills([]);
        return;
      }

      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD MY SKILLS ERROR:", error);

      setMessage(
        "Server is not connected. Please start the backend server."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // ======================================================
  // DELETE SKILL
  // ======================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/skills/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to delete skill."
        );
        setMessageType("error");
        return;
      }

      setSkills((previousSkills) =>
        previousSkills.filter(
          (skill) => skill._id !== id
        )
      );

      setMessage("Skill deleted successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("DELETE SKILL ERROR:", error);

      setMessage("Server is not connected.");
      setMessageType("error");
    }
  };

  // ======================================================
  // EDIT SKILL
  // ======================================================

  const handleEdit = (skill) => {
    setMessage("");
    setMessageType("");

    setEditingSkill(skill._id);

    setSkillName(skill.skillName || "");
    setCategory(skill.category || "");
    setLevel(skill.level || "");
    setDescription(skill.description || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // UPDATE SKILL
  // ======================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    const name = skillName.trim();
    const skillDescription = description.trim();

    if (!name) {
      setMessage("Please enter a skill name.");
      setMessageType("error");
      return;
    }

    if (!category) {
      setMessage("Please select a category.");
      setMessageType("error");
      return;
    }

    if (!level) {
      setMessage("Please select a skill level.");
      setMessageType("error");
      return;
    }

    if (!skillDescription) {
      setMessage("Please enter a description.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/skills/${editingSkill}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skillName: name,
            category,
            level,
            description: skillDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to update skill."
        );
        setMessageType("error");
        return;
      }

      setSkills((previousSkills) =>
        previousSkills.map((skill) =>
          skill._id === editingSkill
            ? data.skill
            : skill
        )
      );

      setEditingSkill(null);

      setSkillName("");
      setCategory("");
      setLevel("");
      setDescription("");

      setMessage(
        "Skill updated successfully! Waiting for admin approval."
      );
      setMessageType("success");
    } catch (error) {
      console.error("UPDATE SKILL ERROR:", error);

      setMessage("Server is not connected.");
      setMessageType("error");
    }
  };

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  const handleCancel = () => {
    setEditingSkill(null);

    setSkillName("");
    setCategory("");
    setLevel("");
    setDescription("");

    setMessage("");
    setMessageType("");
  };

  // ======================================================
  // STATUS CLASS
  // ======================================================

  const getStatusClass = (status) => {
    if (status === "approved") {
      return "skill-status approved";
    }

    if (status === "rejected") {
      return "skill-status rejected";
    }

    return "skill-status pending";
  };

  // ======================================================
  // STATUS TEXT
  // ======================================================

  const getStatusText = (status) => {
    if (status === "approved") {
      return "Approved";
    }

    if (status === "rejected") {
      return "Rejected";
    }

    return "Pending Approval";
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="my-skills-page">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="my-skills-header">

        <button
          type="button"
          className="my-skills-back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <span className="my-skills-label">
          SKILLSWAP
        </span>

        <h1>My Skills</h1>

        <p>
          Manage the skills you have shared
          with the SkillSwap community.
        </p>

      </div>

      {/* ==================================================
          MESSAGE
          ================================================== */}

      {message && (
        <div
          className={`form-message ${messageType}`}
        >
          {message}
        </div>
      )}

      {/* ==================================================
          TOP ACTION
          ================================================== */}

      <div className="my-skills-actions">

        <button
          type="button"
          className="add-skill-main-btn"
          onClick={() => navigate("/add-skill")}
        >
          + Add New Skill
        </button>

      </div>

      {/* ==================================================
          EDIT FORM
          ================================================== */}

      {editingSkill && (
        <div className="edit-skill-card">

          <div className="edit-skill-header">

            <div>
              <span className="section-label">
                MANAGE SKILL
              </span>

              <h2>Edit Skill</h2>

              <p>
                Update your skill information below.
              </p>
            </div>

            <button
              type="button"
              className="close-edit-btn"
              onClick={handleCancel}
            >
              ✕
            </button>

          </div>

          <form
            className="edit-skill-form"
            onSubmit={handleUpdate}
          >

            <div className="form-group">

              <label>Skill Name</label>

              <input
                type="text"
                value={skillName}
                onChange={(e) =>
                  setSkillName(e.target.value)
                }
                placeholder="e.g. Photoshop"
                required
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="Programming">
                    Programming
                  </option>

                  <option value="Design">
                    Design
                  </option>

                  <option value="Creative">
                    Creative
                  </option>

                  <option value="Language">
                    Language
                  </option>

                  <option value="Business">
                    Business
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label>Skill Level</label>

                <select
                  value={level}
                  onChange={(e) =>
                    setLevel(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select Level
                  </option>

                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>
                </select>

              </div>

            </div>

            <div className="form-group">

              <label>Description</label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe what you can teach..."
                rows="5"
                required
              />

            </div>

            <div className="edit-form-actions">

              <button
                type="button"
                className="cancel-edit-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-edit-btn"
              >
                Save Changes
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ==================================================
          SKILLS CONTENT
          ================================================== */}

      <div className="my-skills-content">

        <div className="skills-section-heading">

          <div>
            <span className="section-label">
              YOUR SKILLS
            </span>

            <h2>
              Skills You Offer
            </h2>
          </div>

          <span className="skills-count">
            {skills.length}{" "}
            {skills.length === 1
              ? "Skill"
              : "Skills"}
          </span>

        </div>

        {/* ==================================================
            LOADING
            ================================================== */}

        {loading ? (
          <div className="skills-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading your skills...
            </p>

          </div>
        ) : skills.length === 0 ? (

          /* ==================================================
             EMPTY STATE
             ================================================== */

          <div className="empty-skills">

            <div className="empty-skills-icon">
              +
            </div>

            <h3>
              No Skills Added Yet
            </h3>

            <p>
              Add your first skill and start
              sharing your knowledge with
              the SkillSwap community.
            </p>

            <button
              type="button"
              className="add-first-skill-btn"
              onClick={() =>
                navigate("/add-skill")
              }
            >
              Add Your First Skill
            </button>

          </div>

        ) : (

          /* ==================================================
             SKILLS LIST
             ================================================== */

          <div className="my-skills-list">

            {skills.map((skill) => (

              <div
                className="my-skill-card"
                key={skill._id}
              >

                <div className="skill-card-header">

                  <div className="skill-card-title">

                    <div className="skill-icon">
                      {skill.skillName
                        ? skill.skillName
                            .charAt(0)
                            .toUpperCase()
                        : "S"}
                    </div>

                    <div>

                      <span className="skill-category">
                        {skill.category ||
                          "General"}
                      </span>

                      <h3>
                        {skill.skillName ||
                          "Skill"}
                      </h3>

                    </div>

                  </div>

                  <div
                    className={getStatusClass(
                      skill.status
                    )}
                  >
                    {getStatusText(
                      skill.status
                    )}
                  </div>

                </div>

                <div className="skill-card-details">

                  <div className="skill-detail-box">

                    <span>
                      Skill Level
                    </span>

                    <strong>
                      {skill.level ||
                        "Not specified"}
                    </strong>

                  </div>

                  <div className="skill-detail-box">

                    <span>
                      Status
                    </span>

                    <strong>
                      {getStatusText(
                        skill.status
                      )}
                    </strong>

                  </div>

                </div>

                <div className="skill-description-box">

                  <span>
                    Description
                  </span>

                  <p>
                    {skill.description ||
                      "No description provided."}
                  </p>

                </div>

                {/* ==================================================
                    REJECTION REASON
                    ================================================== */}

                {skill.status === "rejected" &&
                  skill.rejectionReason && (
                    <div className="rejection-box">

                      <span>
                        Rejection Reason
                      </span>

                      <p>
                        {skill.rejectionReason}
                      </p>

                    </div>
                  )}

                {/* ==================================================
                    ACTIONS
                    ================================================== */}

                <div className="skill-card-actions">

                  <button
                    type="button"
                    className="edit-skill-btn"
                    onClick={() =>
                      handleEdit(skill)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-skill-btn"
                    onClick={() =>
                      handleDelete(
                        skill._id
                      )
                    }
                  >
                    Delete
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

export default MySkills;