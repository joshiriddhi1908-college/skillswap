import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddSkill.css";

function AddSkill() {
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  const handleAddSkill = async (e) => {
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

    const userName =
      localStorage.getItem("userName") || "SkillSwap User";

    const userEmail =
      localStorage.getItem("userEmail") || "";

    if (!userEmail) {
      setMessage("Please login again.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/skills/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            skillName: name,
            category: category,
            level: level,
            description: skillDescription,
            userEmail: userEmail,
            userName: userName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to add skill."
        );

        setMessageType("error");
        return;
      }

      setMessage(
        "Skill added successfully! Waiting for admin approval."
      );

      setMessageType("success");

      setSkillName("");
      setCategory("");
      setLevel("");
      setDescription("");

      setTimeout(() => {
        navigate("/my-skills");
      }, 1200);

    } catch (error) {
      console.error("ADD SKILL ERROR:", error);

      setMessage("Server is not connected.");
      setMessageType("error");
    }
  };

  return (
    <div className="add-skill-page">

      <div className="add-skill-box">

        <div className="add-skill-header">
          <h1>Add Your Skill</h1>

          <p>
            Share your knowledge with the SkillSwap community.
          </p>
        </div>

        {message && (
          <div className={`form-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAddSkill}>

          <label>Skill Name</label>

          <input
            type="text"
            placeholder="Example: Python"
            value={skillName}
            onChange={(e) =>
              setSkillName(e.target.value)
            }
            required
          />

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

          <label>Description</label>

          <textarea
            placeholder="Describe your skill..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows="5"
            required
          />

          <button type="submit">
            Add Skill
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddSkill;