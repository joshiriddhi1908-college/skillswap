import { useEffect, useState } from "react";
import "./AdminSwaps.css";

function AdminSwaps() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH SWAP REQUESTS
  // ======================================================

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/requests"
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load swap requests.");
        return;
      }

      setRequests(data);
    } catch (error) {
      console.log("Admin Swap Error:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ======================================================
  // FILTER
  // ======================================================

  const displayedRequests = requests.filter((request) => {
    if (filter === "All") {
      return true;
    }

    if (filter === "Cancelled") {
      return request.status === "Rejected";
    }

    return request.status === filter;
  });

  // ======================================================
  // STATUS CLASS
  // ======================================================

  const getStatusClass = (status) => {
    if (status === "Pending") {
      return "pending";
    }

    if (status === "Accepted") {
      return "accepted";
    }

    if (status === "Rejected") {
      return "cancelled";
    }

    return "";
  };

  // ======================================================
  // STATUS TEXT
  // ======================================================

  const getStatusText = (status) => {
    if (status === "Rejected") {
      return "Cancelled";
    }

    return status;
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="admin-swaps-page">
        <div className="admin-swaps-loading">
          <div className="admin-swaps-loading-icon">
            🔄
          </div>

          <h2>Admin - Swap Monitoring</h2>

          <p>Loading swap requests...</p>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="admin-swaps-page">

      {/* HEADER */}

      <div className="admin-swaps-header">

        <h1>
          🔄 Admin - Swap Monitoring
        </h1>

        <p>
          Monitor all skill swap requests and their current status.
        </p>

      </div>


      {/* MAIN BOX */}

      <div className="admin-swaps-box">

        {/* FILTER */}

        <div className="admin-swap-filters">

          <button
            type="button"
            className={filter === "All" ? "active" : ""}
            onClick={() => setFilter("All")}
          >
            📋 All
          </button>

          <button
            type="button"
            className={filter === "Pending" ? "active" : ""}
            onClick={() => setFilter("Pending")}
          >
            🟡 Pending
          </button>

          <button
            type="button"
            className={filter === "Accepted" ? "active" : ""}
            onClick={() => setFilter("Accepted")}
          >
            🟢 Accepted
          </button>

          <button
            type="button"
            className={filter === "Cancelled" ? "active" : ""}
            onClick={() => setFilter("Cancelled")}
          >
            🔴 Cancelled
          </button>

        </div>


        {/* REQUEST LIST */}

        <div className="admin-swap-list">

          {displayedRequests.length === 0 ? (

            <div className="admin-swap-empty">

              <span>📭</span>

              <h3>
                No{" "}
                {filter !== "All"
                  ? filter.toLowerCase()
                  : ""}{" "}
                swap requests found.
              </h3>

              <p>
                There are no requests in this category.
              </p>

            </div>

          ) : (

            displayedRequests.map((request) => (

              <div
                className="admin-swap-item"
                key={request._id}
              >

                {/* REQUEST INFORMATION */}

                <div className="admin-swap-info">

                  <h2>
                    {request.skillName}
                  </h2>

                  <div className="admin-swap-details">

                    <p>
                      <strong>From:</strong>{" "}
                      {request.requesterName}
                    </p>

                    <p>
                      <strong>Requester Email:</strong>{" "}
                      {request.requesterEmail}
                    </p>

                    <p>
                      <strong>To:</strong>{" "}
                      {request.teacherName}
                    </p>

                    <p>
                      <strong>Teacher Email:</strong>{" "}
                      {request.teacherEmail}
                    </p>

                    <p>
                      <strong>Category:</strong>{" "}
                      {request.category}
                    </p>

                    <p>
                      <strong>Level:</strong>{" "}
                      {request.level}
                    </p>

                  </div>


                  {/* MESSAGE */}

                  <div className="admin-swap-message">

                    <strong>Message</strong>

                    <p>
                      {request.message}
                    </p>

                  </div>

                </div>


                {/* STATUS */}

                <div className="admin-swap-status-box">

                  <span className="admin-swap-status-label">
                    Status
                  </span>

                  <span
                    className={`swap-status ${getStatusClass(
                      request.status
                    )}`}
                  >

                    {request.status === "Pending" && "🟡 "}
                    {request.status === "Accepted" && "🟢 "}
                    {request.status === "Rejected" && "🔴 "}

                    {getStatusText(request.status)}

                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminSwaps;