import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./RatingFeedback.css";

function RatingFeedback() {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // DATA RECEIVED FROM MY REQUESTS
  // =====================================================

  const requestId = location.state?.requestId || "";

  const skill = location.state?.skill || {};

  const teacher = location.state?.teacher || {};

  // =====================================================
  // LOGGED-IN USER
  // =====================================================

  const savedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userEmail =
    localStorage.getItem("userEmail") ||
    savedUser?.email ||
    "";

  const userName =
    localStorage.getItem("userName") ||
    savedUser?.fullName ||
    "SkillSwap User";

  // =====================================================
  // STATES
  // =====================================================

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =====================================================
  // SKILL DETAILS
  // =====================================================

  const skillName =
    skill.skillName ||
    skill.name ||
    "Selected Skill";

  const teacherName =
    teacher.fullName ||
    teacher.teacherName ||
    skill.teacherName ||
    "Skill Teacher";

  const teacherEmail =
  teacher.email ||
  teacher.teacherEmail ||
  skill.teacherEmail ||
  "";

const skillId =
  skill._id ||
  skill.id ||
  skill.skillId ||
  "";


  // =====================================================
  // SUBMIT RATING
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!rating) {
      setMessage("Please select a rating.");
      setMessageType("error");
      return;
    }

    if (!userEmail) {
      setMessage("Please login first.");
      setMessageType("error");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    if (!requestId) {
      setMessage("Request information is missing.");
      setMessageType("error");
      return;
    }

    if (!skillId) {
      setMessage("Skill information is missing.");
      setMessageType("error");
      return;
    }

    if (!teacherEmail) {
      setMessage("Teacher information is missing.");
      setMessageType("error");
      return;
    }

    if (
      userEmail.toLowerCase() ===
      teacherEmail.toLowerCase()
    ) {
      setMessage("You cannot rate your own skill.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/ratings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            requestId: requestId,
            skillId: skillId,
            skillName: skillName,
            reviewerEmail: userEmail,
            reviewerName: userName,
            teacherEmail: teacherEmail,
            teacherName: teacherName,
            rating: rating,
            feedback: feedback.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to submit rating."
        );

        setMessageType("error");
        return;
      }

      setMessage(
        "Rating and feedback submitted successfully! ⭐"
      );

      setMessageType("success");

      setRating(0);
      setFeedback("");

      setTimeout(() => {
        navigate("/my-requests");
      }, 1000);

    } catch (error) {
      console.error(
        "Rating Error:",
        error
      );

      setMessage(
        "Unable to connect to server. Please start the backend server."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="rating-page">

      <div className="rating-card">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <button
          type="button"
          className="rating-back-button"
          onClick={() =>
            navigate("/my-requests")
          }
          disabled={loading}
        >
          ← Back to My Requests
        </button>

        {/* =========================
            HEADER
        ========================= */}

        <div className="rating-header">

          <h1>Rating & Feedback</h1>

          <p>
            Share your experience with this
            skill exchange.
          </p>

        </div>

        {/* =========================
            MESSAGE
        ========================= */}

        {message && (
          <div
            className={`rating-message ${messageType}`}
          >
            {message}
          </div>
        )}

        {/* =========================
            SKILL INFORMATION
        ========================= */}

        <div className="rating-info">

          <div className="rating-info-row">

            <span className="rating-info-label">
              Skill
            </span>

            <span className="rating-info-value">
              {skillName}
            </span>

          </div>

          <div className="rating-info-row">

            <span className="rating-info-label">
              Skill Teacher
            </span>

            <span className="rating-info-value">
              {teacherName}
            </span>

          </div>

        </div>

        {/* =========================
            RATING
        ========================= */}

        <div className="rating-section">

          <label className="rating-label">
            Your Rating
          </label>

          <div className="stars-container">

            {[1, 2, 3, 4, 5].map(
              (star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${
                    star <= rating
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setRating(star)
                  }
                  disabled={loading}
                  title={`${star} Star`}
                >
                  ★
                </button>
              )
            )}

          </div>

          <div className="rating-text">

            {rating === 0
              ? "Select your rating"
              : `${rating} out of 5 stars`}

          </div>

        </div>

        {/* =========================
            FEEDBACK
        ========================= */}

        <div className="feedback-section">

          <label
            htmlFor="feedback"
            className="rating-label"
          >
            Feedback
          </label>

          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) =>
              setFeedback(e.target.value)
            }
            placeholder="Write your feedback about this skill exchange..."
            rows={5}
            disabled={loading}
          />

        </div>

        {/* =========================
            BUTTONS
        ========================= */}

        <div className="rating-buttons">

          <button
            type="button"
            className="submit-rating-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Rating"}
          </button>

          <button
            type="button"
            className="cancel-rating-button"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

export default RatingFeedback;