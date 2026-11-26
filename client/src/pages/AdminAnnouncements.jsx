import { useEffect, useState } from "react";
import "./AdminAnnouncements.css";

function AdminAnnouncements() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ======================================================
  // GET ANNOUNCEMENTS
  // ======================================================

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/announcements"
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load announcements.");
        return;
      }

      setAnnouncements(data);
    } catch (error) {
      console.log("Get Announcements Error:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ======================================================
  // PUBLISH
  // ======================================================

  const publishAnnouncement = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Please enter both title and message.");
      return;
    }

    setPublishing(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/announcements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to publish announcement.");
        return;
      }

      alert("Announcement published successfully! 📢");

      setTitle("");
      setMessage("");

    setAnnouncements((prev) => [
  data,
  ...prev,
]);
    } catch (error) {
      console.log("Publish Announcement Error:", error);
      alert("Unable to connect to server.");
    } finally {
      setPublishing(false);
    }
  };

  // ======================================================
  // DELETE
  // ======================================================

  const deleteAnnouncement = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/announcements/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to delete announcement."
        );
        return;
      }

      alert("Announcement deleted successfully! 🗑️");

      setAnnouncements((prev) =>
        prev.filter(
          (announcement) => announcement._id !== id
        )
      );
    } catch (error) {
      console.log("Delete Announcement Error:", error);

      alert("Unable to connect to server.");
    } finally {
      setDeletingId(null);
    }
  };

  // ======================================================
  // JSX
  // ======================================================

  return (
    <div className="admin-announcement">

      {/* HEADER */}

      <div className="admin-announcement-header">

        <h1>
          📢 Admin - Platform Announcement
        </h1>

        <p>
          Send an announcement to all SkillSwap users.
        </p>

      </div>


      {/* MAIN BOX */}

      <div className="announcement-card">

        {/* CREATE ANNOUNCEMENT */}

        <form onSubmit={publishAnnouncement}>

          <label>
            Announcement Title
          </label>

          <input
            type="text"
            placeholder="Enter announcement title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />


          <label>
            Message
          </label>

          <textarea
            placeholder="Write your message for all users..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            rows="5"
          />


          <button
            type="submit"
            disabled={publishing}
          >
            {publishing
              ? "Publishing..."
              : "📢 Publish Announcement"}
          </button>

        </form>


        {/* PREVIOUS ANNOUNCEMENTS */}

        <div className="previous-announcements">

          <h2>
            📋 Previous Announcements
          </h2>


          {loading ? (

            <p className="announcement-empty">
              Loading announcements...
            </p>

          ) : announcements.length === 0 ? (

            <p className="announcement-empty">
              No announcements published yet.
            </p>

          ) : (

            <div className="announcement-list">

              {announcements.map((announcement) => (

                <div
                  className="announcement-item"
                  key={announcement._id}
                >

                  <div className="announcement-item-content">

                    <h3>
                      📢 {announcement.title}
                    </h3>

                    <p>
                      {announcement.message}
                    </p>

                    <small>
                      Published by{" "}
                      {announcement.createdBy}
                    </small>

                  </div>


                  <button
                    type="button"
                    className="delete-announcement-btn"
                    onClick={() =>
                      deleteAnnouncement(
                        announcement._id
                      )
                    }
                    disabled={
                      deletingId ===
                      announcement._id
                    }
                  >
                    {deletingId ===
                      announcement._id
                      ? "Deleting..."
                      : "🗑️ Delete"}
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminAnnouncements;