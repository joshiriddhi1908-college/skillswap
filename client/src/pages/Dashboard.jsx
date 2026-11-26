import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [showNotifications, setShowNotifications] =
    useState(false);

  const userName =
    localStorage.getItem("userName") || "User";

  const userEmail =
    localStorage.getItem("userEmail") || "";

  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  const fetchNotifications = async () => {
    if (!userEmail) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${encodeURIComponent(
          userEmail
        )}`
      );

      const data = await response.json();

      if (response.ok) {
        setNotifications(data);
      }
    } catch (error) {
      console.log(
        "Failed to load notifications"
      );
    }
  };

  // =========================
  // MARK NOTIFICATION AS READ
  // =========================

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        setNotifications((previous) =>
          previous.map((notification) =>
            notification._id === notificationId
              ? {
                ...notification,
                read: true,
              }
              : notification
          )
        );
      }
    } catch (error) {
      console.log(
        "Failed to mark notification as read"
      );
    }
  };

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    // =========================
    // FETCH SKILLS
    // =========================

    const fetchSkills = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/skills/all"
        );

        const data = await response.json();

        if (response.ok) {
          setSkills(data);
        }
      } catch (error) {
        console.log(
          "Failed to load skills"
        );
      }
    };

    // =========================
    // FETCH ANNOUNCEMENTS
    // =========================

    const fetchAnnouncements =
      async () => {
        try {
          const response =
            await fetch(
              "http://localhost:5000/api/announcements"
            );

          const data =
            await response.json();

          if (response.ok) {
            setAnnouncements(data);
          }
        } catch (error) {
          console.log(
            "Failed to load announcements"
          );
        }
      };

    fetchSkills();
    fetchAnnouncements();
    fetchNotifications();

    // =========================
    // CHECK NEW NOTIFICATIONS
    // EVERY 10 SECONDS
    // =========================

    const notificationInterval =
      setInterval(() => {
        fetchNotifications();
      }, 10000);

    return () => {
      clearInterval(
        notificationInterval
      );
    };
  }, [navigate, userEmail]);

  // =========================
  // UNREAD COUNT
  // =========================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  // =========================
  // FILTER SKILLS
  // =========================

  const filteredSkills = skills
    .filter((skill) => {
      // Don't show current user's own skills
      if (
        skill.userEmail?.toLowerCase() ===
        userEmail.toLowerCase()
      ) {
        return false;
      }

      return true;
    })

    .filter((skill) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        skill.skillName
          ?.toLowerCase()
          .includes(searchText) ||
        skill.category
          ?.toLowerCase()
          .includes(searchText) ||
        skill.level
          ?.toLowerCase()
          .includes(searchText) ||
        skill.description
          ?.toLowerCase()
          .includes(searchText) ||
        skill.userName
          ?.toLowerCase()
          .includes(searchText)
      );
    })

    .filter((skill) => {
      if (!category) {
        return true;
      }

      return (
        skill.category?.toLowerCase() ===
        category.toLowerCase()
      );
    });

  // =========================
  // VIEW SKILL DETAILS
  // =========================

  const handleRequest = (skill) => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    navigate("/skill-details", {
      state: {
        skill: skill.skillName,
        category: skill.category,
        level: skill.level,
        skillId: skill._id,
        teacherEmail: skill.userEmail,
        teacherName: skill.userName,
        description: skill.description,
      },
    });
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "userName"
    );

    localStorage.removeItem(
      "userEmail"
    );

    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* =========================
          MAIN
      ========================= */}

      <main className="dashboard-main">

        {/* =========================
            TOP AREA
        ========================= */}

        <div className="dashboard-top">

          {/* WELCOME */}

          <section className="dashboard-welcome">

            <h1>
              Welcome, {userName}
            </h1>

            <p>
              Find skills, share your
              knowledge and connect with
              other users.
            </p>

          </section>


          {/* =========================
              NOTIFICATION
          ========================= */}

          <div className="notification-wrapper">

            <button
              type="button"
              className="notification-button"
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >
              🔔

              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount}
                </span>
              )}
            </button>


            {/* =========================
                NOTIFICATION DROPDOWN
            ========================= */}

            {showNotifications && (

              <div className="notification-dropdown">

                <div className="notification-header">

                  <h3>
                    Notifications
                  </h3>

                  {unreadCount > 0 && (
                    <span>
                      {unreadCount} new
                    </span>
                  )}

                </div>


                {notifications.length === 0 ? (

                  <div className="no-notifications">

                    <div className="no-notification-icon">
                      🔔
                    </div>

                    <p>
                      No notifications yet.
                    </p>

                  </div>

                ) : (

                  <div className="notification-list">

                    {notifications.map(
                      (notification) => (

                        <div
                          key={
                            notification._id
                          }
                          className={`notification-item ${notification.read
                              ? "notification-read"
                              : "notification-unread"
                            }`}
                          onClick={() =>
                            markAsRead(
                              notification._id
                            )
                          }
                        >

                          <div className="notification-icon">
                            {notification.type ===
                              "rating"
                              ? "⭐"
                              : "🔔"}
                          </div>


                          <div className="notification-content">

                            <h4>
                              {notification.title ||
                                "Notification"}
                            </h4>

                            <p>
                              {notification.message}
                            </p>


                            {notification.type ===
                              "rating" && (

                                <>

                                  <div className="notification-rating">

                                    {[
                                      1,
                                      2,
                                      3,
                                      4,
                                      5,
                                    ].map(
                                      (star) => (
                                        <span
                                          key={star}
                                          className={
                                            star <=
                                              notification.rating
                                              ? "star-active"
                                              : "star-inactive"
                                          }
                                        >
                                          ★
                                        </span>
                                      )
                                    )}

                                  </div>


                                  {notification.feedback && (

                                    <p className="notification-feedback">

                                      "{notification.feedback}"

                                    </p>

                                  )}

                                </>

                              )}


                            <small>
                              {notification.createdAt
                                ? new Date(
                                  notification.createdAt
                                ).toLocaleString()
                                : ""}
                            </small>

                          </div>


                          {!notification.read && (
                            <span className="unread-dot">
                              ●
                            </span>
                          )}

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          </div>

        </div>


        {/* =========================
            SEARCH
        ========================= */}

        <section className="dashboard-search">

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
          >

            <option value="">
              Select Category
            </option>

            <option value="Technology">
              Technology
            </option>

            <option value="Design">
              Design
            </option>

            <option value="Music">
              Music
            </option>

            <option value="Language">
              Language
            </option>

            <option value="Business">
              Business
            </option>

          </select>


          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />


          <button
            onClick={() =>
              navigate("/skills")
            }
          >
            Search
          </button>

        </section>


        {/* =========================
            AVAILABLE SKILLS
        ========================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <h2>
              Available Skills
            </h2>

            <button
              className="view-all-button"
              onClick={() =>
                navigate("/skills")
              }
            >
              View All
            </button>

          </div>


          {filteredSkills.length ===
            0 ? (

            <div className="announcement-card">

              <p>
                No skills available.
              </p>

            </div>

          ) : (

            <div className="dashboard-skills-list">

              {filteredSkills
                .slice(0, 6)
                .map((skill) => (

                  <div
                    className="dashboard-skill-card"
                    key={skill._id}
                  >

                    {/* PROFILE */}

                    <div className="skill-card-profile">

                      <div className="profile-avatar">

                        {skill.userName
                          ? skill.userName
                            .charAt(0)
                            .toUpperCase()
                          : "U"}

                      </div>


                      <div className="profile-info">

                        <h3>
                          {skill.userName ||
                            "Skill User"}
                        </h3>

                        <span>
                          {skill.userEmail ||
                            "User"}
                        </span>

                      </div>

                    </div>


                    {/* SKILL INFORMATION */}

                    <div className="skill-card-content">

                      <h2>
                        {skill.skillName ||
                          "Skill"}
                      </h2>


                      <div className="skill-tags">

                        <span className="skill-category">

                          {skill.category ||
                            "General"}

                        </span>

                        <span className="skill-level">

                          {skill.level ||
                            "Beginner"}

                        </span>

                      </div>


                      {skill.description && (

                        <p className="skill-description">

                          {skill.description}

                        </p>

                      )}

                    </div>


                    {/* VIEW DETAILS */}

                    <div className="skill-card-action">

                      <button
                        type="button"
                        className="request-skill-btn"
                        onClick={() =>
                          handleRequest(skill)
                        }
                      >
                        View Details
                      </button>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>


        {/* =========================
            ANNOUNCEMENTS
        ========================= */}

        {announcements.length > 0 && (

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Platform Announcements
              </h2>

            </div>


            <div className="announcement-list">

              {announcements
                .slice(0, 3)
                .map(
                  (announcement) => (

                    <div
                      className="announcement-card"
                      key={
                        announcement._id
                      }
                    >

                      <div className="announcement-left">
                        📢
                      </div>


                      <div className="announcement-body">

                        <h3>
                          {announcement.title}
                        </h3>

                        <p>
                          {announcement.message}
                        </p>

                        <small>
                          Published by{" "}
                          {announcement.createdBy ||
                            "Admin"}
                        </small>

                      </div>

                    </div>

                  )
                )}

            </div>

          </section>

        )}


        {/* =========================
            PAGINATION
        ========================= */}

        <div className="dashboard-pagination">

          <button className="pagination-active">
            1
          </button>

          <button>
            2
          </button>

          <button>
            3
          </button>

          <button>
            4
          </button>

          <button>
            5
          </button>

          <button>
            &gt;
          </button>

        </div>


        {/* =========================
            FIND SKILLS
        ========================= */}

        <section className="find-skills-box">

          <div>

            <h2>
              Find Skills
            </h2>

            <p>
              Explore skills offered by
              other users.
            </p>

          </div>


          <button
            onClick={() =>
              navigate("/skills")
            }
          >
            Explore Skills
          </button>

        </section>


        {/* =========================
            LOGOUT
        ========================= */}

        <div className="dashboard-logout">

          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="dashboard-footer">

        <p>
          © 2026 SkillSwap. Learn. Share. Grow.
        </p>

      </footer>

    </div>
  );
}

export default Dashboard;