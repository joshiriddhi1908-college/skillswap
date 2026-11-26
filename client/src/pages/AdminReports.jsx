
import { useEffect, useState } from "react";
import "./AdminReports.css";

function AdminReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH REPORT
  // ======================================================
  const fetchReport = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/reports"
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load report.");
        return;
      }

      setReport(data);
    } catch (error) {
      console.log("Admin Report Error:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // ======================================================
  // DOWNLOAD CSV REPORT
  // ======================================================
  const downloadReport = () => {
    if (!report) {
      alert("Report data is not available.");
      return;
    }

    const rows = [
      ["SKILLSWAP ADMIN REPORT"],
      [""],

      ["USERS"],
      ["Total Users", report.users.total],
      ["Active Users", report.users.active],
      ["Banned Users", report.users.banned],
      [""],

      ["SKILLS"],
      ["Total Skills", report.skills.total],
      ["Pending Skills", report.skills.pending],
      ["Approved Skills", report.skills.approved],
      ["Rejected Skills", report.skills.rejected],
      [""],

      ["SWAP REQUESTS"],
      ["Total Requests", report.requests.total],
      ["Pending Requests", report.requests.pending],
      ["Accepted Requests", report.requests.accepted],
      ["Cancelled Requests", report.requests.cancelled],
      [""],

      ["ANNOUNCEMENTS"],
      ["Total Announcements", report.announcements.total],
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "SkillSwap_Admin_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ======================================================
  // LOADING
  // ======================================================
  if (loading) {
    return (
      <div className="admin-reports-page">
        <div className="admin-reports-loading">
          <div className="admin-reports-loading-icon">📊</div>

          <h2>Loading Admin Report</h2>

          <p>Fetching SkillSwap platform statistics...</p>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================
  return (
    <div className="admin-reports-page">

      {/* PAGE TITLE */}
      <div className="admin-reports-heading">
        <h1>📊 Admin - Download Reports</h1>

        <p>
          View SkillSwap platform statistics and download
          the complete admin report.
        </p>
      </div>

      {/* MAIN WHITE BOX */}
      <div className="admin-reports-box">

        {/* REPORT CARDS */}
        <div className="admin-report-grid">

          {/* USERS */}
          <div className="admin-report-card users-card">
            <div className="admin-report-card-icon">
              👥
            </div>

            <h2>Users</h2>

            <h3>{report.users?.total || 0}</h3>

            <div className="admin-report-info">
              <p>
                <span>Active</span>
                <strong>{report.users?.active || 0}</strong>
              </p>

              <p>
                <span>Banned</span>
                <strong>{report.users?.banned || 0}</strong>
              </p>
            </div>
          </div>

          {/* SKILLS */}
          <div className="admin-report-card skills-card">
            <div className="admin-report-card-icon">
              🛠️
            </div>

            <h2>Skills</h2>

            <h3>{report.skills?.total || 0}</h3>

            <div className="admin-report-info">
              <p>
                <span>Pending</span>
                <strong>{report.skills?.pending || 0}</strong>
              </p>

              <p>
                <span>Approved</span>
                <strong>{report.skills?.approved || 0}</strong>
              </p>

              <p>
                <span>Rejected</span>
                <strong>{report.skills?.rejected || 0}</strong>
              </p>
            </div>
          </div>

          {/* REQUESTS */}
          <div className="admin-report-card requests-card">
            <div className="admin-report-card-icon">
              🔄
            </div>

            <h2>Requests</h2>

            <h3>{
report.requests?.total || 0}</h3>

            <div className="admin-report-info">
              <p>
                <span>Pending</span>
                <strong>{report.requests?.pending || 0}</strong>
              </p>

              <p>
                <span>Accepted</span>
                <strong>{report.requests?.accepted || 0}</strong>
              </p>

              <p>
                <span>Cancelled</span>
                <strong>{report.requests?.cancelled || 0}</strong>
              </p>
            </div>
          </div>

          {/* ANNOUNCEMENTS */}
          <div className="admin-report-card announcements-card">
            <div className="admin-report-card-icon">
              📢
            </div>

            <h2>Announcements</h2>

            <h3>{report.announcements?.total || 0}</h3>

            <div className="admin-report-info">
              <p>
                <span>Total Published</span>
                <strong>{report.announcements.total}</strong>
              </p>
            </div>
          </div>

        </div>

        {/* DOWNLOAD SECTION */}
        <div className="admin-download-box">

          <div className="admin-download-icon">
            📥
          </div>

          <div className="admin-download-content">
            <h2>Download Complete Report</h2>

            <p>
              Download users, skills, swap requests and
              announcements statistics as a CSV file.
            </p>
          </div>

          <button
            type="button"
            className="admin-download-btn"
            onClick={downloadReport}
          >
            📥 Download Report
          </button>

        </div>

      </div>
    </div>
  );
}

export default AdminReports;

