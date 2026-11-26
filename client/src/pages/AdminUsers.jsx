import { useEffect, useState } from "react";
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/users"
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load users.");
        return;
      }

      setUsers(data);
    } catch (error) {
      console.log("Admin Users Error:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const banUser = async (id) => {
    const confirmBan = window.confirm(
      "Are you sure you want to ban this user?"
    );

    if (!confirmBan) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/ban/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to ban user.");
        return;
      }

      alert("User banned successfully! 🚫");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id
            ? { ...user, isBanned: true }
            : user
        )
      );
    } catch (error) {
      console.log("Ban User Error:", error);
      alert("Unable to connect to server.");
    }
  };

  const unbanUser = async (id) => {
    const confirmUnban = window.confirm(
      "Are you sure you want to unban this user?"
    );

    if (!confirmUnban) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/unban/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to unban user.");
        return;
      }

      alert("User unbanned successfully! ✅");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id
            ? { ...user, isBanned: false }
            : user
        )
      );
    } catch (error) {
      console.log("Unban User Error:", error);
      alert("Unable to connect to server.");
    }
  };

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="admin-users-loading">
          <div className="admin-users-loading-icon">
            👥
          </div>

          <h2>Admin - User Management</h2>

          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-page">

      <div className="admin-users-header">
        <h1>🛡️ Admin - User Management</h1>

        <p>
          Manage registered users and their account status.
        </p>
      </div>

      <div className="admin-users-box">

        <h2 className="admin-users-title">
          👥 Registered Users
        </h2>

        {users.length === 0 ? (

          <div className="admin-users-empty">
            <span>📭</span>

            <h3>No users found.</h3>

            <p>
              There are no registered users to manage.
            </p>
          </div>

        ) : (

          <div className="admin-users-list">

            {users.map((user) => (

              <div
                className="admin-user-item"
                key={user._id}
              >

                <div className="admin-user-avatar">
                  👤
                </div>

                <div className="admin-user-info">

                  <h3>
                    {user.fullName}
                  </h3>

                  <p>
                    <strong>Email:</strong>{" "}
                    {user.email}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {user.location || "Not added"}
                  </p>

                  <div className="admin-user-status-row">

                    <strong>Status:</strong>

                    {user.isBanned ? (
                      <span className="admin-user-status banned">
                        🚫 Banned
                      </span>
                    ) : (
                      <span className="admin-user-status active">
                        ✅ Active
                      </span>
                    )}

                  </div>

                </div>

                <div className="admin-user-action">

                  {user.isBanned ? (

                    <button
                      type="button"
                      className="admin-user-btn unban"
                      onClick={() => unbanUser(user._id)}
                    >
                      ✅ Unban User
                    </button>

                  ) : (

                    <button
                      type="button"
                      className="admin-user-btn ban"
                      onClick={() => banUser(user._id)}
                    >
                      🚫 Ban User
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminUsers;