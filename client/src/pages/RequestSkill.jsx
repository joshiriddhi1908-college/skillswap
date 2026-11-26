import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RequestSkill.css";

function RequestSkill() {
  const [message, setMessage] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Safety feature states
  const [safetyWarning, setSafetyWarning] = useState("");
  const [showSafetyCheck, setShowSafetyCheck] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Skill details received from SkillDetails
  const selectedSkill = location.state;


  // =========================================================
  // SAFETY / SCAM CHECK
  // =========================================================

  const checkSafety = (text) => {
    const suspiciousWords = [
      "otp",
      "password",
      "bank account",
      "bank details",
      "credit card",
      "debit card",
      "upi",
      "payment",
      "pay me",
      "send money",
      "money",
      "pin",
    ];

    const lowerText = text.toLowerCase();

    const foundWord = suspiciousWords.find((word) =>
      lowerText.includes(word)
    );

    if (foundWord) {
      setSafetyWarning(
        "This message contains information that may be unsafe to share."
      );

      return true;
    }

    setSafetyWarning("");
    return false;
  };


  // =========================================================
  // MESSAGE CHANGE
  // =========================================================

  const handleMessageChange = (e) => {
    const value = e.target.value;

    setMessage(value);
    setMessageText("");
    setMessageType("");

    checkSafety(value);
  };


  // =========================================================
  // SEND REQUEST
  // =========================================================

  const handleRequest = async (e) => {
    e.preventDefault();

    setMessageText("");
    setMessageType("");

    const requestMessage = message.trim();

    if (!requestMessage) {
      setMessageText("Please write a message.");
      setMessageType("error");
      return;
    }

    const isUnsafe = checkSafety(requestMessage);

    if (isUnsafe) {
      setShowSafetyCheck(true);
      return;
    }

    await sendRequest(requestMessage);
  };


  // =========================================================
  // ACTUAL API REQUEST
  // =========================================================

  const sendRequest = async (requestMessage) => {
    const requesterEmail =
      localStorage.getItem("userEmail");

    const requesterName =
      localStorage.getItem("userName") ||
      "SkillSwap User";


    // Login check
    if (!requesterEmail) {
      setMessageText("Please login again.");
      setMessageType("error");
      return;
    }


    // Skill ID check
    if (!selectedSkill.skillId) {
      setMessageText("Skill information is missing.");
      setMessageType("error");
      return;
    }


    // Teacher email check
    if (!selectedSkill.teacherEmail) {
      setMessageText(
        "Skill owner information is missing."
      );

      setMessageType("error");
      return;
    }


    // Prevent requesting own skill
    if (
      requesterEmail.trim().toLowerCase() ===
      selectedSkill.teacherEmail.trim().toLowerCase()
    ) {
      setMessageText(
        "You cannot request your own skill."
      );

      setMessageType("error");
      return;
    }


    try {
      setIsSending(true);
      setShowSafetyCheck(false);

      const response = await fetch(
        "http://localhost:5000/api/requests/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            skillId: selectedSkill.skillId,

            skillName: selectedSkill.skill,

            category:
              selectedSkill.category || "General",

            level:
              selectedSkill.level || "Beginner",

            teacherEmail:
              selectedSkill.teacherEmail,

            teacherName:
              selectedSkill.teacherName ||
              "SkillSwap User",

            requesterEmail:
              requesterEmail,

            requesterName:
              requesterName,

            message:
              requestMessage,
          }),
        }
      );


      const data = await response.json();


      // Backend error
      if (!response.ok) {
        setMessageText(
          data.message ||
          "Failed to send request."
        );

        setMessageType("error");
        return;
      }


      // Success
      setMessageText(
        "Skill request sent successfully! 🎉"
      );

      setMessageType("success");

      setMessage("");
      setSafetyWarning("");


      // Go to My Requests
      setTimeout(() => {
        navigate("/my-requests");
      }, 1000);

    } catch (error) {
      console.error("Request Error:", error);

      setMessageText(
        "Server is not connected. Please start the backend server."
      );

      setMessageType("error");

    } finally {
      setIsSending(false);
    }
  };


  // =========================================================
  // CONTINUE ANYWAY
  // =========================================================

  const handleContinueAnyway = () => {
    const requestMessage = message.trim();

    if (!requestMessage) {
      setShowSafetyCheck(false);
      return;
    }

    sendRequest(requestMessage);
  };


  // =========================================================
  // EDIT MESSAGE
  // =========================================================

  const handleEditMessage = () => {
    setShowSafetyCheck(false);
  };


  // =========================================================
  // NO SKILL SELECTED
  // =========================================================

  if (!selectedSkill) {
    return (
      <div className="request-page">

        <div className="request-box empty-request">

          <div className="request-empty-icon">
            ?
          </div>

          <h1>
            Request a Skill
          </h1>

          <p>
            No skill has been selected.
            Please choose a skill first.
          </p>

          <button
            type="button"
            onClick={() => navigate("/skills")}
          >
            Explore Skills
          </button>

        </div>

      </div>
    );
  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="request-page">

      <div className="request-box">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="request-header">

          <span className="request-label">
            SKILL REQUEST
          </span>

          <h1>
            Request a Skill
          </h1>

          <p>
            Send a request to learn this skill
            from another SkillSwap user.
          </p>

        </div>


        {/* =================================================
            SELECTED SKILL
        ================================================= */}

        <div className="request-skill-card">

          <div className="request-skill-avatar">
            {selectedSkill.teacherName
              ? selectedSkill.teacherName
                .charAt(0)
                .toUpperCase()
              : "U"}
          </div>


          <div className="request-skill-content">

            <div className="request-skill-top">

              <div>
                <h2>
                  {selectedSkill.skill}
                </h2>

                <p>
                  Taught by{" "}
                  <strong>
                    {selectedSkill.teacherName ||
                      "SkillSwap User"}
                  </strong>
                </p>
              </div>

              <span className="request-level">
                {selectedSkill.level ||
                  "Beginner"}
              </span>

            </div>


            <div className="request-skill-meta">

              <span>
                {selectedSkill.category ||
                  "General"}
              </span>

              <span>
                {selectedSkill.level ||
                  "Beginner"}
              </span>

            </div>


            {selectedSkill.description && (
              <p className="request-skill-description">
                {selectedSkill.description}
              </p>
            )}

          </div>

        </div>


        {/* =================================================
            SUCCESS / ERROR MESSAGE
        ================================================= */}

        {messageText && (
          <div
            className={`form-message ${messageType}`}
          >
            {messageText}
          </div>
        )}


        {/* =================================================
            SAFETY INFORMATION
        ================================================= */}

        <div className="safety-info">

          <div className="safety-icon">
            🛡️
          </div>

          <div>
            <h3>
              Safety Check
            </h3>

            <p>
              Never share your OTP, password,
              PIN, bank details or send money
              to another user.
            </p>
          </div>

        </div>


        {/* =================================================
            SAFETY WARNING
        ================================================= */}

        {safetyWarning && (
          <div className="safety-warning">

            <strong>
              ⚠️ Safety Warning
            </strong>

            <p>
              {safetyWarning}
            </p>

            <small>
              SkillSwap will never ask you to
              share passwords, OTPs, PINs or
              payment details.
            </small>

          </div>
        )}


        {/* =================================================
            REQUEST FORM
        ================================================= */}

        <form
          className="request-form"
          onSubmit={handleRequest}
        >

          <label htmlFor="request-message">
            Your Message
          </label>

          <p className="request-form-hint">
            Introduce yourself and tell the skill
            owner why you want to learn this skill.
          </p>

          <textarea
            id="request-message"
            placeholder="Example: Hi! I would love to learn this skill from you. Please let me know when you are available."
            value={message}
            onChange={handleMessageChange}
            rows={6}
            disabled={isSending}
          />


          <div className="request-form-actions">

            <button
              type="button"
              className="request-cancel-btn"
              onClick={() => navigate(-1)}
              disabled={isSending}
            >
              Back
            </button>

            <button
              type="submit"
              className="send-request-btn"
              disabled={isSending}
            >
              {isSending
                ? "Sending..."
                : "Send Request"}
            </button>

          </div>

        </form>


        {/* =================================================
            SAFETY CONFIRMATION
        ================================================= */}

        {showSafetyCheck && (
          <div className="safety-confirmation">

            <div className="safety-confirmation-icon">
              🛡️
            </div>

            <h2>
              Please Check Your Message
            </h2>

            <p>
              Your message may contain sensitive
              information such as payment or
              account details.
            </p>

            <p>
              For your safety, remove any OTP,
              password, PIN, bank or payment
              information before sending.
            </p>

            <div className="safety-actions">

              <button
                type="button"
                className="safety-edit-btn"
                onClick={handleEditMessage}
                disabled={isSending}
              >
                Edit Message
              </button>

              <button
                type="button"
                className="safety-continue-btn"
                onClick={handleContinueAnyway}
                disabled={isSending}
              >
                {isSending
                  ? "Sending..."
                  : "Continue Anyway"}
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default RequestSkill;