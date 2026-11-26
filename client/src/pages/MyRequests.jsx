import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyRequests.css";

function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // REPORT STATES
  // =========================

  const [reportingRequest, setReportingRequest] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  // =========================
  // SHOW MESSAGE
  // =========================

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3500);
  };

  // =========================
  // LOAD REQUESTS
  // =========================

  const fetchRequests = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      setMessage("Please login again.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // =========================
      // SENT REQUESTS
      // =========================

      const sentResponse = await fetch(
        `http://localhost:5000/api/requests/my/${encodeURIComponent(
          userEmail
        )}`
      );

      const sentData = await sentResponse.json();

      if (sentResponse.ok) {
        setRequests(Array.isArray(sentData) ? sentData : []);
      } else {
        setRequests([]);
      }

      // =========================
      // RECEIVED REQUESTS
      // =========================

      const receivedResponse = await fetch(
        `http://localhost:5000/api/requests/received/${encodeURIComponent(
          userEmail
        )}`
      );

      const receivedData = await receivedResponse.json();

      if (receivedResponse.ok) {
        setReceivedRequests(
          Array.isArray(receivedData) ? receivedData : []
        );
      } else {
        setReceivedRequests([]);
      }
    } catch (error) {
      console.error("Failed to load requests:", error);

      setMessage(
        "Server is not connected. Please start the backend server."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================
  // DELETE SENT REQUEST
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.message || "Failed to delete request.",
          "error"
        );
        return;
      }

      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== id)
      );

      showMessage("Request deleted successfully.", "success");
    } catch (error) {
      console.error("Delete Request Error:", error);

      showMessage("Server is not connected.", "error");
    }
  };

  // =========================
  // ACCEPT / REJECT REQUEST
  // =========================

 // =========================
// ACCEPT / REJECT REQUEST
// =========================

const handleStatusUpdate = async (id, status) => {
  const backendStatus =
    status === "accepted"
      ? "Accepted"
      : status === "rejected"
      ? "Rejected"
      : "Pending";

  const actionText =
    backendStatus === "Accepted"
      ? "accept"
      : "reject";

  const confirmAction = window.confirm(
    `Are you sure you want to ${actionText} this request?`
  );

  if (!confirmAction) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/requests/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: backendStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showMessage(
        data.message || "Failed to update request.",
        "error"
      );
      return;
    }

    showMessage(
      `Request ${actionText}ed successfully.`,
      "success"
    );

    await fetchRequests();
  } catch (error) {
    console.error("Update Request Error:", error);

    showMessage(
      "Server is not connected.",
      "error"
    );
  }
};
  // =========================
  // GIVE RATING
  // =========================

  const handleGiveRating = (request) => {
    navigate("/rating-feedback", {
      state: {
        skill: {
          _id: request.skillId,
          skillName: request.skillName,
          category: request.category,
          level: request.level,
          teacherEmail: request.teacherEmail,
          teacherName:
            request.teacherName || "SkillSwap User",
        },

        teacher: {
          email: request.teacherEmail,
          fullName:
            request.teacherName || "SkillSwap User",
        },

        requestId: request._id,
      },
    });
  };

  // =========================
  // OPEN REPORT
  // =========================

  const handleOpenReport = (request) => {
    setReportingRequest(request);
    setReportReason("");
    setReportDescription("");
  };

  // =========================
  // CLOSE REPORT
  // =========================

  const handleCloseReport = () => {
    setReportingRequest(null);
    setReportReason("");
    setReportDescription("");
  };

  // =========================
  // SUBMIT REPORT
  // =========================

  const handleSubmitReport = () => {
    if (!reportReason) {
      showMessage(
        "Please select a reason for reporting.",
        "error"
      );
      return;
    }

    if (!reportingRequest) {
      return;
    }

    const reporterEmail = localStorage.getItem("userEmail");

    if (!reporterEmail) {
      showMessage("Please login again.", "error");
      return;
    }

    const report = {
      id: Date.now(),

      reporterEmail,

      // Received request means requester is the reported user
      reportedUser: reportingRequest.requesterEmail,

      reportedUserName:
        reportingRequest.requesterName || "SkillSwap User",

      requestId: reportingRequest._id,

      skillName: reportingRequest.skillName,

      reason: reportReason,

      description: reportDescription.trim(),

      status: "Pending",

      createdAt: new Date().toISOString(),
    };

    const oldReports =
      JSON.parse(
        localStorage.getItem("skillSwapReports")
      ) || [];

    oldReports.push(report);

    localStorage.setItem(
      "skillSwapReports",
      JSON.stringify(oldReports)
    );

    handleCloseReport();

    showMessage(
      "Report submitted successfully. 🚩",
      "success"
    );
  };

// =========================
// NORMALIZE STATUS
// =========================

const normalizeStatus = (status) => {
  return String(status || "pending").toLowerCase();
};


// =========================
// STATUS CLASS
// =========================

const getStatusClass = (status) => {
  return normalizeStatus(status);
};

  // =========================
  // RENDER
  // =========================

  return (
    <div className="requests-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="requests-header">

        <button
          type="button"
          className="requests-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <span className="requests-header-label">
          SKILLSWAP
        </span>

        <h1>My Skill Requests</h1>

        <p>
          Manage your sent and received skill requests.
        </p>

      </div>

      {/* ==================================================
          MESSAGE
      ================================================== */}

      {message && (
        <div className={`form-message ${messageType}`}>
          {message}
        </div>
      )}

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading ? (
        <div className="requests-loading">

          <div className="loading-spinner"></div>

          <p>Loading requests...</p>

        </div>
      ) : (
        <div className="requests-content">

          {/* ==================================================
              SENT REQUESTS
          ================================================== */}

          <section className="request-section">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  YOUR ACTIVITY
                </span>

                <h2>Sent Requests</h2>
              </div>

              <span className="request-count">
                {requests.length}{" "}
                {requests.length === 1
                  ? "Request"
                  : "Requests"}
              </span>

            </div>

            {requests.length === 0 ? (

              <div className="empty-request">

                <div className="empty-request-icon">
                  ↗
                </div>

                <h3>No sent requests yet</h3>

                <p>
                  Explore skills and send a request
                  to start learning.
                </p>

                <button
                  type="button"
                  className="primary-request-btn"
                  onClick={() => navigate("/skills")}
                >
                  Explore Skills
                </button>

              </div>

            ) : (

              <div className="request-list">

                {requests.map((request) => (

                  <div
                    className="request-card"
                    key={request._id}
                  >

                    {/* CARD HEADER */}

                    <div className="request-card-top">

                      <div className="request-skill-info">

                        <div className="request-avatar">
                          {request.skillName
                            ? request.skillName
                                .charAt(0)
                                .toUpperCase()
                            : "S"}
                        </div>

                        <div>

                          <span className="request-category">
                            {request.category ||
                              "General"}
                          </span>

                          <h3>
                            {request.skillName ||
                              "Skill"}
                          </h3>

                        </div>

                      </div>

                      <span
                        className={`request-status ${getStatusClass(
                          request.status
                        )}`}
                      >
                        {request.status || "Pending"}
                      </span>

                    </div>

                    {/* REQUEST DETAILS */}

                    <div className="request-details">

                      <div className="request-detail">

                        <span>
                          Requested from
                        </span>

                        <strong>
                          {request.teacherName ||
                            "SkillSwap User"}
                        </strong>

                      </div>

                      <div className="request-detail">

                        <span>
                          Level
                        </span>

                        <strong>
                          {request.level ||
                            "Not specified"}
                        </strong>

                      </div>

                    </div>

                    {/* MESSAGE */}

                    {request.message && (
                      <div className="request-message">

                        <span>
                          Your Message
                        </span>

                        <p>
                          {request.message}
                        </p>

                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="request-card-actions">
{normalizeStatus(request.status) === "pending" && (
                        <button
                          type="button"
                          className="danger-outline-btn"
                          onClick={() =>
                            handleDelete(request._id)
                          }
                        >
                          Delete Request
                        </button>
                      )}

{normalizeStatus(request.status) === "accepted" && (                 
         <button
                          type="button"
                          className="rating-btn"
                          onClick={() =>
                            handleGiveRating(request)
                          }
                        >
                          ⭐ Give Rating
                        </button>
                      )}

                      {normalizeStatus(request.status) === "rejected" && (
                        <span className="request-rejected-text">
                          This request was rejected.
                        </span>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* ==================================================
              RECEIVED REQUESTS
          ================================================== */}

          <section className="request-section">

            <div className="section-heading">

              <div>

                <span className="section-label">
                  INCOMING
                </span>

                <h2>Received Requests</h2>

              </div>

              <span className="request-count">
                {receivedRequests.length}{" "}
                {receivedRequests.length === 1
                  ? "Request"
                  : "Requests"}
              </span>

            </div>

            {receivedRequests.length === 0 ? (

              <div className="empty-request">

                <div className="empty-request-icon">
                  ↓
                </div>

                <h3>
                  No received requests yet
                </h3>

                <p>
                  When someone requests one of your
                  skills, it will appear here.
                </p>

              </div>

            ) : (

              <div className="request-list">

                {receivedRequests.map((request) => (

                  <div
                    className="request-card received-card"
                    key={request._id}
                  >

                    {/* CARD HEADER */}

                    <div className="request-card-top">

                      <div className="request-skill-info">

                        <div className="request-avatar">

                          {request.requesterName
                            ? request.requesterName
                                .charAt(0)
                                .toUpperCase()
                            : "U"}

                        </div>

                        <div>

                          <span className="request-category">

                            {request.category ||
                              "General"}

                          </span>

                          <h3>

                            {request.skillName ||
                              "Skill"}

                          </h3>

                        </div>

                      </div>

                      <span
                        className={`request-status ${getStatusClass(
                          request.status
                        )}`}
                      >
                        {request.status || "Pending"}
                      </span>

                    </div>

                    {/* REQUEST DETAILS */}

                    <div className="request-details">

                      <div className="request-detail">

                        <span>
                          Requested by
                        </span>

                        <strong>

                          {request.requesterName ||
                            "SkillSwap User"}

                        </strong>

                      </div>

                      <div className="request-detail">

                        <span>
                          Level
                        </span>

                        <strong>

                          {request.level ||
                            "Not specified"}

                        </strong>

                      </div>

                    </div>

                    {/* MESSAGE */}

                    {request.message && (
                      <div className="request-message">

                        <span>
                          Their Message
                        </span>

                        <p>
                          {request.message}
                        </p>

                      </div>
                    )}

                    {/* ==================================================
                        PENDING ACTIONS
                    ================================================== */}

                    {request.status === "Pending" && (

                      <div className="request-card-actions received-actions">

                        <button
                          type="button"
                          className="accept-btn"
                          onClick={() =>
                         handleStatusUpdate(
 request._id,
 "accepted"
)
                       }                       >
                          ✓ Accept
                        </button>

                        <button
                          type="button"
                          className="reject-btn"
                          onClick={() =>
                           handleStatusUpdate(
 request._id,
 "rejected"
)
                          }
                        >
                          ✕ Reject
                        </button>

                        <button
                          type="button"
                          className="report-btn"
                          onClick={() =>
                            handleOpenReport(request)
                          }
                        >
                          🚩 Report
                        </button>

                      </div>

                    )}

                    {/* ==================================================
                        ACCEPTED ACTIONS
                    ================================================== */}

                    {request.status === "Accepted" && (

                      <div className="request-card-actions">

                        <button
                          type="button"
                          className="report-btn"
                          onClick={() =>
                            handleOpenReport(request)
                          }
                        >
                          🚩 Report User
                        </button>

                      </div>

                    )}

                    {/* ==================================================
                        REJECTED
                    ================================================== */}

                    {request.status === "Rejected" && (

                      <div className="request-card-actions">

                        <span className="request-rejected-text">
                          You rejected this request.
                        </span>

                      </div>

                    )}

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>
      )}

      {/* ==================================================
          REPORT MODAL
      ================================================== */}

      {reportingRequest && (

        <div
          className="report-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseReport();
            }
          }}
        >

          <div className="report-modal">

            {/* MODAL HEADER */}

            <div className="report-modal-header">

              <div className="report-modal-icon">
                🚩
              </div>

              <div>

                <span>
                  SAFETY
                </span>

                <h2>
                  Report User
                </h2>

              </div>

            </div>

            {/* INTRO */}

            <p className="report-intro">

              Report{" "}

              <strong>
                {reportingRequest.requesterName ||
                  "SkillSwap User"}
              </strong>

              ? Please select a reason below.

            </p>

            {/* REASON */}

            <div className="report-field">

              <label>
                Select a reason
              </label>

              <select
                value={reportReason}
                onChange={(event) =>
                  setReportReason(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Select reason
                </option>

                <option value="Asking for money">
                  Asking for money
                </option>

                <option value="Asking for personal information">
                  Asking for personal information
                </option>

                <option value="Suspicious message">
                  Suspicious message
                </option>

                <option value="Fake or incorrect skill">
                  Fake or incorrect skill
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* DESCRIPTION */}

            <div className="report-field">

              <label>
                Additional details
              </label>

              <textarea
                placeholder="Tell us more (optional)..."
                value={reportDescription}
                onChange={(event) =>
                  setReportDescription(
                    event.target.value
                  )
                }
                rows={4}
              />

            </div>

            {/* MODAL ACTIONS */}

            <div className="report-actions">

              <button
                type="button"
                className="report-cancel-btn"
                onClick={handleCloseReport}
              >
                Cancel
              </button>

              <button
                type="button"
                className="report-submit-btn"
                onClick={handleSubmitReport}
              >
                Submit Report
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default MyRequests;